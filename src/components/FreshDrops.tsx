/* Pastille « Fresh drops » de l'en-tête de l'accueil (JP, 19/11/2026).

   Elle garde EXACTEMENT la forme, le verre translucide, la taille, la police et
   les couleurs de l'ancienne bascule « E-commerce | Agents IA » : la partie
   blanche porte « Fresh drops », la partie transparente accueille deux yeux qui
   regardent autour, puis se transforment en « N New », en boucle. De higgsfield.ai
   on ne reprend que le principe (yeux animés, « N New », panneau au clic), pas le
   style : identité minimaliste du site (blanc, noir, gris clair #f3f4f5, une seule
   police), aucun vert, aucun dégradé, AUCUNE ombre (ni box-shadow, ni text-shadow,
   ni halo).

   Panneau (mise en page validée par JP le 19/11/2026) : à gauche un slider de
   6 nouveautés (partenariat HR & Associés, goodies, meet-up, events de lancement en vidéo, presse, IA en vidéo), à droite « Les
   dernières actus » (articles de « L'actualité » : articles.ts, source de /blog/articles.json),
   en bas E-commerce, Agents IA et Toutes les actus (l'ancienne bascule reste
   accessible). « N » = slides + articles listés, calculé, jamais écrit en dur.

   Ce fichier vit dans src/ : le dossier lystes/ est écrasé à chaque
   resynchronisation, seul le branchement dans lystes/.../Header.tsx est à
   réappliquer (AGENTS.md). Styles préfixés « fd- », sans dépendre du thème. */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link as LienSite } from "react-router-dom";
import { Link } from "@lystes/lib/lien-lystes";
import { articles, dateLisible, typo, type Article, type Bloc } from "@/actus/articles";
import imgGoodies from "@/assets/fresh-drops-goodies.webp";
import imgMeetup from "@/assets/fresh-drops-meetup.webp";
/* Vidéo de la carte « Backstage » de /meetup et /goodies (CarteBackstage.tsx) : la première de sa liste (salle, deux femmes assises, narcisses). */
import videoBackstage from "@/assets/backstage/backstage_4.mp4.asset.json";
import afficheEvents from "@/assets/fresh-drops-events-poster.webp";
import afficheIa from "@/assets/fresh-drops-ia-poster.webp";

/* Photo de la carte « Nouveau magazine édité par Biolystes » de /rp (MagazinesPage.tsx), sans le texte posé dessus. */
import photoPresse from "@/assets/magazines/couverture-brume-2.jpeg.asset.json";

/* Vidéo du hero de lystes.ai, la même source (HomeHeroVideo.tsx, `A.video`) : pas de copie. */
const VIDEO_HERO_LYSTES = "https://lystes.ai/__l5e/assets-v1/48dd4735-eb4b-4d9e-afc3-542a3717c7c8/avis-prompt-video.mp4";

/* Même prise de rendez-vous que le bouton « Prendre rendez-vous » de l'en-tête (lystes/.../Header.tsx). */
const LIEN_RDV = "https://biolystes.pro/rdv";

const lien = (a: Article) => a.url ?? `/blog/${a.slug}`;

/** Durées (ms) de la boucle : yeux visibles, puis « N New » visible. */
const DUREE_YEUX = 3600;
const DUREE_TAG = 4800;

/** Temps de lecture : le même calcul que /blog/articles.json (scripts/articles-json.ts), la source du panneau « L'actualité ». */
function texteDuBloc(b: Bloc): string {
  switch (b.t) {
    case "p": case "h2": case "note": return b.texte;
    case "liste": return b.items.join(" ");
    case "cartes": return b.items.map((c) => `${c.titre} ${c.texte}`).join(" ");
    case "chiffre": return `${b.valeur} ${b.texte} ${b.note || ""}`;
    case "comparaison": return [...b.gauche.items, ...b.droite.items].join(" ");
  }
}
const minutes = (a: Article) =>
  Math.max(1, Math.round([a.chapo, ...a.corps.map(texteDuBloc)].join(" ").split(/\s+/).filter(Boolean).length / 200));

const SLUG_HR = "partenariat-hr-associes";
type Slide = { cle: string; titre: string; bouton: string; to: string; image: string; alt: string; video?: string; affiche?: string; externe?: boolean; mention?: string };

