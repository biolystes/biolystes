/* Bandeau de consentement aux cookies de mesure d'audience (23/10/2026).
   Identité du site : encart blanc discret en bas, texte noir puis une ligne
   grise, « Refuser » et « Accepter » de même taille et de même poids (blanc à
   bordure noire / noir), angles droits. Sur téléphone : marges de 16 px, posé
   au-dessus de la barre « actus » du widget Lystes pour ne pas la couvrir.
   Le lien « Gérer mes cookies » du pied de page (href="#cookies") le rouvre. */
import { useEffect, useState } from "react";
import { enregistrerChoix, lireChoix, type Choix } from "@/lib/consentement";

const css = `
.bandeau-cookies{position:fixed;z-index:1000;left:24px;bottom:24px;width:min(400px,calc(100vw - 48px));box-sizing:border-box;background:#fff;color:#111;border:1px solid rgba(0,0,0,.14);box-shadow:0 10px 30px rgba(0,0,0,.08);padding:20px;font-family:'Inter',system-ui,sans-serif;text-align:left}
.bandeau-cookies p{margin:0}
.bandeau-cookies .bc-titre{font-size:14px;line-height:1.4;color:#111;font-weight:500}
.bandeau-cookies .bc-gris{margin-top:6px;font-size:13px;line-height:1.45;color:#6b6b6b}
.bandeau-cookies .bc-titre{text-wrap:balance}
.bandeau-cookies .bc-gris a{display:block;margin-top:2px;color:#111;text-decoration:underline;text-underline-offset:2px}
.bandeau-cookies .bc-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}
.bandeau-cookies button{box-sizing:border-box;height:42px;border:1px solid #000;border-radius:0;font:inherit;font-size:14px;font-weight:500;cursor:pointer;padding:0 12px}
.bandeau-cookies .bc-refuser{background:#fff;color:#000}
.bandeau-cookies .bc-accepter{background:#000;color:#fff}
.bandeau-cookies button:focus-visible{outline:2px solid #000;outline-offset:2px}
@media (max-width:767px){
.bandeau-cookies{left:16px;right:16px;width:auto;bottom:calc(124px + env(safe-area-inset-bottom,0px));padding:16px}
.bandeau-cookies .bc-titre{font-size:13px}
.bandeau-cookies .bc-gris{font-size:12px;margin-top:4px}
.bandeau-cookies .bc-actions{margin-top:12px}
.bandeau-cookies button{height:40px;font-size:13px}
}
`;

export default function BandeauCookies() {
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    if (lireChoix() === null) setOuvert(true);
    /* « Gérer mes cookies » (pied de page) rouvre le bandeau. */
    const surClic = (e: MouseEvent) => {
      const lien = (e.target as Element | null)?.closest?.('a[href="#cookies"]');
      if (!lien) return;
      e.preventDefault();
      setOuvert(true);
    };
    document.addEventListener("click", surClic);
    return () => document.removeEventListener("click", surClic);
  }, []);

  if (!ouvert) return null;

  const choisir = (choix: Choix) => {
    enregistrerChoix(choix);
    setOuvert(false);
  };

  return (
    <>
      <style>{css}</style>
      <div className="bandeau-cookies" role="dialog" aria-label="Cookies" data-testid="bandeau-cookies">
        <p className="bc-titre">Nous mesurons l'audience du site avec Google Analytics.</p>
        <p className="bc-gris">
          Rien n'est mesuré sans votre accord. <a href="/politique-confidentialite">Politique de confidentialité</a>
        </p>
        <div className="bc-actions">
          <button type="button" className="bc-refuser" onClick={() => choisir("refuse")}>Refuser</button>
          <button type="button" className="bc-accepter" onClick={() => choisir("accepte")}>Accepter</button>
        </div>
      </div>
    </>
  );
}
