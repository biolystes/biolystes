import { useEffect, useState } from "react";
import { ShotExperienceModal } from "@lystes/components/shot/ShotExperienceModal";
import type { ShotExperience } from "@lystes/components/shot/shot-experience";

/**
 * Pont entre la fausse fiche produit de la page d'accueil et le vrai parcours
 * de /shot.
 *
 * La démo est un fichier statique (`public/fiche-produit-demo.html`) affiché en
 * IFRAME : son bouton « Faire un diagnostic » vit dans un autre document et ne
 * peut donc pas monter un composant React de la page parente. L'iframe envoie
 * un `postMessage`, ce composant l'écoute et ouvre <ShotExperienceModal>
 * PAR-DESSUS l'iframe, dans la page parente.
 *
 * Ouvrir la modale côté parent plutôt que dans l'iframe règle aussi la question
 * de l'appareil photo : la sélection de photo se fait dans le document
 * principal, sans dépendre d'un attribut `allow` sur l'iframe.
 */

const MESSAGE_TYPE = "lystes:experience";
const DEMO_PATH = "/fiche-produit-demo.html";
/* /accueil-v2 montre aussi la fiche Éclose du deck (public/demo-eclose/). */
const DEMO_PATHS = [DEMO_PATH, "/demo-eclose/"];

/** Un data URI d'image raisonnable pour un packshot. Au-delà, on refuse. */
const MAX_IMAGE_CHARS = 3_000_000;

interface DemoContext {
  experience: Exclude<ShotExperience, { mode: "none" }>;
  productName: string;
  productImage?: string;
  productDescription?: string;
  agent: { name: string; avatarUrl?: string; teamLabel?: string };
}

/**
 * Les deux produits de la démo sont figés dans le fichier : rien n'est scrappé,
 * donc rien à détecter. On mappe explicitement l'onglet vers l'expérience, ce
 * qui évite qu'une reformulation de la fiche fasse retomber `detectShotExperience`
 * sur { mode: "none" } et rende le bouton muet.
 */
const EXPERIENCES: Record<string, Exclude<ShotExperience, { mode: "none" }>> = {
  diagnostic: { mode: "diagnostic", diagnosticType: "skin", label: "Diagnostic peau" },
  tryon: { mode: "tryon", productType: "clothing", label: "Essayer ce vêtement" },
};

function isDemoFrame(source: MessageEventSource | null): boolean {
  if (!source) return false;
  const frames = Array.from(document.querySelectorAll<HTMLIFrameElement>("iframe"));
  return frames.some(
    (frame) => {
      const src = frame.getAttribute("src") ?? "";
      return frame.contentWindow === source && DEMO_PATHS.some((chemin) => src.startsWith(chemin));
    },
  );
}

/** N'accepte que ce qu'on sait interpréter : le reste est ignoré sans bruit. */
function parseContext(data: unknown): DemoContext | null {
  if (!data || typeof data !== "object") return null;
  const payload = data as Record<string, unknown>;
  if (payload.type !== MESSAGE_TYPE) return null;

  const experience = typeof payload.mode === "string" ? EXPERIENCES[payload.mode] : undefined;
  if (!experience) return null;

  const image = typeof payload.productImage === "string" ? payload.productImage : undefined;
  const productImage =
    image && image.startsWith("data:image/") && image.length <= MAX_IMAGE_CHARS ? image : undefined;

  return {
    experience,
    productName: typeof payload.productName === "string" ? payload.productName : "ce produit",
    productImage,
    productDescription:
      typeof payload.productDescription === "string" ? payload.productDescription : undefined,
    agent: {
      name: typeof payload.agentName === "string" ? payload.agentName : "Agent Lystes",
      avatarUrl: typeof payload.agentAvatar === "string" ? payload.agentAvatar : undefined,
      teamLabel: typeof payload.teamLabel === "string" ? payload.teamLabel : undefined,
    },
  };
}

export default function HomeDemoExperienceBridge() {
  const [context, setContext] = useState<DemoContext | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // Garde-fou : sans ce test, n'importe quel site pourrait afficher la démo
      // en iframe et piloter l'ouverture de la modale. La démo est servie depuis
      // notre propre domaine, l'origine attendue est donc la nôtre.
      if (event.origin !== window.location.origin) return;
      if (!isDemoFrame(event.source)) return;

      const parsed = parseContext(event.data);
      if (parsed) setContext(parsed);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!context) return null;

  return (
    <ShotExperienceModal
      experience={context.experience}
      productName={context.productName}
      productImageUrl={context.productImage}
      /* Pas de sourceUrl : la fiche est fictive. En passer une déclencherait un
         scrape inutile côté shot-product-chat. */
      product={{
        title: context.productName,
        description: context.productDescription ?? "",
      }}
      agent={context.agent}
      fullScreenOnMobile
      onClose={() => setContext(null)}
    />
  );
}
