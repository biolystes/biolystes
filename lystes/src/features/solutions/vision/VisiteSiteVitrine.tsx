import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowUp, ChevronRight, History, MessageCircle, Mic, Newspaper, Phone, PhoneOff, Star, X } from "lucide-react";
import { CadreReproduit } from "./CadreReproduit";
import {
  ARTICLES_CORPO,
  AVIS_CORPO,
  CONSEILLER_CORPO,
  CONTACT_CORPO,
  FAQ_DEMANDES_CORPO,
  LOGO_CORPO,
  MARQUE_CORPO,
  PHOTOS_SITE,
} from "./demoCorporate";
import {
  DUREE_ETAPE,
  ECRAN_BOUTIQUE,
  Encart,
  EncartPose,
  LARGEUR_ENCART,
  prise,
  type Agent,
  type Cote,
  type Pied,
  type Point,
  type Pointe,
  type Prise,
  type TailleCadre,
} from "../VisionEtages";

/**
 * Étage 1 de la version « Entreprises » (/business, JP, 12/10/2026) :
 * « Votre e-commerce devient Votre site web. Prends un exemple de site
 * vitrine très beau pour illustrer les blocs, et enlève l'aspect e-commerce :
 * pas de panier, rien de ce genre. »
 *
 * Même mécanique que la boutique de l'accueil (VisionEtages, Boutique) : un
 * écran d'ordinateur de 1280 × 800 réduit à la largeur du cadre, l'orbital
 * ouvert dessus, un point qui pulse sur la zone de l'agent et l'encart posé à
 * côté. La boutique de l'accueil est une copie d'Éclose avec le vrai widget,
 * branché sur le vrai agent d'Éclose ; une entreprise de démonstration n'a pas
 * d'agent en base : le site de Brévan Architectes (cabinet inventé,
 * demoCorporate.ts) et son orbital sont donc reproduits ici, au dessin du
 * widget (accueil, conversation, avis, actualité, FAQ, contact, newsletter,
 * appel), sans panier. Rien n'est cliquable, rien ne part.
 *
 * Le bouton noir du champ de chat est « Nos dernières actus » (JP, 12/10) :
 * il ouvre les articles que le Magazine IA écrit seul.
 */

type Vue = "accueil" | "chat" | "avis" | "actus" | "faq" | "contact" | "newsletter";
type EtapeSite = { vue: Vue | null; appel?: boolean; prise: Prise; cote: Cote };

