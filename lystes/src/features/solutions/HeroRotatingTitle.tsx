import { useEffect, useMemo, useRef, useState } from "react";
import heroProduct from "@lystes/assets/hero-product-kanivza.webp.asset.json";
import heroSlideEarrings from "@lystes/assets/hero-slide-earrings.webp.asset.json";
import heroSlideJacket from "@lystes/assets/hero-slide-jacket.png.asset.json";
import heroAvatar2 from "@lystes/assets/hero-avatar-2.mp4.asset.json";


/**
 * Titre hero animé : "Transformez chaque produit en agent IA capable de..." avec le métier qui défile.
 * Rend concret un concept abstrait (agents IA) pour un
 * public novice. Monté à la place du token t012 dans le <h2> (hérite la police
 * Inter et les tailles). Multilingue (fallback EN). Aucune ombre.
 */

type Loc = { prefix: string; mobilePrefix?: string; roles: string[] };

const L: Record<string, Loc> = {
  fr: { prefix: "Recrutez des agents claude dans\nvos pages produits {{icons}}capable\nd'", roles: ["informer vos clients", "vendre pour vous", "conseiller vos clients", "rassurer vos clients", "recevoir des appels", "améliorer vos photos", "proposer une routine", "faire un diagnostic", "rendre possible l'essayage", "remonter les points de friction"] },
  en: { prefix: "Hire AI advisors in\nyour product pages {{icons}}able\n", roles: ["to sell for you", "to advise your customers", "to reassure your customers", "to inform your customers", "to take calls", "to improve your photos", "to suggest a routine", "to run a diagnostic", "to enable virtual try-on", "to surface friction points"] },
  de: { prefix: "Verwandeln Sie Ihre Produkte\nin einen KI-Agenten {{icons}}der\n", roles: ["für Sie verkauft", "Ihre Kunden berät", "Ihre Kunden beruhigt", "Ihre Kunden informiert", "Anrufe entgegennimmt", "Ihre Fotos verbessert", "eine Routine vorschlägt", "eine Diagnose erstellt", "virtuelles Anprobieren ermöglicht"] },
  es: { prefix: "Transforma tus productos\nen un agente IA {{icons}}capaz\n", roles: ["de vender por ti", "de asesorar a tus clientes", "de tranquilizar a tus clientes", "de informar a tus clientes", "de recibir llamadas", "de mejorar tus fotos", "de proponer una rutina", "de hacer un diagnóstico", "de permitir la prueba virtual"] },
  pt: { prefix: "Transforme os seus produtos\nnum agente IA {{icons}}capaz\n", roles: ["de vender por si", "de aconselhar os seus clientes", "de tranquilizar os seus clientes", "de informar os seus clientes", "de receber chamadas", "de melhorar as suas fotos", "de propor uma rotina", "de fazer um diagnóstico", "de permitir a prova virtual"] },
  it: { prefix: "Trasforma i tuoi prodotti\nin un agente IA {{icons}}capace\n", roles: ["di vendere per te", "di consigliare i tuoi clienti", "di rassicurare i tuoi clienti", "di informare i tuoi clienti", "di ricevere chiamate", "di migliorare le tue foto", "di proporre una routine", "di fare una diagnosi", "di rendere possibile la prova virtuale"] },
  nl: { prefix: "Verander uw producten\nin een AI-agent {{icons}}die\n", roles: ["voor u verkoopt", "uw klanten adviseert", "uw klanten geruststelt", "uw klanten informeert", "oproepen aanneemt", "uw foto's verbetert", "een routine voorstelt", "een diagnose stelt", "virtueel passen mogelijk maakt"] },
};

/**
 * Second hero (« De combien augmenterait… ») : les textes etaient passes en dur
 * en francais depuis les deux pages appelantes, donc jamais traduits. Ils
 * vivent ici, par langue, avec l'anglais en repli.
 */
type SecondHero = { prefix: string; roles: string[]; suffix: string };

const SECOND: Record<string, SecondHero> = {
  fr: { prefix: "De combien augmenterait", roles: ["votre chiffre d\u2019affaires", "votre taux de conversion", "votre taux de fid\u00e9lisation client", "votre taux de r\u00e9achat", "votre taux d\u2019avis positif"], suffix: "si chaque produit atteignait son plein potentiel ?" },
  en: { prefix: "How much would", roles: ["your revenue", "your conversion rate", "your customer retention rate", "your repeat purchase rate", "your positive review rate"], suffix: "grow if every product reached its full potential?" },
  es: { prefix: "\u00bfCu\u00e1nto aumentar\u00eda", roles: ["tu facturaci\u00f3n", "tu tasa de conversi\u00f3n", "tu tasa de fidelizaci\u00f3n", "tu tasa de recompra", "tu tasa de rese\u00f1as positivas"], suffix: "si cada producto alcanzara su pleno potencial?" },
  de: { prefix: "Um wie viel w\u00fcrde", roles: ["Ihr Umsatz", "Ihre Konversionsrate", "Ihre Kundenbindungsrate", "Ihre Wiederkaufsrate", "Ihre Rate positiver Bewertungen"], suffix: "steigen, wenn jedes Produkt sein volles Potenzial erreichte?" },
  it: { prefix: "Di quanto aumenterebbe", roles: ["il tuo fatturato", "il tuo tasso di conversione", "il tuo tasso di fidelizzazione", "il tuo tasso di riacquisto", "il tuo tasso di recensioni positive"], suffix: "se ogni prodotto raggiungesse il suo pieno potenziale?" },
  pt: { prefix: "Quanto aumentaria", roles: ["a sua faturac\u0327\u00e3o", "a sua taxa de convers\u00e3o", "a sua taxa de fidelizac\u0327\u00e3o", "a sua taxa de recompra", "a sua taxa de avaliac\u0327\u00f5es positivas"], suffix: "se cada produto atingisse todo o seu potencial?" },
  nl: { prefix: "Hoeveel zou", roles: ["uw omzet", "uw conversieratio", "uw klantbehoud", "uw herhaalaankopen", "uw positieve reviews"], suffix: "stijgen als elk product zijn volle potentieel bereikte?" },
};

