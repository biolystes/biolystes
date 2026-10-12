/* La barre flottante « Voir nos dernières actus » et l’orbital de
   biolystes.com, sur toutes les pages publiques (JP, 12/10/2026).

   Reprend le dessin du widget de lystes.ai (pilule blanche, trois avatars,
   badge « AI », rond noir à l’icône Newspaper ; orbital blanc aux orbes
   animées), écrit ici pour s’afficher dès la prochaine publication, sans
   attendre l’agent Biolystes de lystes.ai. Réglages : src/actus/reglages.ts.

   Styles en ligne (<style> posé par le composant) : la page d’accueil vit
   sous `.lystes-racine`, où les feuilles de src/ ne s’appliquent pas
   (postcss.config.js). Ce bloc doit être le même partout.

   Sur /blog et ses articles, la barre disparaît (on y est déjà) : l’orbital
   reste seul, en bas à droite.

   Ni la barre ni l’orbital ne cachent un bouton « Prendre rendez-vous » ou
   le pied de page : dès qu’ils les chevauchent, ils s’effacent. */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BARRE, CONSEILLER, LIEN_RDV, PAGES_SANS_BARRE } from "./reglages";
import { demanderAuConseiller, type Message } from "./conseiller";
import { dessinerOrbes, VITESSE_ORBES } from "./orbes";

const AVATARS = [1, 2, 3].map((n) => `https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/widget-avatars/avatar${n}.jpeg`);

const SUGGESTIONS = [
  "Comment lancer ma marque sans acheter de stock ?",
  "Quels soins pour une gamme visage peaux sensibles ?",
  "En combien de temps ma marque peut-elle être en ligne ?",
];

