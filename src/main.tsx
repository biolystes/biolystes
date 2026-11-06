import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { desactiverClicDroit } from "./lib/clic-droit";

const retirerBlocageClicDroit = desactiverClicDroit(document);
if (import.meta.hot) import.meta.hot.dispose(retirerBlocageClicDroit);

const root = document.getElementById("root");
if (!root) throw new Error("Élément racine introuvable");

createRoot(root).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
