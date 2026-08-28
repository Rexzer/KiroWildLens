// Minimal persistence so Wrapped badges + Explore scan counts survive
// navigating around the app (and a page refresh) without needing a backend.
const KEY = "wildlens_state_v1";

export function loadPersisted() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePersisted(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage unavailable (e.g. private mode) — demo still works, just won't persist
  }
}

export function clearPersisted() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
