import { LYSTES_ENV } from "@lystes/integrations/supabase/env";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Le bouton « Faire un diagnostic AI · <petite phrase> », posé SOUS le chat,
 * hors de lui, et la fenêtre qu'il ouvre : à gauche le parcours de
 * diagnostic, à droite les questions de la marque et ses avis.
 *
 * JP, 11/10/2026, sur le multi-lien : « il faut enlever le bouton diagnostic
 * à l'ancienne : on a changé son design, on met le même design que celui qui
 * est hors du chat, en dessous, en deux étapes, avec le bouton noir et la
 * petite phrase, puis le pop-up avec les questions ».
 *
 * Ce n'est pas un dessin neuf : c'est le bloc <lystes-bouton-diag-faq> du
 * widget des boutiques (public/woo-product-chat.js, lystesBoutonDiagFaq et
 * LYSTES_BDF_STYLE), recopié en React avec ses classes et ses règles telles
 * quelles. Seules les règles de défense contre les thèmes tiers (les
 * `html body:not(#lystes-a)…`) ne sont pas reprises : lystes.ai n'a pas de
 * thème tiers. Toute retouche du dessin se fait d'abord dans le widget,
 * puis ici.
 *
 * Différence avec la fiche produit : les questions sont celles de la MARQUE
 * (la même FAQ que lystes.ai/<marque>/faq, servie par faq-marque-publique),
 * pas celles d'un produit.
 */