const CSS = `
.bl-barre, .bl-barre *, .bl-orbital, .bl-orbital *, .bl-panneau, .bl-panneau * { box-sizing: border-box; }
.bl-barre {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  z-index: 9999990; display: flex; align-items: center; gap: 12px;
  background: #fff; border: none; margin: 0; padding: 8px 16px 8px 8px; border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0,0,0,.15); cursor: pointer; width: max-content; max-width: calc(100vw - 32px);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: transform .2s, box-shadow .2s, opacity .25s;
}
.bl-barre:hover { transform: translateX(-50%) translateY(-2px); box-shadow: 0 6px 25px rgba(0,0,0,.2); }
.bl-avatars { display: flex; align-items: center; position: relative; padding-top: 4px; flex: none; }
.bl-avatar { width: 36px; height: 36px; border-radius: 8px; border: 2px solid #fff; object-fit: cover; margin-left: -10px; box-shadow: 0 2px 8px rgba(0,0,0,.1); display: block; }
.bl-avatar:first-child { margin-left: 0; }
.bl-avatar-1 { transform: rotate(-8deg); z-index: 3; }
.bl-avatar-2 { z-index: 2; }
.bl-avatar-3 { transform: rotate(8deg); z-index: 1; }
.bl-ai { position: absolute; top: 2px; right: -6px; color: #111; font-size: 6px; font-weight: 600; padding: 0 4px; border-radius: 4px; z-index: 10; height: 16px; line-height: 17px; isolation: isolate; overflow: hidden; }
.bl-ai-lueur { --c: oklch(0.88 0.06 278.51); position: absolute; left: 50%; top: 50%; translate: -50% -50%; width: 300%; aspect-ratio: 1; z-index: -1; background: conic-gradient(in oklch longer hue, var(--c), var(--c)); animation: bl-lueur 3s linear infinite; }
@keyframes bl-lueur { to { rotate: 1turn; } }
.bl-texte { font-size: 14px; font-weight: 500; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bl-texte-court { display: none; }
.bl-fleche { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; flex: none; background: #000; color: #fff; border-radius: 50%; }
.bl-orbital {
  position: fixed; z-index: 9999990; width: 52px; height: 52px; padding: 0; margin: 0;
  background: #fff; border: none; border-radius: 50%; cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,.15); display: flex; align-items: center; justify-content: center;
  transition: transform .2s ease, opacity .25s;
}
.bl-orbital:hover { transform: scale(1.06); }
.bl-orbital canvas { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 50%; display: block; }
.bl-orbital-ai { position: absolute; right: -3px; bottom: -3px; min-width: 18px; height: 18px; border-radius: 9px; padding: 0 3px; background: #111; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font: 700 8px -apple-system, BlinkMacSystemFont, sans-serif; color: #fff; line-height: 1; z-index: 3; }
.bl-efface { opacity: 0 !important; pointer-events: none !important; }
@media (max-width: 480px) {
  .bl-barre { bottom: 15px; padding: 6px 12px 6px 6px; gap: 10px; }
  .bl-avatar { width: 32px; height: 32px; border-radius: 6px; }
  .bl-texte { font-size: 13px; }
  .bl-fleche { width: 24px; height: 24px; }
  .bl-fleche svg { width: 13px; height: 13px; }
}
@media (max-width: 340px) {
  .bl-texte-long { display: none; }
  .bl-texte-court { display: inline; }
}

.bl-panneau {
  position: fixed; z-index: 9999995; right: 24px; bottom: 24px; width: 400px; height: min(640px, calc(100vh - 48px));
  background: #fff; border-radius: 20px; box-shadow: 0 12px 48px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.06);
  display: flex; flex-direction: column; overflow: hidden; color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: bl-entree .22s ease-out;
}
@keyframes bl-entree { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.bl-tete { display: flex; align-items: center; gap: 12px; padding: 16px 16px 14px 18px; border-bottom: 1px solid #eef0f1; }
.bl-tete-orbe { position: relative; width: 38px; height: 38px; border-radius: 50%; flex: none; box-shadow: 0 2px 10px rgba(0,0,0,.1); }
.bl-tete-orbe canvas { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 50%; }
.bl-tete-titre { margin: 0; font-size: 15px; font-weight: 600; line-height: 1.25; letter-spacing: -0.01em; }
.bl-tete-sous { margin: 2px 0 0; font-size: 12px; color: #6e6e73; line-height: 1.3; }
.bl-fermer { margin-left: auto; width: 32px; height: 32px; border-radius: 50%; border: none; background: #f3f4f5; color: #1d1d1f; display: flex; align-items: center; justify-content: center; cursor: pointer; flex: none; }
.bl-fil { flex: 1; overflow-y: auto; padding: 18px 18px 8px; display: flex; flex-direction: column; gap: 14px; overscroll-behavior: contain; }
.bl-accueil { margin: 0; font-size: 14px; line-height: 1.55; color: #1d1d1f; background: #f3f4f5; border-radius: 4px 16px 16px 16px; padding: 12px 14px; }
.bl-sugs { display: flex; flex-direction: column; gap: 8px; }
.bl-sug { text-align: left; font: inherit; font-size: 13px; line-height: 1.4; color: #1d1d1f; background: #fff; border: 1px solid #e3e5e8; border-radius: 12px; padding: 10px 12px; cursor: pointer; }
.bl-sug:hover { background: #f3f4f5; }
.bl-moi { align-self: flex-end; max-width: 85%; background: #1d1d1f; color: #fff; border-radius: 16px 16px 4px 16px; padding: 10px 14px; font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
.bl-lui { align-self: flex-start; max-width: 92%; background: #f3f4f5; border-radius: 4px 16px 16px 16px; padding: 12px 14px; font-size: 14px; line-height: 1.55; }
.bl-lui p { margin: 0 0 8px; }
.bl-lui p:last-child { margin-bottom: 0; }
.bl-lui ul { margin: 0 0 8px; padding-left: 18px; }
.bl-lui li { margin: 2px 0; }
.bl-lui h4 { margin: 10px 0 4px; font-size: 14px; font-weight: 600; }
.bl-produit { display: flex; gap: 10px; margin: 8px 0; padding: 10px; background: #fff; border-radius: 12px; }
.bl-produit .bl-produit-num { width: 22px; height: 22px; border-radius: 50%; background: #1d1d1f; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex: none; }
.bl-produit strong { display: block; font-size: 13px; line-height: 1.35; }
.bl-lui a { color: #1d1d1f; text-decoration: underline; text-underline-offset: 2px; }
.bl-produit .bl-produit-desc { display: block; font-size: 12.5px; color: #555a60; line-height: 1.45; margin-top: 2px; }
.bl-rdv { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; background: #1d1d1f; color: #fff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 10px 16px; border-radius: 999px; }
.bl-rdv:hover { background: #000; color: #fff; }
.bl-points { display: inline-flex; gap: 4px; padding: 14px 16px; background: #f3f4f5; border-radius: 4px 16px 16px 16px; align-self: flex-start; }
.bl-points i { width: 6px; height: 6px; border-radius: 50%; background: #1d1d1f; opacity: .3; animation: bl-point 1.2s infinite ease-in-out; }
.bl-points i:nth-child(2) { animation-delay: .15s; }
.bl-points i:nth-child(3) { animation-delay: .3s; }
@keyframes bl-point { 0%, 80%, 100% { opacity: .3; transform: none; } 40% { opacity: 1; transform: translateY(-3px); } }
.bl-saisie { display: flex; align-items: flex-end; gap: 8px; margin: 8px 14px 6px; padding: 8px 8px 8px 14px; border: 1px solid #e3e5e8; border-radius: 22px; background: #fff; }
.bl-saisie textarea { flex: 1; border: none; outline: none; resize: none; font: inherit; font-size: 16px; line-height: 1.4; max-height: 120px; padding: 6px 0; background: transparent; color: #1d1d1f; }
.bl-envoyer { width: 34px; height: 34px; border-radius: 50%; border: none; background: #1d1d1f; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; flex: none; }
.bl-envoyer:disabled { background: #d1d1d6; cursor: default; }
.bl-mention { margin: 0 0 10px; text-align: center; font-size: 11px; color: #8e8e93; }
@media (max-width: 640px) {
  .bl-panneau { left: 0; right: 0; bottom: 0; width: auto; height: 88vh; height: 88dvh; border-radius: 20px 20px 0 0; }
}
`;

