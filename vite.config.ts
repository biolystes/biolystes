import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";
import { articlesJsonVite } from "./scripts/articles-json";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  /* /blog/articles.json, lu par la fenêtre « L’actualité » du widget Lystes. */
  plugins: [react(), mcpPlugin(), articlesJsonVite(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      /* Page d’accueil reprise de lystes.ai/bio : ses fichiers vivent dans
         lystes/src, avec leurs propres chemins. */
      "@lystes": path.resolve(__dirname, "./lystes/src"),
    },
  },
}));