/* LYSTES_BDF_STYLE (woo-product-chat.js), sans les règles anti-thème. */
const STYLE = `
.lystes-bdf{container-type:inline-size;width:100%;margin:12px 0 6px;font-family:inherit}
.lystes-bdf .lystes-bdf-bouton{all:unset;box-sizing:border-box!important;display:flex!important;align-items:center!important;gap:12px!important;width:100%!important;height:44px!important;min-height:0!important;margin:0!important;padding:5px 8px 5px 5px!important;border:1px solid #111111!important;border-radius:6px!important;background:#ffffff!important;color:#111111!important;cursor:pointer!important;font-family:inherit!important;text-transform:none!important;letter-spacing:normal!important;box-shadow:none!important;text-align:left!important;line-height:1.2!important}
.lystes-bdf .lystes-bdf-bouton:focus-visible{outline:2px solid #111111!important;outline-offset:2px!important}
.lystes-bdf .lystes-bdf-pastille{display:flex;align-items:center;gap:6px;flex:none;background:#111111;color:#ffffff;border-radius:3px;padding:9px 14px;font-size:13px;font-weight:800;line-height:1.2;white-space:nowrap}
.lystes-bdf .lystes-bdf-ai{background:#ffffff;color:#111111;border-radius:3px;font-size:7px;padding:3px 5px;font-weight:800;line-height:1}
.lystes-bdf .lystes-bdf-libelle{flex-grow:1;min-width:0;text-align:left;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:6px}
.lystes-bdf .lystes-bdf-fleche{width:28px;height:28px;flex:none;display:flex;align-items:center;justify-content:center}
.lystes-bdf .lystes-bdf-fleche svg{display:block}
@container (max-width: 399px){
.lystes-bdf .lystes-bdf-bouton{gap:6px!important;height:48px!important;padding:5px 6px 5px 5px!important}
.lystes-bdf .lystes-bdf-pastille{gap:5px;padding:9px 8px;font-size:11px}
.lystes-bdf .lystes-bdf-ai{padding:2px 4px}
.lystes-bdf .lystes-bdf-libelle{font-size:10px;line-height:1;padding-left:0}
.lystes-bdf .lystes-bdf-fleche{width:24px;height:24px}
}
/* Sur la carte du multi-lien (243 px utiles), la phrase se coupait en
   « Pourquoi n… » : elle passe sur deux lignes équilibrées, mêmes police et
   taille. Seul écart au dessin du widget. */
.lystes-bdf.deux-lignes .lystes-bdf-libelle{white-space:normal;line-height:1.2;text-wrap:balance;overflow:visible}
#lystes-bdf-fenetre{position:fixed;inset:0;z-index:2147483000;background:rgba(17,17,17,.45);display:flex;align-items:center;justify-content:center}
#lystes-bdf-fenetre .lystes-bdf-cadre{position:relative;box-sizing:border-box;width:1040px;height:660px;max-width:calc(100vw - 32px);max-height:calc(100vh - 32px);background:#ffffff;color:#111111;border-radius:14px;overflow:hidden;display:grid;grid-template-columns:minmax(0,560fr) minmax(0,480fr);grid-template-rows:minmax(0,1fr);text-align:left}
#lystes-bdf-fenetre .lystes-bdf-cadre.un-volet{width:560px;grid-template-columns:minmax(0,1fr)}
#lystes-bdf-fenetre .lystes-bdf-cadre.faq-seule{height:auto}
#lystes-bdf-fenetre .lystes-bdf-onglets{display:none}
#lystes-bdf-fenetre .lystes-bdf-fermer,#lystes-bdf-fenetre .lystes-bdf-onglets button,#lystes-bdf-fenetre .lystes-bdf-question>button{all:unset;box-sizing:border-box;cursor:pointer;font-family:inherit}
#lystes-bdf-fenetre .lystes-bdf-fermer{position:absolute;right:14px;top:14px;width:36px;height:36px;border-radius:50%;background:#f1f1f1;display:flex;align-items:center;justify-content:center;z-index:3}
#lystes-bdf-fenetre .lystes-bdf-fermer svg{display:block}
#lystes-bdf-fenetre .lystes-bdf-volet{min-width:0;min-height:0;overflow-y:auto}
#lystes-bdf-fenetre .lystes-bdf-parcours{display:flex;flex-direction:column}
#lystes-bdf-fenetre .lystes-bdf-parcours>iframe{flex:1;width:100%;min-height:0;border:0;display:block}
#lystes-bdf-fenetre .lystes-bdf-faq{background:#f6f6f6;padding:44px 40px;display:flex;flex-direction:column;gap:6px}
#lystes-bdf-fenetre .lystes-bdf-faq h2{margin:0;padding:0 40px 0 0;font-weight:500;font-size:26px;line-height:1.2;color:#111111;text-transform:none;letter-spacing:normal}
#lystes-bdf-fenetre .lystes-bdf-produit{font-size:13px;color:#6b6b6b;margin-bottom:18px}
#lystes-bdf-fenetre .lystes-bdf-question{border-top:1px solid #e6e6e6}
#lystes-bdf-fenetre .lystes-bdf-question>button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 0;font-size:14px;font-weight:600;line-height:1.4;color:#111111;text-align:left}
#lystes-bdf-fenetre .lystes-bdf-signe{font-size:18px;line-height:1;flex:none}
#lystes-bdf-fenetre .lystes-bdf-reponse{margin:0 0 16px;font-size:14px;line-height:1.55;color:#444444}
#lystes-bdf-fenetre .lystes-bdf-avis{margin-top:28px;display:flex;flex-direction:column;gap:12px;min-width:0}
#lystes-bdf-fenetre .lystes-bdf-avis-tete{display:flex;align-items:center;justify-content:space-between;gap:12px}
#lystes-bdf-fenetre .lystes-bdf-avis-titre{margin:0;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6b6b6b}
#lystes-bdf-fenetre .lystes-bdf-avis-piste{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;outline:none}
#lystes-bdf-fenetre .lystes-bdf-avis-piste::-webkit-scrollbar{display:none}
#lystes-bdf-fenetre .lystes-bdf-carte{flex:0 0 min(260px,85%);box-sizing:border-box;scroll-snap-align:start;background:#ffffff;border-radius:6px;padding:16px;display:flex;flex-direction:column;gap:8px;min-width:0;margin:0}
#lystes-bdf-fenetre .lystes-bdf-etoiles{font-size:13px;letter-spacing:2px;color:#111111;line-height:1}
#lystes-bdf-fenetre .lystes-bdf-carte-texte{margin:0;font-size:13px;line-height:1.5;color:#444444;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
#lystes-bdf-fenetre .lystes-bdf-carte-pied{margin-top:auto;font-size:11px;line-height:1.4;color:#6b6b6b;display:flex;flex-wrap:wrap;gap:4px 8px;align-items:center}
#lystes-bdf-fenetre .lystes-bdf-toutes{border-top:1px solid #e6e6e6;padding-top:14px;font-size:13px;font-weight:600;color:#111111;text-decoration:underline;text-underline-offset:3px}
#lystes-bdf-fenetre.tel{align-items:stretch;justify-content:stretch}
#lystes-bdf-fenetre.tel .lystes-bdf-cadre{width:100%;height:100%;max-width:none;max-height:none;border-radius:0;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr)}
#lystes-bdf-fenetre.tel .lystes-bdf-cadre.un-volet{width:100%;grid-template-rows:minmax(0,1fr)}
#lystes-bdf-fenetre.tel .lystes-bdf-cadre:not(.un-volet) .lystes-bdf-onglets{display:flex;align-items:center;gap:22px;padding:0 64px 0 20px;height:60px}
#lystes-bdf-fenetre.tel .lystes-bdf-onglets button{font-size:14px;font-weight:600;color:#6b6b6b;white-space:nowrap}
#lystes-bdf-fenetre.tel .lystes-bdf-onglets button[aria-selected="true"]{color:#111111;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:8px}
#lystes-bdf-fenetre.tel .lystes-bdf-fermer{top:12px;right:12px}
#lystes-bdf-fenetre.tel .lystes-bdf-cadre:not(.un-volet) .lystes-bdf-volet:not(.actif){display:none}
#lystes-bdf-fenetre.tel .lystes-bdf-faq{padding:24px 20px}
#lystes-bdf-fenetre.tel .lystes-bdf-faq h2{font-size:22px}
`;