/** Les 5 nouveautés du slider. Pages réelles du site : /goodies et /meetup (menu). */
function lesSlides(): Slide[] {
  const hr = articles.find((a) => a.slug === SLUG_HR);
  const liste: Slide[] = [];
  if (hr) liste.push({ cle: "hr", titre: "Biolystes s’associe à HR & Associés", bouton: "Lire l’article", to: lien(hr), image: hr.image, alt: hr.alt });
  liste.push({ cle: "goodies", titre: "Désormais, créez vos goodies avec Biolystes", bouton: "Découvrir les goodies", to: "/goodies", image: imgGoodies, alt: "Goodies personnalisés pour vos événements" });
  liste.push({ cle: "meetup", titre: "Louez des espaces à l’heure pour vos meet-up parties", bouton: "Voir les lieux", to: "/meetup", image: imgMeetup, alt: "Un appartement parisien à louer à l’heure pour un meet-up" });
  liste.push({ cle: "events", titre: "Organisez vos events de lancement", bouton: "Prendre rendez-vous", to: LIEN_RDV, externe: true, image: "", alt: "Un event de lancement de marque en coulisses", video: videoBackstage.url, affiche: afficheEvents });
  liste.push({ cle: "presse", titre: "Marie Claire devient partenaire de Biolystes.", bouton: "Découvrez nos partenaires", to: "/rp", image: photoPresse.url, alt: "Une femme appliquant un soin sur son visage" });
  liste.push({ cle: "ia", mention: "LYSTES × BIOLYSTES", titre: "Biolystes lance une IA pour atteindre le plein potentiel de vente.", bouton: "Découvrir notre IA", to: "https://lystes.ai/", externe: true, image: "", alt: "Une femme regarde son téléphone", video: VIDEO_HERO_LYSTES, affiche: afficheIa });
  return liste;
}

