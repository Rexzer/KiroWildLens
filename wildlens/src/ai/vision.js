/*
 * WildLens on-device vision — the AI that RECOGNISES the real animal.
 *
 * Runs entirely in the browser with TensorFlow.js + MobileNet (ImageNet). No
 * API key, no server, no per-call cost — the model weights download once from a
 * CDN and inference happens on the device. Used in two places:
 *
 *   1. Look-to-Unlock  — confirm the guest is really pointing at THIS animal
 *                        (see components/LiveLook.jsx).
 *   2. Scan-any-animal — identify which species is in frame with no QR marker
 *                        (see components/AnimalScanner.jsx).
 *
 * Everything is lazy-loaded and defensively guarded: if the model can't load
 * (offline, old device, packages missing) the callers fall back to the manual
 * tap/confirm paths, so the demo never hard-fails.
 *
 * PRODUCTION NOTE: MobileNet/ImageNet gives broad labels ("hornbill", "ape").
 * For guaranteed species-level precision, swap loadModel() for a model trained
 * on Mandai's own species (e.g. Amazon Rekognition Custom Labels or a custom
 * TF.js graph model) — the confirmPresence/matchSpecies contract stays the same.
 */

let _model = null;
let _loading = null;
let _failed = false;

async function loadModel() {
  if (_model) return _model;
  if (_failed) throw new Error("vision-unavailable");
  if (_loading) return _loading;
  _loading = (async () => {
    const tf = await import("@tensorflow/tfjs");
    await tf.ready();
    const mobilenet = await import("@tensorflow-models/mobilenet");
    _model = await mobilenet.load({ version: 2, alpha: 1.0 });
    return _model;
  })().catch((e) => {
    _failed = true;
    _loading = null;
    throw e;
  });
  return _loading;
}

// Kick off model loading early (e.g. when the guest opens a camera view) so the
// first classification isn't slow. Resolves true/false — never throws.
export async function warmup() {
  try {
    await loadModel();
    return true;
  } catch {
    return false;
  }
}

export function visionFailed() {
  return _failed;
}

// Classify one frame (a <video>, <img> or <canvas>). Returns predictions as
// [{ label, score }] sorted by confidence. Labels are lower-cased; ImageNet
// classes can be comma-lists (e.g. "orangutan, orang, orangutang") so we keep
// the whole string and match against it as a substring.
export async function classifyFrame(el, topK = 5) {
  const model = await loadModel();
  const preds = await model.classify(el, topK);
  return (preds || []).map((p) => ({
    label: (p.className || "").toLowerCase(),
    score: p.probability || 0,
  }));
}

// Does any prediction look like the target species? `keywords` come from a
// species' `visionMatch` list. Returns the best matching prediction, plus a
// loose "any animal at all" signal for friendlier messaging.
export function confirmPresence(preds, keywords = []) {
  for (const p of preds) {
    if (keywords.some((k) => p.label.includes(k))) {
      return { ok: true, label: p.label, score: p.score };
    }
  }
  const top = preds[0] || { label: "", score: 0 };
  return { ok: false, label: top.label, score: top.score };
}

// Which species in the catalog does this frame most look like? `catalog` is
// [{ id, keywords }]. Returns { id, label, score } or null. We scan predictions
// in confidence order so the strongest signal wins.
export function matchSpecies(preds, catalog = []) {
  for (const p of preds) {
    for (const c of catalog) {
      if ((c.keywords || []).some((k) => p.label.includes(k))) {
        return { id: c.id, label: p.label, score: p.score };
      }
    }
  }
  return null;
}