const FLECHE = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 7h10v10" /><path d="M7 17 17 7" />
  </svg>
);
const CROIX = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

type Question = { question: string; reponse: string; repondue?: boolean };
type FaqLue = { questions: Question[]; lien: string | null };
export type AvisBdf = { nom: string; note: number; texte: string };

/* La FAQ publique de la marque, la même que sa page /faq. Les réponses
   « la marque n'a pas encore précisé ce point » passent après les autres :
   la fenêtre ouvre sur une vraie réponse. */
const NB_QUESTIONS = 6;
async function lireFaqMarque(slug: string): Promise<FaqLue | null> {
  const base = LYSTES_ENV.VITE_SUPABASE_URL as string | undefined;
  const cle = LYSTES_ENV.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  if (!base || !cle) return null;
  try {
    const r = await fetch(`${base}/functions/v1/faq-marque-publique?slug=${encodeURIComponent(slug)}&limite=40&schema=non`, {
      headers: { apikey: cle, Authorization: `Bearer ${cle}` },
    });
    if (!r.ok) return null;
    const d = (await r.json()) as { questions?: Question[]; adresse?: string };
    const toutes = (d.questions ?? []).filter((q) => q.question?.trim() && q.reponse?.trim());
    const rangees = [...toutes.filter((q) => q.repondue !== false), ...toutes.filter((q) => q.repondue === false)];
    return { questions: rangees.slice(0, NB_QUESTIONS), lien: typeof d.adresse === "string" ? d.adresse : null };
  } catch {
    return null;
  }
}

/**
 * Démonstration (visite « Vos outils » de l'accueil, 12/10/2026) : la FAQ est
 * fournie au lieu d'être lue, le volet du parcours montre `parcours` au lieu
 * de son iframe, et la fenêtre s'ouvre dans `conteneur` (l'écran de la
 * visite) sans bloquer le défilement de la page. Absente sur les vraies pages.
 */
export interface DemoDiagFaq {
  questions: Question[];
  lien: string | null;
  parcours: ReactNode;
  conteneur: Element | null;
  /* La fenêtre en présentation téléphone, quelle que soit la largeur de la
     fenêtre du navigateur : l'écran de la visite est une colonne étroite. */
  tel?: boolean;
}