const CSS = `
.fd-root{position:relative;display:inline-flex;font-family:inherit}
.fd-btn{display:inline-flex;align-items:center;gap:4px;border:0;border-radius:9999px;padding:5px 6px;margin:0;cursor:pointer;font:inherit;outline:none;box-shadow:none;text-shadow:none;background:rgba(0,0,0,.06);color:rgba(0,0,0,.55)}
.fd-btn.fd-clair{background:rgba(255,255,255,.12);color:rgba(255,255,255,.7)}
.fd-btn:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.fd-act{display:inline-flex;align-items:center;height:23px;padding:0 9px;border-radius:9999px;background:#fff;color:#000;font-size:11px;font-weight:600;line-height:1;white-space:nowrap}
.fd-slot{position:relative;display:grid;align-items:center;overflow:hidden;height:23px;transition:width .35s ease;margin-right:3px}
.fd-cell{grid-column:1;grid-row:1;display:flex;width:max-content;justify-self:start}
.fd-tag{display:inline-flex;align-items:center;gap:1px;height:17px;padding:0 6px;border-radius:9999px;background:#000;color:#fff;font-size:10px;font-weight:600;line-height:1;white-space:nowrap;transform-origin:left;transition:opacity .3s,scale .3s}
.fd-clair .fd-tag{background:#fff;color:#000}
.fd-tag svg{width:11px;height:11px;flex-shrink:0}
.fd-eyes{grid-column:1;grid-row:1;display:flex;align-items:center;gap:2px;margin-left:3px;justify-self:start;pointer-events:none;transition:opacity .3s,scale .3s}
.fd-slot[data-eyes=on] .fd-tag{opacity:0;scale:.75}
.fd-slot[data-eyes=off] .fd-eyes{opacity:0;scale:.5}
.fd-eye{position:relative;width:9px;height:12px;border-radius:50%;background:#fff;border:1px solid rgba(0,0,0,.35);box-sizing:border-box;overflow:hidden;animation:fd-blink 2.5s ease-in-out 2}
.fd-clair .fd-eye{border-color:transparent}
.fd-pupil{position:absolute;top:3px;left:1.5px;width:4px;height:5px;border-radius:50%;background:#000;translate:-1.5px 1px;animation:fd-look 2.5s ease-in-out 2}
.fd-slot[data-eyes=off] .fd-eye,.fd-slot[data-eyes=off] .fd-pupil{animation:none}
@keyframes fd-look{0%,52%{translate:-1.5px 1px}62%,74%{translate:1px -.5px}86%,100%{translate:-1.5px 1px}}
@keyframes fd-blink{0%,38%,46%,100%{scale:1}42%{scale:1 .1}}
@media (prefers-reduced-motion:reduce){.fd-eye,.fd-pupil{animation:none}}
.fd-short{display:none}
@media (max-width:640px){.fd-btn{padding:3px 4px;gap:2px}.fd-act{height:19px;padding:0 7px;font-size:10px}.fd-slot{height:19px;margin-right:1px}.fd-tag{height:15px;padding:0 5px;font-size:9.5px}.fd-tag svg{display:none}}
@media (max-width:359px){.fd-long{display:none}.fd-short{display:inline}}

.fd-panel{font-family:inherit;position:fixed;z-index:2147483000;width:760px;max-width:calc(100vw - 24px);box-sizing:border-box;border-radius:24px;background:#fff;border:1px solid rgba(0,0,0,.1);padding:12px;color:#1d1d1f;animation:fd-pop .18s ease-out;transform-origin:top left}
@keyframes fd-pop{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.fd-panel{animation:none}}
.fd-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}
.fd-slider{position:relative;contain:paint;min-width:0;min-height:380px;border-radius:18px;background:#e8e9ea;overflow:hidden}
.fd-piste{position:absolute;inset:0;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.fd-piste::-webkit-scrollbar{display:none}
.fd-slide{position:relative;flex:0 0 100%;min-width:0;scroll-snap-align:start;color:#fff}
.fd-slide>img,.fd-slide>video{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover}
.fd-slide:after{content:"";position:absolute;left:0;right:0;bottom:0;height:90%;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.66));pointer-events:none}
.fd-slide-txt{position:absolute;z-index:1;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:flex-start;gap:14px;padding:0 20px 46px}
.fd-slide h3{margin:0;max-width:92%;font-family:inherit;font-size:18px;line-height:24px;font-weight:600;color:#fff;text-wrap:balance}
.fd-mention{margin:0 0 -8px;font-size:11px;line-height:14px;font-weight:700;letter-spacing:1px;color:#fff}
.fd-bouton{display:inline-flex;align-items:center;height:36px;padding:0 16px;border-radius:9999px;background:#fff;color:#000;font-size:13px;font-weight:500;text-decoration:none;white-space:nowrap}
.fd-bouton:hover,.fd-bouton:focus-visible{background:#f3f4f5;outline:none}
.fd-pied-slider{position:absolute;z-index:2;left:20px;right:16px;bottom:16px;display:flex;align-items:center;justify-content:space-between;pointer-events:none}
.fd-pied-slider button{pointer-events:auto}
.fd-points{display:flex;gap:6px}
.fd-point{width:6px;height:6px;padding:0;border:0;border-radius:50%;background:rgba(255,255,255,.5);cursor:pointer}
.fd-point[aria-current=true]{background:#fff}
.fd-fleches{display:flex;gap:6px}
.fd-fleche{display:flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:50%;background:#fff;color:#000;cursor:pointer}
.fd-fleche:hover,.fd-fleche:focus-visible{background:#f3f4f5;outline:none}
.fd-fleche svg{width:14px;height:14px}
.fd-side{display:flex;flex-direction:column;min-width:0;padding:4px 0 0}
.fd-title{margin:4px 0 10px;font-size:13px;font-weight:600;color:#6e6e73}
.fd-list{display:flex;flex-direction:column;gap:4px;max-height:392px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.2) transparent}
.fd-item{display:flex;align-items:center;gap:12px;padding:6px;border-radius:14px;text-decoration:none;color:#1d1d1f;transition:background .15s}
.fd-item:hover,.fd-item:focus-visible{background:#f3f4f5;outline:none}
.fd-thumb{flex:0 0 72px;width:72px;height:48px;border-radius:10px;overflow:hidden;background:#f3f4f5}
.fd-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.fd-t{display:-webkit-box;font-size:14px;line-height:18px;font-weight:500;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;text-wrap:pretty}
.fd-item small{display:block;margin-top:2px;font-size:11.5px;line-height:14px;color:#6e6e73}
.fd-foot{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}
.fd-foot a{display:flex;align-items:center;justify-content:center;padding:12px 6px;border-radius:9999px;background:#f3f4f5;font-size:14px;font-weight:500;color:#1d1d1f;text-decoration:none;white-space:nowrap}
.fd-foot a:hover,.fd-foot a:focus-visible{background:#e8e9ea;outline:none}
@media (max-width:640px){
 .fd-panel{padding:8px;border-radius:20px}
 .fd-grid{grid-template-columns:1fr;gap:12px}
 .fd-list{max-height:30vh}
 .fd-slider{min-height:340px}
 .fd-foot{gap:6px}
 .fd-foot a{font-size:13px;padding:11px 4px}
}
`;

