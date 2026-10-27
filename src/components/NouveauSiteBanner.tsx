/* Bandeau « biolystes.com est en ligne » en tête du catalogue (JP, 27/10/2026) :
   même bannière que celle de l'accueil de biolystes.pro (AnnonceBiolystes du
   dépôt commandcenterbiolystes) : carte #1d1d1f de 280 px, vidéo
   bio-hero-ordi sur 62 % de la largeur à droite cadrée à 20 % du haut, voile
   dégradé de gauche à droite, bouton noir pilule à pastille blanche fléchée,
   croix de fermeture. Sur téléphone la vidéo prend toute la largeur sous un
   voile sombre. Image fixe si les animations sont réduites.
   Fermeture mémorisée pour la session (sessionStorage) : elle ne revient pas à
   chaque changement de catégorie, mais réapparaît à la session suivante. */
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const CLE_SESSION = "nouveau_site_banniere_fermee";
const URL_SITE = "https://biolystes.com";

const CSS = `
.nsb{ position:relative; overflow:hidden; isolation:isolate; border-radius:20px; background:#1d1d1f; color:#fff;
  height:280px; font-family:-apple-system,BlinkMacSystemFont,"Bricolage Grotesque","Helvetica Neue",Helvetica,Arial,sans-serif; }
.nsb *{ box-sizing:border-box; }
.nsb-fond{ position:absolute; top:0; right:0; bottom:0; left:auto; width:62%; height:100%; object-fit:cover; object-position:50% 20%; pointer-events:none; z-index:0; }
.nsb-voile{ position:absolute; inset:0; z-index:1; background:linear-gradient(90deg, #1d1d1f 0%, #1d1d1f 38%, rgba(29,29,31,.55) 52%, rgba(0,0,0,.10) 100%); }
.nsb-in{ position:relative; z-index:2; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:flex-start;
  padding:0 clamp(28px,4.5vw,64px); }
.nsb-h{ font-family:'Bricolage Grotesque'; font-weight:500; font-size:clamp(24px,0.6vw,50px); line-height:1.1; letter-spacing:-.02em;
  margin:0 0 12px; max-width:min(calc(100% - 40px), 600px); color:#fff; text-wrap:balance; }
.nsb-p{ font-size:15px; line-height:1.45; color:rgba(255,255,255,.9); margin:0 0 22px; max-width:640px; text-wrap:pretty; }
.nsb-btn{ display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:9px 1px 11px 9px; min-height:52px; border-radius:999px;
  font-size:13px; font-weight:500; line-height:1; text-decoration:none; min-width:183px; background:#000; color:#fff;
  transition:opacity .2s, transform .2s, background-color .2s; }
.nsb-btn:hover{ opacity:.9; transform:translateY(-2px); }
.nsb-btn:focus-visible{ outline:2px solid #fff; outline-offset:3px; }
.nsb-lbl{ white-space:nowrap; }
.nsb-arrow{ display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; flex:none; background:#fff; color:#000; }
.nsb-arrow svg{ width:14px; height:14px; }
.nsb-x{ position:absolute; top:14px; right:14px; z-index:3; width:32px; height:32px; border-radius:999px; border:0; cursor:pointer;
  display:inline-flex; align-items:center; justify-content:center; color:#fff; background:rgba(0,0,0,.35);
  -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px); transition:background-color .2s; }
.nsb-x:hover{ background:rgba(0,0,0,.55); }
.nsb-x:focus-visible{ outline:2px solid #fff; outline-offset:2px; }
@media (max-width:720px){
  .nsb{ height:auto; min-height:220px; border-radius:16px; }
  .nsb-fond{ left:0; width:100%; object-position:62% 30%; }
  .nsb-voile{ background:linear-gradient(to top, rgba(0,0,0,.66) 0%, rgba(0,0,0,.40) 55%, rgba(0,0,0,.25) 100%); }
  .nsb-in{ padding:22px 18px 18px; justify-content:flex-end; }
  .nsb-h{ font-size:clamp(24px,6.6vw,30px); line-height:1.08; margin-bottom:8px; padding-right:28px; }
  .nsb-p{ font-size:13px; margin-bottom:14px; }
  .nsb-btn{ width:100%; height:48px; min-height:0; min-width:0; justify-content:space-between; padding:6px 6px 6px 18px; font-size:14px; }
  .nsb-arrow{ width:34px; height:34px; }
  .nsb-arrow svg{ width:11px; height:11px; }
  .nsb-x{ top:10px; right:10px; width:28px; height:28px; }
}
`;

export default function NouveauSiteBanner() {
  const [ferme, setFerme] = useState(() => {
    try {
      return sessionStorage.getItem(CLE_SESSION) === "1";
    } catch {
      return false;
    }
  });
  const [fixe, setFixe] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const maj = () => setFixe(mq.matches);
    maj();
    mq.addEventListener?.("change", maj);
    return () => mq.removeEventListener?.("change", maj);
  }, []);

  if (ferme) return null;

  const fermer = () => {
    try {
      sessionStorage.setItem(CLE_SESSION, "1");
    } catch {
      /* navigation privée : le bandeau se ferme quand même pour la page */
    }
    setFerme(true);
  };

  return (
    <aside className="nsb" aria-label="Nouveau site Biolystes">
      <style>{CSS}</style>
      {fixe ? (
        <img className="nsb-fond" src="/videos/bio/bio-hero-ordi.webp" alt="" />
      ) : (
        <video
          className="nsb-fond"
          src="/videos/bio/bio-hero-ordi.mp4"
          poster="/videos/bio/bio-hero-ordi.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      )}
      <div className="nsb-voile" aria-hidden="true" />
      <div className="nsb-in">
        <h2 className="nsb-h">biolystes.com est en&nbsp;ligne</h2>
        <p className="nsb-p">Nouveau site est en ligne.</p>
        <a className="nsb-btn" href={URL_SITE} target="_blank" rel="noopener noreferrer">
          <span className="nsb-lbl">Voir le nouveau site</span>
          <span className="nsb-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </span>
        </a>
      </div>
      <button type="button" className="nsb-x" onClick={fermer} aria-label="Fermer le bandeau">
        <X size={16} strokeWidth={2} />
      </button>
    </aside>
  );
}