export function BoutonDiagFaq({
  marque,
  slug,
  libelle,
  libelleAction = "Faire un diagnostic",
  parcoursUrl,
  avis,
  auClic,
  deuxLignes = false,
  demo,
}: {
  marque: string;
  /* L'adresse de la marque sur lystes.ai, pour lire sa FAQ. */
  slug: string;
  /* La petite phrase à droite de la pastille noire. */
  libelle: string;
  libelleAction?: string;
  /* Le parcours de diagnostic de la marque, affiché dans le volet gauche. */
  parcoursUrl: string;
  avis: AvisBdf[];
  auClic?: () => void;
  /* La phrase peut passer sur deux lignes (colonne étroite). */
  deuxLignes?: boolean;
  demo?: DemoDiagFaq;
}) {
  const [ouverte, setOuverte] = useState(false);
  const [faq, setFaq] = useState<FaqLue | null>(demo ? { questions: demo.questions, lien: demo.lien } : null);
  const [faqLue, setFaqLue] = useState(Boolean(demo));
  const [ouvert, setOuvert] = useState(0);
  const [onglet, setOnglet] = useState<"parcours" | "faq">("parcours");
  const [tel, setTel] = useState(() => demo?.tel ?? (typeof window !== "undefined" && window.innerWidth < 768));

  /* La FAQ est lue avant le clic : la fenêtre s'ouvre déjà remplie. */
  useEffect(() => {
    if (demo) return;
    let annule = false;
    void lireFaqMarque(slug).then((f) => {
      if (annule) return;
      setFaq(f);
      setFaqLue(true);
    });
    return () => { annule = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- la démonstration ne change pas
  }, [slug]);

  useEffect(() => {
    if (!ouverte) return;
    /* Dans la visite, la page qui porte l'écran garde son défilement. */
    if (demo) { setTel(demo.tel ?? window.innerWidth < 768); return; }
    const avant = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const touche = (e: KeyboardEvent) => { if (e.key === "Escape") setOuverte(false); };
    const largeur = () => setTel(window.innerWidth < 768);
    document.addEventListener("keydown", touche);
    window.addEventListener("resize", largeur);
    largeur();
    return () => {
      document.documentElement.style.overflow = avant;
      document.removeEventListener("keydown", touche);
      window.removeEventListener("resize", largeur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- la démonstration ne change pas
  }, [ouverte]);

  const questions = faq?.questions ?? [];
  const aFaq = !faqLue || questions.length > 0;
  const lien = faq?.lien && /^https:\/\/lystes\.ai\/[^\s"'<>]*$/.test(faq.lien) ? faq.lien : null;

  const ouvrir = () => {
    auClic?.();
    setOuvert(0);
    setOnglet("parcours");
    setOuverte(true);
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className={"lystes-bdf" + (deuxLignes ? " deux-lignes" : "")} id="lystes-bdf">
        <button type="button" className="lystes-bdf-bouton" aria-haspopup="dialog" onClick={ouvrir}>
          <span className="lystes-bdf-pastille">
            {libelleAction}
            <span className="lystes-bdf-ai">AI</span>
          </span>
          <span className="lystes-bdf-libelle">{libelle}</span>
          <span className="lystes-bdf-fleche">{FLECHE}</span>
        </button>
      </div>
      {ouverte && createPortal(
        <div id="lystes-bdf-fenetre" className={tel ? "tel" : undefined} onClick={(e) => { if (e.target === e.currentTarget) setOuverte(false); }}>
          <div className={"lystes-bdf-cadre" + (aFaq ? "" : " un-volet")} role="dialog" aria-modal="true" aria-label={libelle}>
            <div className="lystes-bdf-onglets" role="tablist">
              {([["parcours", "Diagnostic"], ["faq", "Questions"]] as const).map(([id, nom]) => (
                <button key={id} type="button" role="tab" aria-selected={onglet === id} onClick={() => setOnglet(id)}>{nom}</button>
              ))}
            </div>
            <button type="button" className="lystes-bdf-fermer" aria-label="Fermer" onClick={() => setOuverte(false)}>{CROIX}</button>
            <div className={"lystes-bdf-volet lystes-bdf-parcours" + (onglet === "parcours" ? " actif" : "")} data-volet="parcours">
              {demo ? demo.parcours : <iframe src={parcoursUrl} title={libelleAction} allow="camera; microphone" />}
            </div>
            {aFaq && (
              <div className={"lystes-bdf-volet lystes-bdf-faq" + (onglet === "faq" ? " actif" : "")} data-volet="faq">
                <h2>{libelle}</h2>
                <div className="lystes-bdf-produit">{marque}</div>
                <div className="lystes-bdf-questions">
                  {questions.map((q, i) => (
                    <div className="lystes-bdf-question" key={i}>
                      <button type="button" aria-expanded={ouvert === i} onClick={() => setOuvert((v) => (v === i ? -1 : i))}>
                        <span>{q.question.trim()}</span>
                        <span className="lystes-bdf-signe" aria-hidden="true">{ouvert === i ? "−" : "+"}</span>
                      </button>
                      <p className="lystes-bdf-reponse" hidden={ouvert !== i}>{q.reponse.trim()}</p>
                    </div>
                  ))}
                </div>
                {lien && <a className="lystes-bdf-toutes" href={lien} target="_blank" rel="noopener">Toutes les questions</a>}
                {avis.length > 0 && (
                  <section className="lystes-bdf-avis">
                    <div className="lystes-bdf-avis-tete"><h3 className="lystes-bdf-avis-titre">Avis clientes</h3></div>
                    <div className="lystes-bdf-avis-piste" tabIndex={0} aria-label="Avis clientes">
                      {avis.map((a, i) => {
                        const n = Math.max(0, Math.min(5, Math.round(Number(a.note) || 0)));
                        return (
                          <article className="lystes-bdf-carte" key={i}>
                            <div className="lystes-bdf-etoiles" aria-label={`${n}/5`}>{"★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n)}</div>
                            <p className="lystes-bdf-carte-texte">{a.texte.trim()}</p>
                            {a.nom?.trim() && <div className="lystes-bdf-carte-pied"><span>{a.nom.trim()}</span></div>}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>,
        demo?.conteneur ?? document.body,
      )}
    </>
  );
}
