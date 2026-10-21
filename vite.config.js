import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// On GitHub Pages the app lives at /StudyPlanner/, locally it lives at /.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? "/StudyPlanner/" : "/",
});