/** Copie du second hero pour une langue donnee (repli anglais). */
export function getSecondHeroCopy(lang?: string): SecondHero {
  const code = (lang || "fr").substring(0, 2).toLowerCase();
  return SECOND[code] ?? SECOND.en;
}

/** Slides tournantes pour la première tuile (produit). */
const PRODUCT_SLIDES = [heroProduct.url, heroSlideEarrings.url, heroSlideJacket.url];

/** Les 2 vidéos IA empilées + badge « AI », en ligne dans le titre. */
function AvatarStack() {
  const v2 = useRef<HTMLVideoElement>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  useEffect(() => {
    const v = v2.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const play = () => v.play().catch(() => {});
    if (v.readyState >= 2) play();
    else v.addEventListener("loadeddata", play, { once: true });
  }, []);
  useEffect(() => {
    const id = setInterval(() => setSlideIdx((i) => (i + 1) % PRODUCT_SLIDES.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className="inline-flex items-center relative select-none pointer-events-none align-middle mx-2 max-[850px]:mx-px"
      style={{ transform: "translateY(-0.08em)" }}
    >
      <span className="block w-12 h-12 max-[850px]:w-6 max-[850px]:h-6 overflow-hidden border-[3px] max-[850px]:border-2 border-black bg-gray-100 z-30 -rotate-6 rounded-[12px] max-[850px]:rounded-[6px] relative">
        {PRODUCT_SLIDES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: i === slideIdx ? 1 : 0 }}
          />
        ))}
      </span>
      <span className="block w-12 h-12 max-[850px]:w-6 max-[850px]:h-6 overflow-hidden border-[3px] max-[850px]:border-2 border-black bg-gray-100 z-20 -ml-3 max-[850px]:-ml-2 rounded-[12px] max-[850px]:rounded-[6px]">
        <video ref={v2} src={heroAvatar2.url} autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover" />
      </span>
      <span className="absolute -top-1 -right-2 z-40 bg-[#1D1D1F] text-white text-[9px] max-[850px]:text-[7px] font-semibold px-1.5 max-[850px]:px-1 py-0.5 rounded-[6px] tracking-[1px] uppercase">
        AI
      </span>
    </span>
  );
}



export function HeroRotatingTitle({
  lang = "fr",
  prefix,
  roles,
  suffix,
}: {
  lang?: string;
  prefix?: string;
  roles?: string[];
  suffix?: string;
}) {
  const code = (lang || "fr").substring(0, 2).toLowerCase();
  const loc = L[code] ?? L.en;
  const effPrefix = prefix ?? loc.prefix;
  const effMobilePrefix = loc.mobilePrefix ?? effPrefix;
  const effRoles = roles ?? loc.roles;

  // Sur mobile (<=850px), on évite les phrases trop longues qui débordent sur 2-3 lignes.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 850px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const shownRoles = useMemo(() => {
    const short = effRoles.filter((r) => r.length <= 30);
    return isMobile && short.length ? short : effRoles;
  }, [isMobile, effRoles]);
  const prefixLines = (isMobile ? effMobilePrefix : effPrefix).split("\n");

  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "deleting">("typing");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const current = shownRoles[idx % shownRoles.length] ?? "";
    if (reducedMotion) {
      setText(current);
      return;
    }
    const TYPING = 55, DELETING = 28, HOLD = 1600, GAP = 260;
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (text.length < current.length) {
        t = setTimeout(() => setText(current.slice(0, text.length + 1)), TYPING);
      } else {
        t = setTimeout(() => setPhase("deleting"), HOLD);
      }
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(current.slice(0, text.length - 1)), DELETING);
      } else {
        t = setTimeout(() => {
          setIdx((i) => (i + 1) % shownRoles.length);
          setPhase("typing");
        }, GAP);
      }
    }
    return () => clearTimeout(t);
  }, [text, phase, idx, shownRoles, reducedMotion]);

  return (
    <span>
      {prefixLines.map((line, lineIndex) => {
        const parts = line.split("{{icons}}");
        return (
          <span key={`${line}-${lineIndex}`}>
            {lineIndex > 0 ? <br /> : null}
            {parts.length > 1 ? (
              <>
                {parts[0]}
                <AvatarStack />
                {parts[1]}
              </>
            ) : (
              line
            )}
          </span>
        );
      })}{" "}
      <span style={{ fontStyle: "italic" }} aria-live="polite">
        {text}
        <span
          aria-hidden="true"
          className="inline-block align-baseline"
          style={{
            width: "0.06em",
            height: "0.9em",
            marginLeft: "0.04em",
            background: "currentColor",
            transform: "translateY(0.12em)",
            animation: "hero-rotating-caret 1s steps(2) infinite",
          }}
        />
        <style>{`@keyframes hero-rotating-caret { 50% { opacity: 0; } }`}</style>
      </span>
      {suffix ? <> {" "}{suffix}</> : null}
    </span>
  );
}

export default HeroRotatingTitle;