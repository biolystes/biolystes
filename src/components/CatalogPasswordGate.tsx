import { useState, useLayoutEffect, ReactNode } from "react";

const KEY = "catalog_access_ok";
const PASSWORD = "biolystes";

/* Prise de rendez-vous sur biolystes.pro (lien donné par JP le 14/10/2026). */
const LIEN_RDV = "https://biolystes.pro/rdv";

/* Le catalogue suit la largeur du téléphone dès l’écran du mot de passe
   (14/10/2026). index.html le fait au premier chargement de /catalogue ;
   ceci suit la navigation interne et rend la largeur d’avant en quittant,
   comme src/pages/CoquilleLystes.tsx. */
const LARGEUR_APPAREIL = "width=device-width, initial-scale=1.0";

export default function CatalogPasswordGate({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(() => typeof window !== "undefined" && sessionStorage.getItem(KEY) === "1");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useLayoutEffect(() => {
    const fenetre = document.querySelector('meta[name="viewport"]');
    const largeurAvant = fenetre?.getAttribute("content");
    fenetre?.setAttribute("content", LARGEUR_APPAREIL);
    return () => {
      if (fenetre && largeurAvant) {
        fenetre.setAttribute("content", largeurAvant === LARGEUR_APPAREIL ? "width=1200" : largeurAvant);
      }
    };
  }, []);

  if (ok) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSWORD) {
      sessionStorage.setItem(KEY, "1");
      setOk(true);
    } else setError(true);
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", background: "#ffffff" }}>
      <form onSubmit={submit} style={{ background: "#121212", color: "#ffffff", padding: "clamp(28px, 8vw, 40px)", borderRadius: "2rem", width: "100%", maxWidth: 400, textAlign: "center", boxSizing: "border-box" }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 9vw, 36px)", lineHeight: 1.1, marginBottom: 8, color: "#ffffff", textWrap: "balance" }}>Catalogue privé</h1>
        <p style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.8, marginBottom: 24, color: "#ffffff", textWrap: "pretty" }}>Entrez le mot de passe pour accéder au catalogue.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          placeholder="Mot de passe"
          autoFocus
          aria-label="Mot de passe"
          style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", fontSize: 16, borderRadius: 999, border: "1px solid #2f5955", background: "#f3f4f5", color: "#121212", marginBottom: 12 }}
        />
        {error && <p style={{ color: "#ff8a80", fontSize: 13, marginBottom: 12 }}>Mot de passe incorrect</p>}
        <button type="submit" style={{ width: "100%", padding: "12px 16px", fontSize: 16, borderRadius: 999, background: "#2f5955", color: "#ffffff", fontWeight: 600 }}>
          Accéder
        </button>
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255, 255, 255, 0.15)", fontSize: 14, lineHeight: 1.5, color: "#ffffff", textWrap: "balance" }}>
          <p style={{ color: "#ffffff", opacity: 0.8 }}>Votre conseillère vous donne le mot de passe.</p>
          <p style={{ color: "#ffffff", opacity: 0.8, marginTop: 4 }}>Pas encore de conseillère&nbsp;?</p>
          <p style={{ color: "#ffffff", marginTop: 4 }}>
            <a href={LIEN_RDV} style={{ color: "#ffffff", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3, whiteSpace: "nowrap" }}>
              Prenez rendez-vous
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