const POSTES: { agent: Agent; etape: EtapeSite }[] = [
  {
    agent: {
      nom: "Conseiller du site IA",
      mission: "un cerveau qui connaît tout votre site",
      role: "Répondre à tout, depuis n’importe quelle page : vos services, vos références, votre façon de travailler, vos délais.",
      unique: "Branché sur la base de connaissances de votre site, il oriente chaque visiteur vers le bon service et lui propose un rendez-vous ou une demande de devis.",
    },
    etape: { vue: "chat", prise: "gauche", cote: "gauche" },
  },
  {
    agent: {
      nom: "Responsable avis IA",
      mission: "recueille et montre les avis de vos clients",
      role: "Recueillir les avis de vos clients sur l’entreprise, et les montrer là où un prospect hésite.",
      unique: "Il répond à chaque avis au nom de l’entreprise, et les avis ne sont jamais filtrés.",
    },
    etape: { vue: "avis", prise: "gauche", cote: "gauche" },
  },
  {
    agent: {
      nom: "Expert SEO et GEO IA",
      mission: "tient vos actualités, pour Google et les IA",
      role: "Publier vos actualités et vos articles d’expertise, réunis derrière le bouton « Nos dernières actus ».",
      unique: "Chaque semaine, il choisit ses sujets parmi les recherches de votre secteur et les questions de vos prospects. Vos visiteurs voient un cabinet actif, Google et ChatGPT aussi.",
    },
    etape: { vue: "actus", prise: "gauche", cote: "gauche" },
  },
  {
    agent: {
      nom: "Agent FAQ IA",
      mission: "les questions de vos prospects, avant qu’ils les posent",
      role: "Réunir les questions qui reviennent : délais, méthode, zone d’intervention, déroulé d’un premier rendez-vous.",
      unique: "Elle est dynamique : une question qui revient dans les conversations rejoint la FAQ, lue par Google et par les IA.",
      elle: true,
    },
    etape: { vue: "faq", prise: "gauche", cote: "gauche" },
  },
  {
    agent: {
      nom: "Formulaire IA",
      mission: "répond tout de suite, ou range la demande",
      role: "Remplacer votre formulaire de contact par un formulaire qui sait répondre.",
      unique: "Beaucoup de demandes ont une réponse immédiate : il la donne et ferme lui-même le ticket. Votre équipe ne traite que les vrais projets.",
    },
    etape: { vue: "contact", prise: "gauche", cote: "gauche" },
  },
  {
    agent: {
      nom: "Newsletter IA",
      mission: "récupère les e-mails, envoie vos articles",
      role: "Récupérer les e-mails de vos visiteurs et leur envoyer vos articles d’expertise et vos actualités.",
      unique: "Chaque inscription complète la fiche du contact : vous savez ce qui l’intéresse avant le premier rendez-vous.",
    },
    etape: { vue: "newsletter", prise: "gauche", cote: "gauche" },
  },
  {
    agent: {
      nom: "Conseiller téléphonique IA",
      mission: "l’appel depuis l’orbital, de vive voix",
      role: "Répondre de vive voix depuis n’importe quelle page du site.",
      unique: "Idéal pour le dirigeant entre deux réunions. On parle plus vite qu’on n’écrit : il pose plus de questions, et vous comprenez mieux son projet.",
    },
    etape: { vue: null, appel: true, prise: "haut", cote: "haut" },
  },
];

export const AGENTS_SITE: Agent[] = POSTES.map((p) => p.agent);

/* ---------- L'écran : le site vitrine et son orbital ---------- */

/* Le temps passé dans l'étape, pour ce qui s'y joue (la réponse qui arrive,
   le formulaire qui se remplit, le bouton des actus puis leur page). */
function useTemps(cle: string, fin: number) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    setMs(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setMs(fin); return; }
    const debut = performance.now();
    const id = window.setInterval(() => {
      const v = performance.now() - debut;
      setMs(v);
      if (v > fin) window.clearInterval(id);
    }, 60);
    return () => window.clearInterval(id);
  }, [cle, fin]);
  return ms;
}

const ACTUS_DATES = ["8 oct. 2026", "1 oct. 2026", "24 sept. 2026"];
const ACTUS_LECTURE = ["6 min de lecture", "5 min de lecture", "4 min de lecture"];

