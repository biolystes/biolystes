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

/* Même mot de passe et même accès pour le catalogue et /tarifs (JP, 14/10/2026) :
   l'offre ne se voit qu'avec le mot de passe donné par la conseillère. */
export default function CatalogPasswordGate({
  children,
  titre = "Catalogue privé",
  objet = "au catalogue",
}: {
  children: ReactNode;
  titre?: string;
  objet?: string;
}) {
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

  /* Identité du site (JP, 14/10/2026 : « ce n'est pas mon identité ») : plus de
     boîte noire, de titre à empattements ni de bouton vert. Fond blanc, en-tête
     de section de l'accueil (sur-titre espacé, titre léger noir puis gris), carte
     #f3f4f5, bouton noir à rond blanc (.btn-startup), comme /tarifs et l'accueil. */
  /* Marges en ligne : le Tailwind des pages du pied ne génère pas toutes les
     classes de ce composant (pt-32, p-6 absents). */
  return (
    <section className="bg-white flex justify-center" style={{ padding: "clamp(40px, 7vw, 88px) 16px clamp(64px, 8vw, 96px)" }}>
      <div className="w-full max-w-md text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-foreground">{titre}</p>
        <h1
          className="mt-4 text-[1.5rem] md:text-[1.75rem] !font-light tracking-tight text-foreground leading-[1.25]"
          style={{ textWrap: "balance", fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif" }}
        >
          Entrez votre mot de passe <span className="text-muted-foreground">pour accéder {objet}.</span>
        </h1>
        <form onSubmit={submit} className="mt-8 rounded-2xl bg-[#f3f4f5] text-left" style={{ padding: "clamp(24px, 5vw, 32px)" }}>
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Mot de passe"
            autoFocus
            aria-label="Mot de passe"
            className="w-full h-12 rounded-full border border-black/15 bg-white px-5 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-black"
          />
          {error && <p className="mt-2 px-2 text-sm text-red-600">Mot de passe incorrect.</p>}
          <button type="submit" className="btn-startup mt-4 w-full !justify-between">
            <span>Accéder</span>
            <span className="arrow-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </span>
          </button>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground" style={{ textWrap: "pretty" }}>
            Votre conseillère vous donne le mot de passe. Pas encore de conseillère&nbsp;?{" "}
            <a href={LIEN_RDV} target="_blank" rel="noopener noreferrer" className="text-foreground font-medium underline underline-offset-4 whitespace-nowrap">
              Prendre rendez-vous
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