/* Icône Newspaper (Lucide), au trait. */
function IconeActus() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18h-5" /><path d="M18 14h-8" /><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" /><rect width="8" height="4" x="10" y="6" rx="1" />
    </svg>
  );
}

/* Les orbes, peintes en continu tant que la page est visible. */
function Orbes({ taille }: { taille: number }) {
  const toile = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = toile.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(64 * dpr);
    c.height = Math.round(64 * dpr);
    let image = 0;
    const peindre = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, 64, 64);
      dessinerOrbes(ctx, 64, (t / 1000) * VITESSE_ORBES);
      image = requestAnimationFrame(peindre);
    };
    const reprendre = () => {
      cancelAnimationFrame(image);
      if (document.visibilityState !== "hidden") image = requestAnimationFrame(peindre);
    };
    reprendre();
    document.addEventListener("visibilitychange", reprendre);
    return () => { cancelAnimationFrame(image); document.removeEventListener("visibilitychange", reprendre); };
  }, []);
  return <canvas ref={toile} width={taille * 2} height={taille * 2} role="img" aria-hidden="true" />;
}

/* Gras, italique, liens, listes, titres et blocs produit du chat : rien d'autre. */
function enLigne(texte: string, cle: string): ReactNode[] {
  /* Liens [texte](https://…) et adresses nues : cliquables. */
  const morceaux = texte.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s)]+)/g);
  return morceaux.map((m, i) => {
    const k = `${cle}-${i}`;
    if (m.startsWith("**") && m.endsWith("**")) return <strong key={k}>{m.slice(2, -2)}</strong>;
    const lien = m.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (lien) return <a key={k} href={lien[2]} target="_blank" rel="noopener noreferrer">{lien[1]}</a>;
    if (/^https?:\/\//.test(m)) return <a key={k} href={m} target="_blank" rel="noopener noreferrer">{m.replace(/^https?:\/\//, "")}</a>;
    return <span key={k}>{m.replace(/\*([^*]+)\*/g, "$1")}</span>;
  });
}

/* Aucun prix en ligne (JP, 12/10/2026). Garde-fou côté site, en plus du
   prompt du chat : toute ligne qui porte un montant est retirée, et la
   réponse renvoie au rendez-vous. Pendant l’écriture, la ligne en cours
   n’est montrée qu’une fois finie si elle contient un chiffre. */
