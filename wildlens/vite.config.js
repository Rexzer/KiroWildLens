import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Mobile-first demo. `npm run dev` then open on your phone via the LAN URL
// shown in the terminal so you can test the real QR scan + camera.
export default defineConfig({
  plugins: [react()],
  server: { host: true },
});