function Etoiles({ n = 5 }: { n?: number }) {
  return (
    <span className="vv-etoiles" aria-label={`${n} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => <Star key={i} size={12} strokeWidth={0} fill={i < n ? "#111" : "#d4d4d8"} />)}
    </span>
  );
}

function Orbital({ vue, ms }: { vue: Vue; ms: number }) {
  /* Les actus : le bouton noir du champ de chat d'abord, puis la page. */
  const actusOuvertes = vue === "actus" && ms > 2400;
  const montre: Vue = vue === "actus" && !actusOuvertes ? "accueil" : vue;
  const sousTitre: Partial<Record<Vue, string>> = {
    avis: "Avis clients", actus: "Nos dernières actus", faq: "Questions fréquentes", contact: "Nous contacter", newsletter: "La lettre du cabinet",
  };
  return (
    <div className="vv-orbital" data-vv-orbital="">
      <div className="vv-o-tete">
        <History size={15} strokeWidth={1.6} />
        <span className="vv-o-icones"><MessageCircle size={15} strokeWidth={1.6} /><Phone size={15} strokeWidth={1.6} /><X size={15} strokeWidth={1.6} /></span>
      </div>
      {sousTitre[montre] && (
        <div className="vv-o-retour"><ArrowLeft size={13} strokeWidth={1.8} /><span>{sousTitre[montre]}</span></div>
      )}
      <div className="vv-o-corps">
        {montre === "accueil" && (
          <div className="vv-o-accueil">
            <h3>Comment puis-je vous aider aujourd’hui&#8239;?</h3>
            <p>Services, références, rendez-vous.</p>
            <ChampChat actus cible={vue === "actus"} />
            <ul className="vv-o-menu">
              <li>Voir nos avis</li><li>Nos dernières actus</li><li>Questions fréquentes</li><li>Nous contacter</li><li>S’inscrire à la newsletter</li>
            </ul>
          </div>
        )}
        {montre === "chat" && (
          <div className="vv-o-chat">
            <div className="vv-bulle assistant">{CONSEILLER_CORPO.accueil}</div>
            {ms > 600 && <div className="vv-bulle user">{CONSEILLER_CORPO.question}</div>}
            {ms > 1500 && ms <= 3000 && <div className="vv-bulle assistant vv-points"><i /><i /><i /></div>}
            {ms > 3000 && (
              <div className="vv-bulle assistant" data-vv-cible="">
                {CONSEILLER_CORPO.reponse}
                <span className="vv-rdv">Prendre rendez-vous</span>
              </div>
            )}
            <div className="vv-o-bas"><ChampChat actus /></div>
          </div>
        )}
        {montre === "avis" && (
          <div className="vv-o-avis">
            <div className="vv-note" data-vv-cible="">
              <strong>{String(AVIS_CORPO.avgRating).replace(".", ",")}</strong>
              <div><Etoiles /><small>{AVIS_CORPO.totalCount} avis clients</small></div>
            </div>
            {AVIS_CORPO.reviews.slice(0, 3).map((a) => (
              <article key={a.id} className="vv-avis">
                <Etoiles n={a.rating} />
                <b>{a.title}</b>
                <p>{a.content}</p>
                <small>{a.author_name} · {a.location}</small>
              </article>
            ))}
          </div>
        )}
        {montre === "actus" && (
          <div className="vv-o-actus">
            {ARTICLES_CORPO.map((a, i) => (
              <article key={a.id} className="vv-actu" data-vv-cible={i === 0 ? "" : undefined}>
                <small>{ACTUS_DATES[i]} · {ACTUS_LECTURE[i]}</small>
                <b>{a.title}</b>
                <p>{a.dek}</p>
                <span className="vv-lire">Lire l’article <ChevronRight size={12} strokeWidth={2} /></span>
              </article>
            ))}
          </div>
        )}
        {montre === "faq" && (
          <div className="vv-o-faq">
            {FAQ_DEMANDES_CORPO.map((q, i) => (
              <div key={q.cle} className={"vv-q" + (i === 0 ? " ouverte" : "")} data-vv-cible={i === 0 ? "" : undefined}>
                <b>{q.question}<span>{i === 0 ? "−" : "+"}</span></b>
                {i === 0 && <p>{q.reponse}</p>}
              </div>
            ))}
          </div>
        )}
        {montre === "contact" && <Contact ms={ms} />}
        {montre === "newsletter" && <Newsletter ms={ms} />}
      </div>
    </div>
  );
}

/* Le champ de chat de l'orbital, et son bouton noir : « Nos dernières actus »
   pour une entreprise, à la place de « Faire un diagnostic ». */
function ChampChat({ actus, cible }: { actus?: boolean; cible?: boolean }) {
  return (
    <div className="vv-champ">
      <span className="vv-champ-texte">Votre question…</span>
      <div className="vv-champ-bas">
        {actus && (
          <span className="vv-actus-btn" data-vv-cible={cible ? "" : undefined}>
            <Newspaper size={12} strokeWidth={1.8} />Nos dernières actus<i>AI</i>
          </span>
        )}
        <span className="vv-champ-droite"><Mic size={13} strokeWidth={1.6} /><span className="vv-envoi"><ArrowUp size={12} strokeWidth={2} /></span></span>
      </div>
    </div>
  );
}

const tape = (texte: string, ms: number, debut: number, vitesse = 40) =>
  ms < debut ? "" : texte.slice(0, Math.min(texte.length, Math.floor((ms - debut) / vitesse) + 1));

function Contact({ ms }: { ms: number }) {
  const envoye = ms > 3600;
  return envoye ? (
    <div className="vv-o-chat">
      <div className="vv-bulle user">{CONTACT_CORPO.message}</div>
      {ms <= 4800 && <div className="vv-bulle assistant vv-points"><i /><i /><i /></div>}
      {ms > 4800 && <div className="vv-bulle assistant" data-vv-cible="">{CONTACT_CORPO.reponse}</div>}
      {ms > 4800 && <p className="vv-statut">Demande enregistrée · réponse donnée</p>}
    </div>
  ) : (
    <form className="vv-form">
      <label>Nom<span data-vv-cible={ms < 900 ? "" : undefined}>{tape(CONTACT_CORPO.nom, ms, 300, 70)}</span></label>
      <label>E-mail<span data-vv-cible={ms >= 900 && ms < 1700 ? "" : undefined}>{tape(CONTACT_CORPO.email, ms, 900)}</span></label>
      <label>Votre projet<span className="haut" data-vv-cible={ms >= 1700 ? "" : undefined}>{tape(CONTACT_CORPO.message, ms, 1700, 24)}</span></label>
      <span className="vv-envoyer">Envoyer</span>
    </form>
  );
}

function Newsletter({ ms }: { ms: number }) {
  const inscrit = ms > 3200;
  return (
    <div className="vv-o-lettre">
      <h3>La lettre de {MARQUE_CORPO}</h3>
      <p>Nos articles d’expertise et nos projets, une fois par mois.</p>
      {inscrit ? (
        <p className="vv-statut" data-vv-cible="">Inscription confirmée. Premier envoi : votre sélection d’articles.</p>
      ) : (
        <>
          <span className="vv-champ-mail" data-vv-cible="">{tape("helene.martin@exemple.fr", ms, 600)}</span>
          <span className="vv-envoyer">S’inscrire</span>
        </>
      )}
    </div>
  );
}

function Appel({ ms }: { ms: number }) {
  const s = Math.floor(ms / 1000);
  return (
    <div className="vv-appel" data-vv-cible="">
      <img src={LOGO_CORPO} alt="" />
      <span><b>Louise</b><small>En ligne · 00:{String(s).padStart(2, "0")}</small></span>
      <span className="vv-onde" aria-hidden="true">{[6, 12, 8, 14, 7, 11, 5].map((h, i) => <i key={i} style={{ height: h, animationDelay: `${i * 90}ms` }} />)}</span>
      <span className="vv-raccrocher"><PhoneOff size={13} strokeWidth={1.8} /></span>
    </div>
  );
}

/* Le site vitrine, toujours le même : en-tête, accroche, projets récents. */
function SiteVitrine({ etape, ms }: { etape: EtapeSite; ms: number }) {
  return (
    <div className="vv-site">
      <header className="vv-tete">
        <span className="vv-logo"><img src={LOGO_CORPO} alt="" />BRÉVAN<em>ARCHITECTES</em></span>
        <nav><span>Agence</span><span>Projets</span><span>Expertises</span><span>Journal</span><span>Contact</span></nav>
        <span className="vv-cta">Prendre rendez-vous</span>
      </header>
      <section className="vv-hero">
        <div className="vv-hero-texte">
          <p className="vv-sur">Architecture · Architecture intérieure · Paris, Lyon</p>
          <h1>Des lieux de travail pensés pour celles et ceux qui les habitent.</h1>
          <p>Sièges sociaux, bureaux, réhabilitations : nous dessinons et suivons vos projets, de la première étude à la remise des clés.</p>
          <span className="vv-lien">Voir nos projets <ChevronRight size={14} strokeWidth={2} /></span>
        </div>
        <img className="vv-hero-img" src={PHOTOS_SITE.hero} alt="" />
      </section>
      <section className="vv-projets">
        <p className="vv-sur">Projets récents</p>
        <div className="vv-grille">
          {PHOTOS_SITE.projets.map((p) => (
            <figure key={p.src}>
              <img src={p.src} alt="" />
              <figcaption><b>{p.titre}</b><small>{p.lieu}</small></figcaption>
            </figure>
          ))}
        </div>
      </section>
      {etape.vue && <div className="vv-voile" />}
      {etape.vue && <Orbital vue={etape.vue} ms={ms} />}
      {!etape.vue && !etape.appel && <span className="vv-lanceur"><MessageCircle size={20} strokeWidth={1.6} /></span>}
      {etape.appel && <Appel ms={ms} />}
    </div>
  );
}

const CSS_SITE = `
html,body{ margin:0; background:#fff; overflow:hidden !important; }
.vv-site{ position:relative; width:1280px; height:800px; overflow:hidden; background:#fff; color:#111;
  font-family:'Satoshi','Inter',-apple-system,'Helvetica Neue',Arial,sans-serif; -webkit-font-smoothing:antialiased; }
.vv-site *{ box-sizing:border-box; }
.vv-site h1,.vv-site h3,.vv-site p{ margin:0; }
.vv-tete{ height:76px; padding:0 56px; display:flex; align-items:center; gap:40px; border-bottom:1px solid #ececec; }
.vv-logo{ display:flex; align-items:center; gap:12px; font-weight:700; font-size:15px; letter-spacing:.22em; }
.vv-logo img{ width:30px; height:30px; }
.vv-logo em{ font-style:normal; font-weight:400; margin-left:8px; color:#6b6b6b; }
.vv-tete nav{ margin-left:auto; display:flex; gap:30px; font-size:14px; color:#3f3f46; }
.vv-cta{ background:#111; color:#fff; border-radius:9px; padding:11px 18px; font-size:14px; font-weight:600; }
.vv-hero{ display:grid; grid-template-columns:470px 1fr; gap:48px; padding:44px 56px 0; height:420px; }
.vv-hero-texte{ display:flex; flex-direction:column; justify-content:center; gap:20px; }
.vv-sur{ font-size:11px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:#777b7f; }
.vv-hero h1{ font-family:'Bricolage Grotesque','Satoshi',sans-serif; font-weight:400; font-size:46px; line-height:1.06; letter-spacing:-.025em; text-wrap:balance; }
.vv-hero-texte > p:not(.vv-sur){ font-size:16px; line-height:1.6; color:#52525b; max-width:420px; }
.vv-lien{ display:inline-flex; align-items:center; gap:4px; font-size:14px; font-weight:600; border-bottom:1px solid #111; align-self:flex-start; padding-bottom:2px; }
.vv-hero-img{ width:100%; height:376px; object-fit:cover; border-radius:14px; display:block; }
.vv-projets{ padding:30px 56px 0; }
.vv-grille{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:14px; }
.vv-grille figure{ margin:0; }
.vv-grille img{ width:100%; height:190px; object-fit:cover; border-radius:12px; display:block; }
.vv-grille figcaption{ display:flex; justify-content:space-between; gap:12px; margin-top:10px; font-size:14px; }
.vv-grille small{ color:#777b7f; font-size:13px; white-space:nowrap; }
.vv-lanceur{ position:absolute; right:28px; bottom:28px; width:56px; height:56px; border-radius:50%; background:#111; color:#fff; display:flex; align-items:center; justify-content:center; }
.vv-voile{ position:absolute; inset:0; background:rgba(0,0,0,.42); }
.vv-orbital{ position:absolute; left:417px; top:80px; width:445px; height:637px; background:#fff; border-radius:22px; display:flex; flex-direction:column; overflow:hidden; }
.vv-o-tete{ display:flex; justify-content:space-between; align-items:center; padding:18px 22px 6px; color:#3f3f46; }
.vv-o-icones{ display:flex; gap:14px; }
.vv-o-retour{ display:flex; align-items:center; gap:8px; padding:6px 22px 4px; font-size:14px; font-weight:600; }
.vv-o-corps{ flex:1; min-height:0; padding:12px 22px 22px; display:flex; flex-direction:column; }
.vv-o-accueil{ display:flex; flex-direction:column; gap:10px; padding-top:70px; }
.vv-o-accueil h3{ font-size:20px; font-weight:600; letter-spacing:-.01em; line-height:1.25; }
.vv-o-accueil > p{ font-size:13px; color:#777b7f; }
.vv-champ{ border:1px solid #e4e4e7; border-radius:14px; padding:12px 12px 10px; margin-top:8px; }
.vv-champ-texte{ font-size:14px; color:#a1a1aa; }
.vv-champ-bas{ display:flex; align-items:center; justify-content:space-between; margin-top:14px; }
.vv-actus-btn{ display:inline-flex; align-items:center; gap:6px; background:#111; color:#fff; border-radius:6px; padding:8px 11px; font-size:12px; font-weight:800; white-space:nowrap; }
.vv-actus-btn i{ font-style:normal; background:#fff; color:#111; border-radius:3px; font-size:7px; padding:3px 4px; font-weight:800; line-height:1; }
.vv-champ-droite{ display:flex; align-items:center; gap:10px; margin-left:auto; color:#52525b; }
.vv-envoi{ width:26px; height:26px; border-radius:50%; background:#111; color:#fff; display:inline-flex; align-items:center; justify-content:center; }
.vv-o-menu{ list-style:none; margin:14px 0 0; padding:0; }
.vv-o-menu li{ padding:11px 0; border-bottom:1px solid #f1f1f1; font-size:14px; text-align:center; color:#27272a; }
.vv-o-chat{ display:flex; flex-direction:column; gap:10px; flex:1; padding-top:8px; }
.vv-bulle{ max-width:84%; padding:11px 14px; border-radius:16px; font-size:14px; line-height:1.5; }
.vv-bulle.assistant{ background:#f3f4f5; align-self:flex-start; border-bottom-left-radius:6px; }
.vv-bulle.user{ background:#111; color:#fff; align-self:flex-end; border-bottom-right-radius:6px; }
.vv-points{ display:flex; gap:4px; }
.vv-points i{ width:6px; height:6px; border-radius:50%; background:#a1a1aa; animation:vv-p 1s infinite; }
.vv-points i:nth-child(2){ animation-delay:.15s; } .vv-points i:nth-child(3){ animation-delay:.3s; }
@keyframes vv-p{ 0%,100%{ opacity:.3 } 50%{ opacity:1 } }
.vv-rdv{ display:inline-block; margin-top:10px; background:#111; color:#fff; border-radius:8px; padding:8px 12px; font-size:13px; font-weight:600; }
.vv-o-bas{ margin-top:auto; }
.vv-o-avis{ display:flex; flex-direction:column; gap:12px; }
.vv-note{ display:flex; align-items:center; gap:14px; padding:6px 0 4px; }
.vv-note strong{ font-size:40px; font-weight:600; letter-spacing:-.02em; }
.vv-note small{ display:block; font-size:12px; color:#777b7f; margin-top:3px; }
.vv-etoiles{ display:inline-flex; gap:1px; }
.vv-avis{ background:#f3f4f5; border-radius:12px; padding:12px 14px; display:flex; flex-direction:column; gap:5px; }
.vv-avis b{ font-size:14px; } .vv-avis p{ font-size:13px; line-height:1.45; color:#3f3f46; }
.vv-avis small{ font-size:12px; color:#777b7f; }
.vv-o-actus{ display:flex; flex-direction:column; gap:10px; }
.vv-actu{ border-bottom:1px solid #f1f1f1; padding:8px 0 14px; display:flex; flex-direction:column; gap:6px; }
.vv-actu small{ font-size:12px; color:#777b7f; } .vv-actu b{ font-size:16px; line-height:1.3; letter-spacing:-.01em; }
.vv-actu p{ font-size:13px; line-height:1.5; color:#52525b; }
.vv-lire{ display:inline-flex; align-items:center; gap:2px; font-size:13px; font-weight:600; }
.vv-o-faq{ display:flex; flex-direction:column; }
.vv-q{ border-bottom:1px solid #f1f1f1; padding:14px 0; }
.vv-q b{ display:flex; justify-content:space-between; gap:14px; font-size:14px; line-height:1.4; }
.vv-q b span{ color:#777b7f; font-weight:400; }
.vv-q p{ font-size:13px; line-height:1.5; color:#52525b; margin-top:8px; }
.vv-form{ display:flex; flex-direction:column; gap:12px; padding-top:6px; }
.vv-form label{ display:flex; flex-direction:column; gap:6px; font-size:12px; font-weight:600; color:#3f3f46; }
.vv-form label span{ display:block; min-height:40px; border:1px solid #e4e4e7; border-radius:10px; padding:11px 12px; font-size:14px; font-weight:400; color:#111; }
.vv-form label span.haut{ min-height:96px; line-height:1.45; }
.vv-envoyer{ align-self:flex-start; background:#111; color:#fff; border-radius:9px; padding:11px 18px; font-size:14px; font-weight:600; }
.vv-statut{ font-size:12px; color:#3f3f46; background:#e1f3c5; border-radius:8px; padding:8px 10px; align-self:flex-start; }
.vv-o-lettre{ display:flex; flex-direction:column; gap:12px; padding-top:60px; }
.vv-o-lettre h3{ font-size:20px; font-weight:600; }
.vv-o-lettre > p{ font-size:14px; color:#52525b; line-height:1.5; }
.vv-champ-mail{ display:block; min-height:44px; border:1px solid #e4e4e7; border-radius:10px; padding:12px; font-size:14px; }
.vv-appel{ position:absolute; left:50%; bottom:28px; transform:translateX(-50%); display:flex; align-items:center; gap:12px; background:#111; color:#fff;
  border-radius:999px; padding:8px 10px 8px 8px; }
.vv-appel img{ width:34px; height:34px; border-radius:50%; background:#fff; }
.vv-appel b{ display:block; font-size:14px; } .vv-appel small{ font-size:12px; color:#c9c9cc; }
.vv-onde{ display:flex; align-items:center; gap:3px; height:16px; margin:0 6px; }
.vv-onde i{ width:3px; border-radius:2px; background:#e1f3c5; animation:vv-onde 1s ease-in-out infinite alternate; }
@keyframes vv-onde{ from{ transform:scaleY(.4) } to{ transform:scaleY(1) } }
.vv-raccrocher{ width:34px; height:34px; border-radius:50%; background:#fff; color:#111; display:inline-flex; align-items:center; justify-content:center; }
@media (prefers-reduced-motion:reduce){ .vv-onde i, .vv-points i{ animation:none; } }
`;

/* ---------- La visite ---------- */

/* Le temps de chaque étape : la conversation et le formulaire jouent leur
   scène, les autres tiennent la durée ordinaire. */
const FIN_SCENE = 6000;

export default function VisiteSiteVitrine({ etape, survol, mobile, pied, taille, prete }: {
  etape: number;
  survol: (s: boolean) => void;
  mobile: boolean;
  pied: Pied;
  taille: (t: TailleCadre) => void;
  prete?: (p: boolean) => void;
}) {
  const boite = useRef<HTMLDivElement>(null);
  const cadreEcran = useRef<HTMLIFrameElement | null>(null);
  const [doc, setDoc] = useState<Document | null>(null);
  const [echelle, setEchelle] = useState(0);
  const [cadre, setCadre] = useState<{ w: number; h: number } | null>(null);
  const [point, setPoint] = useState<Point | null>(null);
  const rang = Math.min(Math.max(etape, 0), POSTES.length - 1);
  const poste = POSTES[rang];
  const ms = useTemps(pied.cle, Math.max(FIN_SCENE, DUREE_ETAPE));

  useLayoutEffect(() => {
    const b = boite.current;
    if (!b) return;
    const maj = () => {
      setEchelle(b.clientWidth / ECRAN_BOUTIQUE.w);
      setCadre({ w: b.clientWidth, h: b.clientHeight });
      taille({ w: b.clientWidth, h: b.clientHeight });
    };
    maj();
    const ro = new ResizeObserver(maj);
    ro.observe(b);
    return () => ro.disconnect();
  }, [taille]);

  /* Le point suit l'élément de l'étape, mesuré dans l'écran puis ramené à
     l'échelle du cadre. */
  useEffect(() => {
    if (!doc || !echelle) return;
    let raf = 0;
    const proche = (a: number, b: number) => Math.abs(a - b) < 0.5;
    const mesurer = () => {
      const el = doc.querySelector("[data-vv-cible]");
      let r = el?.getBoundingClientRect();
      /* Dans l'orbital, le point se pose sur son bord gauche, à hauteur de la
         cible : posé sur la cible, il en cachait les premiers mots. */
      const o = doc.querySelector("[data-vv-orbital]")?.getBoundingClientRect();
      if (r && o && poste.etape.prise === "gauche") r = new DOMRect(o.left, r.top, r.right - o.left, r.height);
      const q = r && r.width > 0
        ? prise({ x: r.left * echelle, y: r.top * echelle, w: r.width * echelle, h: r.height * echelle }, poste.etape.prise)
        : null;
      setPoint((p) => (!p && !q) || (p && q && proche(p.x, q.x) && proche(p.y, q.y)) ? p : q);
      raf = requestAnimationFrame(mesurer);
    };
    raf = requestAnimationFrame(mesurer);
    return () => cancelAnimationFrame(raf);
  }, [doc, echelle, poste]);

  useEffect(() => {
    prete?.(!!doc && !!point);
  }, [doc, point, prete]);

  const surCadre = useCallback(() => setDoc(cadreEcran.current?.contentDocument ?? null), []);

  return (
    <div
      className={"lyv-boutique lyv-vv" + (mobile ? "" : " lyv-b-deborde")}
      ref={boite}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") survol(true); }}
      onPointerLeave={() => survol(false)}
    >
      <CadreReproduit
        className="lyv-boutique-page on"
        title={`Le site de ${MARQUE_CORPO} et son orbital`}
        tabIndex={-1}
        refCadre={(n) => { cadreEcran.current = n; }}
        pret={surCadre}
        styleEnPlus={CSS_SITE}
        style={{ width: ECRAN_BOUTIQUE.w, height: ECRAN_BOUTIQUE.h, transform: `scale(${echelle || 0.4})`,
          borderRadius: echelle && !mobile ? 14 / echelle : undefined } as CSSProperties}
        rendu={() => <div style={{ pointerEvents: "none" }}><SiteVitrine etape={poste.etape} ms={ms} /></div>}
      />
      {point && <span className="lyv-pouls" style={{ left: point.x, top: point.y }} aria-hidden="true" />}
      {cadre && !mobile && point && (
        <EncartPose
          key={`s${etape}`}
          point={point}
          cote={poste.etape.cote}
          cadre={cadre}
          largeur={LARGEUR_ENCART}
          serrer={poste.etape.vue ? { min: 180, deborde: 24 } : undefined}
          contenu={(pointe: Pointe | null, style: CSSProperties) => (
            <Encart agent={poste.agent} loupe={null} pointe={pointe} pied={pied} survol={survol} style={style} />
          )}
        />
      )}
    </div>
  );
}