const MONTANT = /\d[\d\s.,]*\s?(€|euros?\b|\$|EUR\b)|€\s?\d|\$\s?\d|\b\d+\s?k€/i;
function sansMontant(texte: string, enCours: boolean) {
  let lignes = texte.split("\n");
  if (enCours && /\d/.test(lignes[lignes.length - 1])) lignes = lignes.slice(0, -1);
  const gardees = lignes.filter((l) => !MONTANT.test(l));
  if (gardees.length < lignes.length && !enCours) gardees.push("", "Les tarifs vous sont présentés en rendez-vous avec un expert.");
  return gardees.join("\n");
}

function Reponse({ texte: brut, enCours = false }: { texte: string; enCours?: boolean }) {
  const texte = sansMontant(brut, enCours);
  const blocs: ReactNode[] = [];
  const parties = texte.split(/(:::(?:product|market)\n[\s\S]*?:::)/g);
  parties.forEach((partie, pi) => {
    const bloc = partie.match(/^:::(product|market)\n([\s\S]*?):::$/);
    if (bloc) {
      const champs: Record<string, string> = {};
      bloc[2].split("\n").forEach((l) => {
        const k = l.indexOf(":");
        if (k > 0) champs[l.slice(0, k).trim()] = l.slice(k + 1).trim();
      });
      if (bloc[1] === "product") {
        blocs.push(
          <div className="bl-produit" key={`b${pi}`}>
            <span className="bl-produit-num">{champs.numero || "•"}</span>
            <div><strong>{champs.titre}</strong>{champs.description && <span className="bl-produit-desc">{champs.description}</span>}</div>
          </div>,
        );
      } else if (champs.analyse) {
        blocs.push(<p key={`b${pi}`}><strong>{champs.titre || "Le marché"}</strong> : {champs.analyse}</p>);
      }
      return;
    }
    let liste: ReactNode[] = [];
    const fermerListe = (cle: string) => {
      if (liste.length) blocs.push(<ul key={cle}>{liste}</ul>);
      liste = [];
    };
    partie.split("\n").forEach((ligne, li) => {
      const l = ligne.trim();
      const cle = `${pi}-${li}`;
      if (!l) { fermerListe(`u${cle}`); return; }
      if (/^[-•*]\s+/.test(l)) { liste.push(<li key={cle}>{enLigne(l.replace(/^[-•*]\s+/, ""), cle)}</li>); return; }
      fermerListe(`u${cle}`);
      if (/^#{1,4}\s+/.test(l)) { blocs.push(<h4 key={cle}>{enLigne(l.replace(/^#{1,4}\s+/, ""), cle)}</h4>); return; }
      blocs.push(<p key={cle}>{enLigne(l, cle)}</p>);
    });
    fermerListe(`u${pi}-fin`);
  });
  return <div className="bl-lui">{blocs}</div>;
}

function Panneau({ fermer }: { fermer: () => void }) {
  const [fil, setFil] = useState<Message[]>([]);
  const [saisie, setSaisie] = useState("");
  const [attente, setAttente] = useState(false); // avant le premier mot
  const [enCours, setEnCours] = useState(false); // tant que la réponse s’écrit
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const bas = useRef<HTMLDivElement>(null);
  const champ = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bas.current?.scrollIntoView({ block: "end" }); }, [fil, attente, enCours]);
  useEffect(() => {
    const echap = (e: KeyboardEvent) => { if (e.key === "Escape") fermer(); };
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, [fermer]);

  const envoyer = async (texte: string) => {
    const question = texte.trim();
    if (!question || enCours) return;
    const historique: Message[] = [...fil, { role: "user", content: question }];
    setFil(historique);
    setSaisie("");
    setSuggestions([]);
    setAttente(true);
    setEnCours(true);
    let debut = true;
    try {
      const r = await demanderAuConseiller(historique, (morceau) => {
        if (debut) {
          debut = false;
          setAttente(false);
          setFil((f) => [...f, { role: "assistant", content: morceau }]);
        } else {
          setFil((f) => f.map((m, i) => (i === f.length - 1 ? { ...m, content: m.content + morceau } : m)));
        }
      });
      if (r.suggestions?.length) setSuggestions(r.suggestions);
    } catch {
      setFil((f) => [...f, { role: "assistant", content: "Je n’arrive pas à vous répondre pour l’instant. Prenez rendez-vous, on étudie votre projet ensemble." }]);
    } finally {
      setAttente(false);
      setEnCours(false);
    }
  };

  const dernierRepond = fil.length > 0 && fil[fil.length - 1].role === "assistant" && !enCours;

  return (
    <div className="bl-panneau" role="dialog" aria-label="Conseiller Biolystes">
      <div className="bl-tete">
        <div className="bl-tete-orbe"><Orbes taille={38} /></div>
        <div>
          <p className="bl-tete-titre">Conseiller Biolystes</p>
          <p className="bl-tete-sous">Vos produits et votre lancement</p>
        </div>
        <button type="button" className="bl-fermer" onClick={fermer} aria-label="Fermer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="bl-fil">
        <p className="bl-accueil">Bonjour, je vous aide à choisir les produits de votre future marque et à comprendre comment se passe le lancement. Que voulez-vous savoir ?</p>
        {fil.length === 0 && (
          <div className="bl-sugs">
            {SUGGESTIONS.map((s) => <button type="button" key={s} className="bl-sug" onClick={() => envoyer(s)}>{s}</button>)}
          </div>
        )}
        {fil.map((m, i) => (m.role === "user" ? <div key={i} className="bl-moi">{m.content}</div> : <Reponse key={i} texte={m.content} enCours={enCours && i === fil.length - 1} />))}
        {attente && <div className="bl-points" aria-label="Le conseiller écrit"><i /><i /><i /></div>}
        {dernierRepond && (
          <a className="bl-rdv" href={LIEN_RDV} target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            Prendre rendez-vous
          </a>
        )}
        {dernierRepond && suggestions.length > 0 && (
          <div className="bl-sugs">
            {suggestions.map((s) => <button type="button" key={s} className="bl-sug" onClick={() => envoyer(s)}>{s}</button>)}
          </div>
        )}
        <div ref={bas} />
      </div>
      <form className="bl-saisie" onSubmit={(e) => { e.preventDefault(); envoyer(saisie); }}>
        <textarea
          ref={champ}
          rows={1}
          value={saisie}
          maxLength={1000}
          placeholder="Votre question"
          onChange={(e) => setSaisie(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); envoyer(saisie); } }}
        />
        <button type="submit" className="bl-envoyer" disabled={!saisie.trim() || enCours} aria-label="Envoyer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </button>
      </form>
      <p className="bl-mention">Réponses rédigées par une IA, à confirmer en rendez-vous.</p>
    </div>
  );
}