type Props = { light?: boolean; dans?: "entete" | "hero" };

export function FreshDrops({ light = false }: Props) {
  const slides = lesSlides();
  const [ouvert, setOuvert] = useState(false);
  const [yeux, setYeux] = useState(true);
  const [actif, setActif] = useState(0);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const bouton = useRef<HTMLButtonElement>(null);
  const panneau = useRef<HTMLDivElement>(null);
  const piste = useRef<HTMLDivElement>(null);
  const fente = useRef<HTMLSpanElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
  const yeuxRef = useRef<HTMLSpanElement>(null);

  /* La liste de droite : les articles de « L'actualité » (articles.ts, du plus récent
     au plus ancien, comme /blog/articles.json), sans l'article déjà en slide. */
  const liste = [...articles].sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0)).filter((a) => a.slug !== SLUG_HR);
  const n = slides.length + liste.length;

  /* Boucle : yeux, puis « N New », en boucle. Sans animation si l'utilisateur
     l'a désactivée : « N New » reste affiché. */
  useEffect(() => {
    if (ouvert) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setYeux(false);
      return;
    }
    const t = window.setTimeout(() => setYeux((v) => !v), yeux ? DUREE_YEUX : DUREE_TAG);
    return () => window.clearTimeout(t);
  }, [yeux, ouvert]);

  /* La capsule prend la largeur de ce qu'elle montre (transition douce). */
  useLayoutEffect(() => {
    const el = fente.current;
    const cible = yeux ? yeuxRef.current : tag.current;
    if (!el || !cible) return;
    el.style.width = `${cible.offsetWidth + (yeux ? 3 : 0)}px`;
  }, [yeux, n]);

  const placer = useCallback(() => {
    const b = bouton.current;
    if (!b) return;
    const r = b.getBoundingClientRect();
    const largeur = Math.min(760, window.innerWidth - 24);
    const gauche = Math.max(12, Math.min(r.left - 4, window.innerWidth - largeur - 12));
    setPos({ top: Math.round(r.bottom + 8), left: Math.round(gauche) });
  }, []);

  const basculer = () => {
    if (!ouvert) {
      placer();
      setActif(0);
    }
    setOuvert((v) => !v);
  };

  /* Fermeture : clic ailleurs, Échap, changement de taille, défilement de la page. */
  useEffect(() => {
    if (!ouvert) return;
    const hors = (e: MouseEvent | TouchEvent) => {
      const c = e.target as Node;
      if (panneau.current?.contains(c) || bouton.current?.contains(c)) return;
      setOuvert(false);
    };
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOuvert(false);
        bouton.current?.focus();
      }
    };
    const ferme = () => setOuvert(false);
    document.addEventListener("mousedown", hors);
    document.addEventListener("touchstart", hors);
    document.addEventListener("keydown", touche);
    window.addEventListener("resize", ferme);
    window.addEventListener("scroll", ferme, { passive: true });
    return () => {
      document.removeEventListener("mousedown", hors);
      document.removeEventListener("touchstart", hors);
      document.removeEventListener("keydown", touche);
      window.removeEventListener("resize", ferme);
      window.removeEventListener("scroll", ferme);
    };
  }, [ouvert]);

  const ferme = () => setOuvert(false);

  const aller = (i: number) => {
    const p = piste.current;
    if (!p) return;
    const k = (i + slides.length) % slides.length;
    p.scrollTo({ left: k * p.clientWidth, behavior: "smooth" });
  };
  /* Seule la vidéo de la slide visible joue (muette, en boucle). */
  useEffect(() => {
    if (!ouvert) return;
    const cases = Array.from(piste.current?.children ?? []);
    panneau.current?.querySelectorAll("video").forEach((v) => {
      if (cases.indexOf(v.parentElement as Element) === actif) v.play().catch(() => undefined);
      else v.pause();
    });
  }, [ouvert, actif]);
  const surDefilement = () => {
    const p = piste.current;
    if (p && p.clientWidth) setActif(Math.round(p.scrollLeft / p.clientWidth));
  };

  return (
    <span className="fd-root" data-fresh-drops>
      <style>{CSS}</style>
      <button
        ref={bouton}
        type="button"
        className={`fd-btn ${light ? "fd-clair" : ""}`}
        aria-expanded={ouvert}
        aria-haspopup="dialog"
        aria-label={`Fresh drops, ${n} nouveautés`}
        onClick={basculer}
      >
        <span className="fd-act"><span className="fd-long">Fresh drops</span><span className="fd-short">Drops</span></span>
        <span ref={fente} className="fd-slot" data-eyes={yeux ? "on" : "off"} style={{ width: 23 }}>
          <span className="fd-cell">
            <span ref={tag} className="fd-tag">
              <span>{n} New</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8 10 3.646 3.646a.5.5 0 0 0 .708 0L16 10" />
              </svg>
            </span>
          </span>
          <span ref={yeuxRef} className="fd-eyes" aria-hidden="true">
            <span className="fd-eye"><span className="fd-pupil" /></span>
            <span className="fd-eye"><span className="fd-pupil" /></span>
          </span>
        </span>
      </button>

      {ouvert && pos && (
        <div ref={panneau} className="fd-panel" role="dialog" aria-label="Fresh drops" style={{ top: pos.top, left: pos.left }}>
          <div className="fd-grid">
            <div className="fd-slider" role="region" aria-roledescription="carrousel" aria-label="Nouveautés">
              <div ref={piste} className="fd-piste" onScroll={surDefilement}>
                {slides.map((s, i) => (
                  <div key={s.cle} className="fd-slide" aria-hidden={i !== actif} aria-label={`${i + 1} sur ${slides.length}`}>
                    {s.video ? (
                      <video src={s.video} poster={s.affiche} autoPlay muted loop playsInline preload="auto" aria-label={s.alt} />
                    ) : (
                      <img src={s.image} alt={s.alt} loading={i === 0 ? "eager" : "lazy"} style={s.cle === "presse" ? { transform: "scale(1.18)" } : undefined} />
                    )}
                    <div className="fd-slide-txt">
                      {s.mention && <p className="fd-mention">{s.mention}</p>}
                      <h3>{s.titre}</h3>
                      {s.externe ? (
                        <a href={s.to} target="_blank" rel="noopener noreferrer" className="fd-bouton" onClick={ferme} tabIndex={i === actif ? 0 : -1}>{s.bouton}</a>
                      ) : (
                        <LienSite to={s.to} className="fd-bouton" onClick={ferme} tabIndex={i === actif ? 0 : -1}>{s.bouton}</LienSite>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="fd-pied-slider">
                <div className="fd-points">
                  {slides.map((s, i) => (
                    <button key={s.cle} type="button" className="fd-point" aria-label={`Nouveauté ${i + 1}`} aria-current={i === actif} onClick={() => aller(i)} />
                  ))}
                </div>
                <div className="fd-fleches">
                  <button type="button" className="fd-fleche" aria-label="Précédent" onClick={() => aller(actif - 1)}>
                    <svg viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="m15 6-6 6 6 6" /></svg>
                  </button>
                  <button type="button" className="fd-fleche" aria-label="Suivant" onClick={() => aller(actif + 1)}>
                    <svg viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" /></svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="fd-side">
              <p className="fd-title">Les dernières actus</p>
              <div className="fd-list">
                {liste.map((a) => (
                  <LienSite key={a.slug} to={lien(a)} className="fd-item" onClick={ferme}>
                    <span className="fd-thumb"><img src={a.image} alt="" loading="lazy" /></span>
                    <span>
                      <span className="fd-t">{typo(a.titre)}</span>
                      <small>{dateLisible(a.date)} · {minutes(a)} min de lecture</small>
                    </span>
                  </LienSite>
                ))}
              </div>
            </div>
          </div>
          <div className="fd-foot">
            <Link to="/" replace={false} onClick={ferme}>E-commerce</Link>
            <Link to="/agents-ia" replace={false} onClick={ferme}>Agents IA</Link>
            <LienSite to="/blog" onClick={ferme}>Toutes les actus</LienSite>
          </div>
        </div>
      )}
    </span>
  );
}