/* Un rectangle en chevauche un autre ? (marge de 8 px) */
function chevauche(a: DOMRect, b: DOMRect) {
  return a.left < b.right + 8 && a.right > b.left - 8 && a.top < b.bottom + 8 && a.bottom > b.top - 8;
}

export default function BarreActus() {
  const { pathname } = useLocation();
  const naviguer = useNavigate();
  const [ouvert, setOuvert] = useState(false);
  const [effacer, setEffacer] = useState({ barre: false, orbital: false });
  const barre = useRef<HTMLButtonElement>(null);
  const orbital = useRef<HTMLButtonElement>(null);
  const [placeOrbital, setPlaceOrbital] = useState<{ left: number; top: number } | null>(null);

  const widgetLystes = typeof document !== "undefined" && !!document.documentElement.dataset.lystesWidget;
  const masquee = widgetLystes || PAGES_SANS_BARRE.some((p) => pathname === p || pathname.startsWith(p.endsWith("/") ? p : `${p}/`));
  /* Sur /blog et ses articles, on est déjà dans les actus : pas de barre,
     l'orbital reste seul (12/10/2026). */
  const surActus = pathname === BARRE.lien || pathname.startsWith(`${BARRE.lien}/`);

  /* L'orbital se pose à droite de la barre (centres alignés), ou au-dessus
     d'elle, à droite de l'écran, quand la place manque (téléphone). Puis
     chacun s'efface s'il chevauche un pied de page ou un bouton de rendez-vous. */
  const recalculer = useCallback(() => {
    const b = barre.current, o = orbital.current;
    if (!o) return;
    const taille = o.offsetWidth;
    const ecart = 10;
    let place: { left: number; top: number };
    /* Sans barre (pages Actus) : l'orbital seul, en bas à droite. */
    const rb = b ? b.getBoundingClientRect() : new DOMRect(0, 0, 0, 0);
    if (!b) {
      place = { left: window.innerWidth - taille - 20, top: window.innerHeight - taille - 20 };
    } else if (rb.right + ecart + taille + 12 <= window.innerWidth) {
      place = { left: rb.right + ecart, top: rb.top + rb.height / 2 - taille / 2 };
    } else {
      place = { left: window.innerWidth - taille - 16, top: rb.top - taille - 12 };
    }
    setPlaceOrbital((p) => (p && Math.abs(p.left - place.left) < 0.5 && Math.abs(p.top - place.top) < 0.5 ? p : place));
    const ro = new DOMRect(place.left, place.top, taille, taille);
    const obstacles = Array.from(document.querySelectorAll<HTMLElement>(`footer, [role="contentinfo"], a[href*="biolystes.pro/rdv"], a[href="/rdv"]`))
      .filter((el) => !el.closest(".bl-panneau, .bl-barre"))
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0);
    const suivant = {
      barre: !!b && obstacles.some((r) => chevauche(rb, r)),
      orbital: obstacles.some((r) => chevauche(ro, r)),
    };
    setEffacer((e) => (e.barre === suivant.barre && e.orbital === suivant.orbital ? e : suivant));
  }, []);

  useEffect(() => {
    if (masquee) return;
    let image = 0;
    const planifier = () => { cancelAnimationFrame(image); image = requestAnimationFrame(recalculer); };
    planifier();
    window.addEventListener("scroll", planifier, { passive: true });
    window.addEventListener("resize", planifier);
    /* Les pages React posent leurs blocs après coup (images, animations). */
    const minuteur = window.setInterval(planifier, 700);
    return () => {
      cancelAnimationFrame(image);
      window.removeEventListener("scroll", planifier);
      window.removeEventListener("resize", planifier);
      window.clearInterval(minuteur);
    };
  }, [masquee, pathname, ouvert, recalculer]);

  useEffect(() => { setOuvert(false); }, [pathname]);

  if (masquee) return null;

  return (
    <>
      <style>{CSS}</style>
      {!ouvert && (
        <>
          {!surActus && <button
            ref={barre}
            type="button"
            className={`bl-barre${effacer.barre ? " bl-efface" : ""}`}
            aria-label={BARRE.libelle}
            onClick={() => {
              if (BARRE.lien.startsWith("/")) naviguer(BARRE.lien);
              else window.location.href = BARRE.lien;
            }}
          >
            <span className="bl-avatars" aria-hidden="true">
              {AVATARS.map((src, i) => (
                <img key={src} src={src} alt="" className={`bl-avatar bl-avatar-${i + 1}`} onError={(e) => { e.currentTarget.style.display = "none"; }} />
              ))}
              <span className="bl-ai">AI<span className="bl-ai-lueur" /></span>
            </span>
            <span className="bl-texte">
              <span className="bl-texte-long">{BARRE.libelle}</span>
              <span className="bl-texte-court">{BARRE.libelleCourt}</span>
            </span>
            <span className="bl-fleche" aria-hidden="true"><IconeActus /></span>
          </button>}
          <button
            ref={orbital}
            type="button"
            className={`bl-orbital${effacer.orbital ? " bl-efface" : ""}`}
            style={placeOrbital ? { left: placeOrbital.left, top: placeOrbital.top } : { right: 16, bottom: 20 }}
            aria-label="Ouvrir le conseiller Biolystes"
            data-conseiller={CONSEILLER}
            onClick={() => setOuvert(true)}
          >
            <Orbes taille={52} />
            <span className="bl-orbital-ai">AI</span>
          </button>
        </>
      )}
      {ouvert && <Panneau fermer={() => setOuvert(false)} />}
    </>
  );
}
