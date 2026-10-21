/**
 * Registry des 4 solutions Lystes présentées dans le menu "Solutions" du header.
 * Chaque solution a la même structure de page (SolutionPageLayout).
 * L'essayage a sa propre page historique (`/`), mais elle apparait dans le menu.
 */

import essayageThumb from "@lystes/assets/coiffure-apres-v3.jpg.asset.json";
import diagnosticThumb from "@lystes/assets/showcase-peau.jpg.asset.json";
import creationThumb from "@lystes/assets/ugc-creation.jpg.asset.json";
import expertThumb from "@lystes/assets/cosmetique-domicile.png.asset.json";
import showcaseAmarsi from "@lystes/assets/showcase-amarsi.jpg.asset.json";
import showcasePeau from "@lystes/assets/showcase-peau.jpg.asset.json";
import showcase1 from "@lystes/assets/showcase-1.mp4.asset.json";
import showcase2 from "@lystes/assets/showcase-2.mp4.asset.json";
import ugcCreation from "@lystes/assets/ugc-creation.jpg.asset.json";
import chatMov from "@lystes/assets/chat.mov.asset.json";
import cosmetiqueDomicile from "@lystes/assets/cosmetique-domicile.png.asset.json";
import syncbeauty from "@lystes/assets/syncbeauty.mp4.asset.json";
import coiffureBefore from "@lystes/assets/coiffure-avant-v3.jpg.asset.json";
import coiffureAfter from "@lystes/assets/coiffure-apres-v3.jpg.asset.json";
import { BOOKING_URL } from "@lystes/config/urls";
import modeAvant from "@lystes/assets/mode-avant.png.asset.json";
import modeApres from "@lystes/assets/mode-apres.png.asset.json";
import diagnosticFace from "@lystes/features/landing-particuliers/pages/pro-offer/assets/diagnostic-face.jpg";
import distributionSlide2 from "@lystes/assets/distribution-slide-2.png.asset.json";
import type { SectorBentoData } from "./SectorBentoBlock";

export type SolutionId =
  | "programme-90j"
  | "essayage"
  | "coiffure"
  | "diagnostic"
  | "creation"
  | "ugc"
  | "evenementiel"
  | "point-de-vente"
  | "expert-produit"
  | "agents-autonomes"
  | "seo"
  | "marketing"
  | "analytics"
  | "coach-domicile"
  | "avis"
  | "journalistes"
  | "lystes-agents"
  /* Les six métiers corporate, servis à /business. Ils n'apparaissent dans
     aucun menu tant qu'on ne les écrit pas dans SolutionsDropdown : ajouter
     une entrée ici ne touche donc pas l'accueil. */
  | "standard"
  | "assistant-direction"
  | "commercial"
  | "comptable"
  | "juridique"
  | "recrutement";

export interface SolutionFeature {
  title: string;
  desc: string;
}

export interface SolutionStep {
  n: string;
  title: string;
  desc: string;
}

export interface SolutionConfig {
  id: SolutionId;
  /** URL où la solution est présentée. */
  href: string;
  /** Vignette + libellés utilisés dans le dropdown du header. */
  menu: {
    title: string;
    tagline: string;
    thumb: string;
  };
  /** Contenu de la landing page (ignoré pour essayage qui a sa propre page). */
  page: {
    kicker: string;
    title: string;
    subtitle: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    heroImage: string;
    features: SolutionFeature[];
    steps: SolutionStep[];
    sectors: SectorBentoData[];
    seo: { title: string; description: string };
  };
}

export const SOLUTIONS: Record<SolutionId, SolutionConfig> = {
  "standard": {
    id: "standard",
    href: "/solutions/standard",
    menu: { title: "Équipe IA de standard téléphonique", tagline: "Un numéro qui décroche à toute heure, qualifie et pose le rendez-vous.", thumb: "/entreprise/gallery-1.webp" },
    page: {
      kicker: "ÉQUIPE IA STANDARD TÉLÉPHONIQUE",
      title: "Le standard qui ne sonne jamais dans le vide",
      subtitle: "Un appel manqué le soir ou le samedi, c'est un client qui appelle votre concurrent. Vos agents décrochent à toute heure, comprennent la demande, la qualifient et posent le rendez-vous dans votre agenda.",
      ctaPrimary: { label: "S'inscrire gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Parler à un conseiller", href: "/contact" },
      heroImage: "/entreprise/gallery-1.webp",
      features: [
        { title: "Appels entrants, jour et nuit", desc: "Personne ne tombe sur un répondeur, ni le soir, ni le week-end." },
        { title: "Qualification", desc: "Chaque appel est compris, résumé, puis routé vers la bonne personne." },
        { title: "Prise de rendez-vous", desc: "Les créneaux libres sont proposés, le rendez-vous est posé dans votre agenda." },
        { title: "Compte rendu", desc: "Un résumé part par mail après chaque appel. Vous lisez, vous ne rappelez pas." },
      ],
      steps: [
        { n: "01", title: "Votre numéro", desc: "Un numéro dédié, ou le vôtre renvoyé vers l'agent." },
        { n: "02", title: "Votre savoir", desc: "L'agent apprend vos horaires, vos services et vos réponses habituelles." },
        { n: "03", title: "Les appels", desc: "Il décroche, comprend, qualifie et note. Vous n'êtes dérangé que si besoin." },
        { n: "04", title: "Le suivi", desc: "Rendez-vous posés, comptes rendus envoyés, historique consultable." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur entreprise",
          sectorDescription: "Un appel sur trois arrive hors des heures de bureau. Votre agent décroche quand même, comprend la demande et pose le rendez-vous, sans que personne ne soit de garde.",
          media: { kind: "image", src: "/entreprise/gallery-1.webp" },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "Un numéro qui décroche à trois heures du matin.",
          ctaCard: { heading: "Le standard qui suit le rythme de vos clients.", text: "Appels entrants, qualification, prise de rendez-vous et compte rendu : votre agent tient la ligne jour et nuit, et ne vous dérange que quand vous devez l'être.", ctaLabel: "S'inscrire gratuitement", ctaHref: "/auth?mode=signup" },
          kpi1: { label: "Appels pris", prefix: "", value: "100", suffix: " %", expl: "Des appels entrants reçus, y compris hors horaires.", src: "Mesure sur la ligne Lystes" },
          large2: {
            type: "comparison",
            heading: "Appels manqués, avant puis après.",
            text: "Les appels perdus le soir et le week-end reviennent dans le circuit, avec un compte rendu et souvent un rendez-vous.",
            axisTitle: "Appels manqués par semaine",
            pillA: "Avant l'agent, 34",
            pillB: "Avec l'agent, 0",
            axisLeft: "0",
            axisMid: "+ disponibilité",
            axisRight: "+ rendez-vous",
          },
          kpi2: { label: "Coût par appel", prefix: "−", value: "94", suffix: " %", expl: "Face à une permanence téléphonique externalisée.", src: "Repère permanences 2025" },
        },
      ],
      seo: { title: "Équipe IA de standard téléphonique pour entreprise", description: "Un agent IA qui décroche à toute heure, qualifie les appels et pose vos rendez-vous." },
    },
  },
  "assistant-direction": {
    id: "assistant-direction",
    href: "/solutions/assistant-direction",
    menu: { title: "Équipe IA d'assistants de direction", tagline: "Votre bras droit : tâches, messages, réunions, et les autres agents.", thumb: "/entreprise/gallery-2.webp" },
    page: {
      kicker: "ÉQUIPE IA ASSISTANT DE DIRECTION",
      title: "Le bras droit à qui vous écrivez, et qui exécute",
      subtitle: "Un dirigeant passe ses journées dans ses outils au lieu de son métier. Votre assistant tient votre liste de tâches, écrit vos messages, pose vos réunions et surveille les autres agents.",
      ctaPrimary: { label: "S'inscrire gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Parler à un conseiller", href: "/contact" },
      heroImage: "/entreprise/gallery-2.webp",
      features: [
        { title: "Votre liste de tâches", desc: "Il la tient, il relance, et il vous dit ce qui n'a pas avancé." },
        { title: "Vos messages", desc: "Mails et messages rédigés dans votre ton, prêts à partir." },
        { title: "Vos réunions", desc: "Créneaux trouvés, invitations envoyées, agendas synchronisés." },
        { title: "Vos agents", desc: "Il supervise les autres agents et vous remonte ce qui coince." },
      ],
      steps: [
        { n: "01", title: "Vos outils", desc: "Agenda, messagerie, documents : il s'y connecte." },
        { n: "02", title: "Vos habitudes", desc: "Il apprend votre ton, vos priorités, vos interlocuteurs." },
        { n: "03", title: "La conversation", desc: "Vous lui écrivez comme à un collègue. Il exécute." },
        { n: "04", title: "Le rapport", desc: "Un point le matin, un point le soir. Rien à ouvrir." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur entreprise",
          sectorDescription: "Le temps d'un dirigeant part en coordination, pas en décision. L'assistant reprend la coordination : il écrit, il pose, il relance, et vous rend le temps de décider.",
          media: { kind: "image", src: "/entreprise/gallery-2.webp" },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "Une équipe pilotée depuis une conversation.",
          ctaCard: { heading: "Vous écrivez une phrase, la tâche est faite.", text: "Tâches, messages, réunions, supervision des autres agents : l'assistant fait le travail de coordination qui remplit vos journées.", ctaLabel: "S'inscrire gratuitement", ctaHref: "/auth?mode=signup" },
          kpi1: { label: "Temps rendu", prefix: "", value: "11", suffix: " h", expl: "Par semaine, sur la coordination et l'administratif.", src: "Mesure sur les comptes pilotes" },
          large2: {
            type: "comparison",
            heading: "Une semaine de dirigeant, avant puis après.",
            text: "La coordination passe à l'assistant. Ce qui reste est ce que vous seul pouvez faire.",
            axisTitle: "Heures de coordination par semaine",
            pillA: "Avant l'assistant, 14",
            pillB: "Avec l'assistant, 3",
            axisLeft: "0",
            axisMid: "+ temps utile",
            axisRight: "+ décisions",
          },
          kpi2: { label: "Outils ouverts", prefix: "−", value: "8", suffix: "", expl: "Applications que vous n'ouvrez plus vous-même.", src: "Mesure sur les comptes pilotes" },
        },
      ],
      seo: { title: "Équipe IA d'assistants de direction pour entreprise", description: "Un assistant IA qui tient vos tâches, vos messages et vos réunions, et pilote vos autres agents." },
    },
  },
  "commercial": {
    id: "commercial",
    href: "/solutions/commercial",
    menu: { title: "Équipe IA de commerciaux", tagline: "Appels sortants, LinkedIn, qualification et rendez-vous posés.", thumb: "/entreprise/gallery-3.webp" },
    page: {
      kicker: "ÉQUIPE IA COMMERCIALE",
      title: "La prospection qui ne saute pas quand la semaine se remplit",
      subtitle: "Prospecter demande de la régularité, et c'est la première chose qui saute. Vos commerciaux appellent, écrivent sur LinkedIn, trient ce qui mérite votre temps et remplissent votre agenda de rendez-vous tenables.",
      ctaPrimary: { label: "S'inscrire gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Parler à un conseiller", href: "/contact" },
      heroImage: "/entreprise/gallery-3.webp",
      features: [
        { title: "Appels sortants", desc: "Les campagnes se déroulent, chaque refus et chaque signal est noté." },
        { title: "LinkedIn", desc: "Les bons interlocuteurs sont trouvés, la conversation est engagée et entretenue." },
        { title: "Qualification", desc: "Ce qui ne mérite pas votre temps est écarté, et l'agent vous dit pourquoi." },
        { title: "Rendez-vous", desc: "Posés dans votre agenda, avec le contexte de la discussion." },
      ],
      steps: [
        { n: "01", title: "Votre cible", desc: "Secteur, taille, poste : vous décrivez qui vous voulez atteindre." },
        { n: "02", title: "Votre discours", desc: "L'agent apprend votre offre, vos preuves, vos objections habituelles." },
        { n: "03", title: "La prospection", desc: "Téléphone et LinkedIn, en parallèle, tous les jours." },
        { n: "04", title: "Le rendez-vous", desc: "Vous ne voyez que les pistes qualifiées, avec leur historique." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur entreprise",
          sectorDescription: "La prospection meurt de l'irrégularité, pas du manque de talent. L'agent tient le rythme tous les jours, et vous ne récupérez que les conversations qui valent un rendez-vous.",
          media: { kind: "image", src: "/entreprise/gallery-3.webp" },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "Deux canaux menés en parallèle, tous les jours.",
          ctaCard: { heading: "Un agenda qui se remplit sans que vous y pensiez.", text: "Appels sortants, approche LinkedIn, qualification et prise de rendez-vous : la prospection avance même les semaines où vous n'avez pas une minute.", ctaLabel: "S'inscrire gratuitement", ctaHref: "/auth?mode=signup" },
          kpi1: { label: "Contacts touchés", prefix: "×", value: "6,2", suffix: "", expl: "Par semaine, face à une prospection tenue à la main.", src: "Mesure sur les comptes pilotes" },
          large2: {
            type: "comparison",
            heading: "Rendez-vous obtenus, avant puis après.",
            text: "La régularité fait la différence : le même discours, tenu tous les jours, remplit l'agenda.",
            axisTitle: "Rendez-vous qualifiés par mois",
            pillA: "Avant l'agent, 4",
            pillB: "Avec l'agent, 19",
            axisLeft: "0",
            axisMid: "+ volume",
            axisRight: "+ signatures",
          },
          kpi2: { label: "Coût par rendez-vous", prefix: "−", value: "78", suffix: " %", expl: "Face à un commercial junior à temps plein.", src: "Repère 2025" },
        },
      ],
      seo: { title: "Équipe IA de commerciaux pour entreprise", description: "Des agents IA qui prospectent par téléphone et sur LinkedIn, qualifient et posent vos rendez-vous." },
    },
  },
  "comptable": {
    id: "comptable",
    href: "/solutions/comptable",
    menu: { title: "Équipe IA de comptables", tagline: "Trésorerie, budgets et rapports, avec l'alerte avant le trou.", thumb: "/entreprise/gallery-4.webp" },
    page: {
      kicker: "ÉQUIPE IA COMPTABLE",
      title: "Voir le trou de trésorerie avant de tomber dedans",
      subtitle: "On découvre souvent un trou de trésorerie le mois où il est trop tard. Vos comptables suivent vos entrées, vos sorties et vos budgets, et vous préviennent avant.",
      ctaPrimary: { label: "S'inscrire gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Parler à un conseiller", href: "/contact" },
      heroImage: "/entreprise/gallery-4.webp",
      features: [
        { title: "Trésorerie", desc: "Entrées, sorties, solde projeté : la courbe se tient à jour toute seule." },
        { title: "Budgets", desc: "Chaque poste est suivi, les dépassements sont signalés dès qu'ils apparaissent." },
        { title: "Rapports", desc: "Un rapport mensuel part seul, lisible sans être comptable." },
        { title: "Alertes", desc: "Vous êtes prévenu avant le problème, pas au moment de le subir." },
      ],
      steps: [
        { n: "01", title: "Vos comptes", desc: "Banque et outils de facturation se connectent." },
        { n: "02", title: "Vos postes", desc: "Loyer, salaires, achats : chaque poste reçoit son budget." },
        { n: "03", title: "Le suivi", desc: "Les mouvements sont classés, la projection se recalcule chaque jour." },
        { n: "04", title: "L'alerte", desc: "Un message dès qu'un poste dérape ou que le solde projeté descend." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur entreprise",
          sectorDescription: "Une entreprise ne meurt pas d'un mauvais résultat, elle meurt d'une trésorerie vue trop tard. L'agent regarde tous les jours et parle avant.",
          media: { kind: "image", src: "/entreprise/gallery-4.webp" },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "La courbe de trésorerie, recalculée chaque jour.",
          ctaCard: { heading: "L'alerte arrive avant le problème.", text: "Entrées, sorties, budgets, rapports : votre comptable IA tient le dossier et vous prévient quand un poste dérape.", ctaLabel: "S'inscrire gratuitement", ctaHref: "/auth?mode=signup" },
          kpi1: { label: "Avance de prévenance", prefix: "", value: "34", suffix: " j", expl: "Délai moyen entre l'alerte et le creux de trésorerie.", src: "Mesure sur les comptes pilotes" },
          large2: {
            type: "comparison",
            heading: "La visibilité sur la trésorerie, avant puis après.",
            text: "Voir le creux un mois à l'avance, c'est le temps de relancer, d'étaler ou de négocier.",
            axisTitle: "Jours de visibilité sur le solde",
            pillA: "Avant l'agent, 7",
            pillB: "Avec l'agent, 90",
            axisLeft: "0",
            axisMid: "+ visibilité",
            axisRight: "+ marge de manœuvre",
          },
          kpi2: { label: "Temps sur les rapports", prefix: "−", value: "92", suffix: " %", expl: "Le rapport mensuel se produit et part seul.", src: "Mesure sur les comptes pilotes" },
        },
      ],
      seo: { title: "Équipe IA de comptables pour entreprise", description: "Des agents IA qui suivent votre trésorerie, vos budgets et produisent vos rapports mensuels." },
    },
  },
  "juridique": {
    id: "juridique",
    href: "/solutions/juridique",
    menu: { title: "Équipe IA de juristes", tagline: "Contrats, conditions de vente et conformité, sans rendez-vous.", thumb: "/entreprise/gallery-5.webp" },
    page: {
      kicker: "ÉQUIPE IA JURIDIQUE",
      title: "Le contrat relu, sans attendre une semaine",
      subtitle: "Un contrat relu par un avocat coûte cher et prend une semaine ; sans relecture, il coûte plus cher encore. Vos juristes rédigent vos contrats et vos conditions de vente, vérifient votre conformité et répondent sans rendez-vous.",
      ctaPrimary: { label: "S'inscrire gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Parler à un conseiller", href: "/contact" },
      heroImage: "/entreprise/gallery-5.webp",
      features: [
        { title: "Contrats", desc: "Rédigés à partir de votre situation, pas d'un modèle trouvé en ligne." },
        { title: "Conditions de vente", desc: "Écrites pour votre activité, et tenues à jour." },
        { title: "Conformité", desc: "Vos traitements de données sont passés en revue, les manques sont listés." },
        { title: "Réponses", desc: "Une question juridique trouve sa réponse tout de suite, avec ses sources." },
      ],
      steps: [
        { n: "01", title: "Votre activité", desc: "Ce que vous vendez, à qui, dans quels pays." },
        { n: "02", title: "Vos documents", desc: "Contrats et conditions existants sont lus et évalués." },
        { n: "03", title: "La rédaction", desc: "Les documents manquants sont écrits, les autres corrigés." },
        { n: "04", title: "La veille", desc: "Un changement de règlement déclenche une revue de vos documents." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur entreprise",
          sectorDescription: "Le risque juridique d'une petite structure ne vient pas d'un procès, il vient d'un document jamais écrit. L'agent écrit ces documents et les tient à jour.",
          media: { kind: "image", src: "/entreprise/gallery-5.webp" },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "Un contrat écrit pour votre cas, pas un modèle.",
          ctaCard: { heading: "La réponse juridique, sans prendre rendez-vous.", text: "Contrats, conditions de vente, conformité : vos documents existent, sont à jour, et vous savez pourquoi chaque clause est là.", ctaLabel: "S'inscrire gratuitement", ctaHref: "/auth?mode=signup" },
          kpi1: { label: "Délai de rédaction", prefix: "", value: "12", suffix: " min", expl: "Pour un contrat complet, contre plusieurs jours.", src: "Mesure sur les comptes pilotes" },
          large2: {
            type: "comparison",
            heading: "Le coût des documents juridiques, avant puis après.",
            text: "Les documents courants sortent en interne. Le conseil rare reste chez votre avocat, là où il vaut son prix.",
            axisTitle: "Coût annuel des documents courants",
            pillA: "Avant l'agent, 4 800 €",
            pillB: "Avec l'agent, 540 €",
            axisLeft: "0",
            axisMid: "+ documents",
            axisRight: "+ tranquillité",
          },
          kpi2: { label: "Documents à jour", prefix: "", value: "100", suffix: " %", expl: "Une évolution du règlement déclenche la revue.", src: "Mesure sur les comptes pilotes" },
        },
      ],
      seo: { title: "Équipe IA de juristes pour entreprise", description: "Des agents IA qui rédigent vos contrats et conditions de vente et vérifient votre conformité." },
    },
  },
  "recrutement": {
    id: "recrutement",
    href: "/solutions/recrutement",
    menu: { title: "Équipe IA de recruteurs", tagline: "L'offre écrite et diffusée, les CV lus, une liste courte argumentée.", thumb: "/entreprise/hero-poster.webp" },
    page: {
      kicker: "ÉQUIPE IA RECRUTEMENT",
      title: "La liste courte, le jour même",
      subtitle: "Trier deux cents CV prend deux jours, et c'est souvent le meilleur candidat qui part entre-temps. Vos recruteurs écrivent l'offre, la diffusent, lisent tout et vous remontent une liste courte, argumentée.",
      ctaPrimary: { label: "S'inscrire gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Parler à un conseiller", href: "/contact" },
      heroImage: "/entreprise/hero-poster.webp",
      features: [
        { title: "L'offre", desc: "Écrite à partir du poste réel, pas d'un intitulé générique." },
        { title: "La diffusion", desc: "Publiée là où vos candidats cherchent." },
        { title: "Le tri", desc: "Toutes les candidatures sont lues, aucune n'est écartée sur un mot-clé." },
        { title: "La liste courte", desc: "Les candidats retenus, classés, avec la raison de chaque choix." },
      ],
      steps: [
        { n: "01", title: "Le poste", desc: "Missions, contraintes, ce qui compte vraiment." },
        { n: "02", title: "L'offre", desc: "Rédigée, relue, publiée." },
        { n: "03", title: "Le tri", desc: "Chaque candidature est lue et notée sur vos critères." },
        { n: "04", title: "L'entretien", desc: "Vous recevez la liste courte et les créneaux posés." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur entreprise",
          sectorDescription: "Le bon candidat répond à plusieurs offres. Celui qui rappelle le premier le rencontre. L'agent lit tout le jour même, et vous rappelez avant les autres.",
          media: { kind: "image", src: "/entreprise/hero-poster.webp" },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "Deux cents candidatures lues le jour même.",
          ctaCard: { heading: "Rappeler avant les autres, tous les jours.", text: "Offre, diffusion, tri, liste courte : le recrutement avance à la vitesse des candidats, pas à celle de votre semaine.", ctaLabel: "S'inscrire gratuitement", ctaHref: "/auth?mode=signup" },
          kpi1: { label: "Délai de tri", prefix: "", value: "1", suffix: " j", expl: "Entre la fin de la diffusion et la liste courte.", src: "Mesure sur les comptes pilotes" },
          large2: {
            type: "comparison",
            heading: "Le délai avant le premier entretien, avant puis après.",
            text: "Rappeler dans la journée change qui accepte l'entretien, et qui a déjà signé ailleurs.",
            axisTitle: "Jours avant le premier entretien",
            pillA: "Avant l'agent, 12",
            pillB: "Avec l'agent, 2",
            axisLeft: "0",
            axisMid: "+ réactivité",
            axisRight: "+ candidats retenus",
          },
          kpi2: { label: "Candidatures lues", prefix: "", value: "100", suffix: " %", expl: "Aucune candidature écartée sur un simple mot-clé.", src: "Mesure sur les comptes pilotes" },
        },
      ],
      seo: { title: "Équipe IA de recruteurs pour entreprise", description: "Des agents IA qui rédigent votre offre, trient les CV et vous remontent une liste courte argumentée." },
    },
  },
  "programme-90j": {
    id: "programme-90j",
    href: "/programme",
    menu: {
      title: "Programme 90 jours",
      tagline: "Cure affiliée · cure de 199 € que vos créatrices vendent pour vous.",
      thumb: diagnosticThumb.url,
    },
    page: {
      kicker: "PROGRAMME 90 JOURS",
      title: "Une cure de 90 jours propulsée par un programme d'affiliation",
      subtitle:
        "Plateforme d'affiliation, page de promotion dédiée par créatrice, suivi de cure, diagnostic IA, coach IA, plans nutrition — et options presse & crédibilité social pour saturer l'acquisition.",
      ctaPrimary: { label: "Voir le modèle 90 jours", href: "/programme" },
      ctaSecondary: { label: "Prendre rendez-vous", href: BOOKING_URL },
      heroImage: diagnosticThumb.url,
      features: [
        { title: "Plateforme d'affiliation", desc: "Recrutez et rémunérez vos créatrices sur la cure 90 jours." },
        { title: "Page promo par créatrice", desc: "Ex. cure.lystes.ai/programme/glowlyparis — landing dédiée." },
        { title: "Suivi de cure", desc: "Check-ins, plan nutrition, coach IA et contre-indications." },
        { title: "Diagnostic + Assistant IA", desc: "Diagnostic spécifique à la cure, assistant conversationnel 24/7." },
      ],
      steps: [
        { n: "01", title: "Créatrice recrutée", desc: "Elle rejoint le programme et récupère son lien." },
        { n: "02", title: "Landing personnalisée", desc: "Sa page cure.lystes.ai/programme/<nom> est prête." },
        { n: "03", title: "Cliente en cure", desc: "Diagnostic, plan nutrition, coach IA, check-ins 90 jours." },
        { n: "04", title: "Commission", desc: "La créatrice touche sa part sur chaque cure vendue." },
      ],
      sectors: [],
      seo: {
        title: "Programme 90 jours — Cure cosmétique affiliée — Lystes",
        description:
          "Le modèle 90 jours : cure à 199 €, marge x7, plateforme d'affiliation, suivi IA et options presse pour créer une marque cosmétique rentable.",
      },
    },
  },
  essayage: {
    id: "essayage",
    href: "/solutions/essayage",
    menu: {
      title: "Équipe IA d'essayage virtuel",
      tagline: "Vos clients essayent vos produits avant d'acheter.",
      thumb: essayageThumb.url,
    },
    page: {
      kicker: "ASSISTANT SHOPPING IA",
      title: "Permettez à vos clients d'essayer vos produits avant d'acheter",
      subtitle:
        "Perruques, lunettes, vêtements, maquillage… L'essayage virtuel qui convertit en achat.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Voir une démo", href: "#demo" },
      heroImage: essayageThumb.url,
      features: [],
      steps: [],
      sectors: [],
      seo: {
        title: "Essayage virtuel IA — Lystes",
        description: "Permettez à vos clients d'essayer vos produits en ligne avant l'achat.",
      },
    },
  },
  diagnostic: {
    id: "diagnostic",
    href: "/solutions/diagnostic",
    menu: {
      title: "Équipe IA de diagnostic beauté",
      tagline: "Analysez peau, cheveux, style — recommandez les bons produits.",
      thumb: diagnosticThumb.url,
    },
    page: {
      kicker: "DIAGNOSTIC IA",
      title: "Un diagnostic personnalisé qui recommande le bon produit",
      subtitle:
        "Peau, cheveux, cuir chevelu, style, colorimétrie… L'IA analyse en 30 secondes et guide chaque client vers la routine ou le produit qui lui correspond.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Essayer le diagnostic", href: "/p" },
      heroImage: diagnosticThumb.url,
      features: [
        { title: "20+ types de diagnostics", desc: "Peau, cheveux, dents, ongles, barbe, cils, sourcils, style…" },
        { title: "Recommandations produits", desc: "L'IA pousse automatiquement les produits de VOTRE catalogue." },
        { title: "Rapports détaillés", desc: "Chaque client reçoit un rapport visuel de son diagnostic." },
        { title: "Multi-langues", desc: "14 langues supportées, adaptées à chaque marché." },
      ],
      steps: [
        { n: "01", title: "Photo ou questionnaire", desc: "Le client répond en 30 secondes depuis son téléphone." },
        { n: "02", title: "Analyse IA", desc: "Détection biométrique + scoring pondéré." },
        { n: "03", title: "Recommandations", desc: "Produits de votre catalogue matchés au diagnostic." },
        { n: "04", title: "Conversion", desc: "Ajout panier ou prise de RDV en un clic." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur cosmétique",
          sectorDescription:
            "Vos clientes analysent leur peau ou leurs cheveux depuis leur téléphone. L'IA détecte les zones à travailler et pousse la routine adaptée dans votre catalogue.",
          media: { kind: "image", src: showcasePeau.url },
          mediaBadge: "CLIENT",
          mediaTitle: "Diagnostic peau : de la photo à la routine complète en 30 secondes.",
          mediaLink: { label: "CLEA.CO", href: "/p" },
          ctaCard: {
            heading: "Un diagnostic IA qui transforme un scroll en achat.",
            text: "Grain de peau, hydratation, pigmentation, pores… l'analyse est aussi précise qu'en cabinet — et débouche directement sur les bons produits.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Repère cosmétique",
            prefix: "×",
            value: "3,2",
            suffix: "*",
            expl: "De taux d'ajout panier après un diagnostic, vs une page produit classique.",
            src: "* Comparatif marques cosmétiques 2024",
          },
          large2: {
            type: "comparison",
            heading: "Une reco par cliente, pas une page produit générique.",
            text: "Chaque diagnostic isole les 3 produits vraiment adaptés au type de peau détecté. Fini les paniers construits au hasard.",
            axisTitle: "Panier moyen",
            pillA: "Sans diagnostic · 48 €",
            pillB: "Avec diagnostic · 87 €",
            axisLeft: "0 €",
            axisMid: "+ engagement",
            axisRight: "+ panier",
          },
          kpi2: {
            label: "Fidélisation",
            prefix: "+",
            value: "54",
            suffix: "%",
            expl: "De réachat sur 90 jours après un premier diagnostic — les clientes reviennent quand la routine marche.",
            src: "Cohorte 3 mois, marques partenaires",
          },
        },
        {
          sectorTitle: "Secteur coiffure & barbershop",
          sectorDescription:
            "Cuir chevelu, chute, casse, densité : le diagnostic pré-shampoing oriente vers le bon soin, le bon rituel, le bon rendez-vous.",
          media: { kind: "video", src: showcase1.url },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "Diagnostic cuir chevelu : le vendeur invisible de votre gamme capillaire.",
          ctaCard: {
            heading: "Le bon soin capillaire pour chaque type de cheveu.",
            text: "L'agent pose 4 questions clés, analyse la photo et pousse le shampoing, sérum ou masque de votre gamme réellement adapté.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Prescriptions IA",
            prefix: "×",
            value: "4,7",
            suffix: "*",
            expl: "De produits capillaires vendus par visite quand un diagnostic précède la reco.",
            src: "* Marques capillaires D2C, 2024",
          },
          large2: {
            type: "before-after",
            heading: "Avant / après : la preuve qui rassure et convertit.",
            text: "Chaque diagnostic archive l'état initial et la progression. Vos clientes visualisent le résultat et reviennent avec la même routine — vous, vous récupérez une base de cas concrets.",
            beforeImg: coiffureBefore.url,
            afterImg: coiffureAfter.url,
            beforeLabel: "Semaine 0",
            afterLabel: "Semaine 8",
          },
          kpi2: {
            label: "Réservation salon",
            prefix: "×",
            value: "2,1",
            suffix: "*",
            expl: "De RDV pris à la suite d'un diagnostic online — le client arrive déjà pré-qualifié.",
            src: "* Salons partenaires 2024",
          },
        },
      ],
      seo: {
        title: "Diagnostic IA peau & cheveux — Lystes",
        description: "Diagnostic IA personnalisé qui recommande les produits de votre catalogue.",
      },
    },
  },
  creation: {
    id: "creation",
    href: "/solutions/creation",
    menu: {
      title: "Équipe IA de photographes",
      tagline: "Photos, ads, UGC, mockups — générés à la chaîne.",
      thumb: creationThumb.url,
    },
    page: {
      kicker: "CREATIVE STUDIO",
      title: "Générez photos, ads, UGC et mockups en quelques clics",
      subtitle:
        "Un studio créatif complet propulsé par l'IA : shooting produit, publicités, contenus UGC, mockups… Sans photographe, sans studio, sans agence.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Essayer le studio", href: "/creator" },
      heroImage: creationThumb.url,
      features: [
        { title: "Studio photo IA", desc: "Vos produits shootés dans n'importe quel décor, en quelques secondes." },
        { title: "Ads Creator", desc: "Publicités prêtes à diffuser pour Meta, TikTok, Google." },
        { title: "UGC Library", desc: "Créateurs virtuels qui présentent vos produits en vidéo." },
        { title: "Mockups infinis", desc: "Packaging, t-shirts, écrans, print… tous les mockups d'un clic." },
      ],
      steps: [
        { n: "01", title: "Uploadez un produit", desc: "Une simple photo suffit." },
        { n: "02", title: "Choisissez un style", desc: "Décor, ambiance, format, avatar UGC." },
        { n: "03", title: "L'IA génère", desc: "Photos, vidéos, mockups en batch." },
        { n: "04", title: "Publiez", desc: "Export direct vers vos réseaux ou votre e-commerce." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur e-commerce",
          sectorDescription:
            "Fini les shootings à 3000 € par gamme. Vos produits sont photographiés dans n'importe quel décor, avec n'importe quel modèle, en quelques minutes.",
          media: { kind: "image", src: ugcCreation.url },
          mediaBadge: "STUDIO PHOTO",
          mediaTitle: "Un catalogue entier shooté sans réserver de studio.",
          ctaCard: {
            heading: "Des visuels premium, générés à l'échelle.",
            text: "Uploadez un packshot, choisissez le décor et l'ambiance — vous récupérez 20 visuels prêts pour votre site, vos ads et vos réseaux.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Repère e-commerce",
            prefix: "×",
            value: "12",
            suffix: "*",
            expl: "De visuels produits générés par mois, à budget photo constant.",
            src: "* Marques D2C comparaison agence vs Lystes",
          },
          large2: {
            type: "comparison",
            heading: "Un shooting agence vs Lystes.",
            text: "Le studio IA délivre la même qualité perçue qu'un shooting professionnel, sans logistique, sans modèle, sans réservation.",
            axisTitle: "Coût par visuel",
            pillA: "Agence photo · 180 €",
            pillB: "Studio Lystes · 4 €",
            axisLeft: "0 €",
            axisMid: "+ volume",
            axisRight: "+ marge",
          },
          kpi2: {
            label: "Time to market",
            prefix: "−",
            value: "92",
            suffix: "%",
            expl: "De délai entre l'idée et le visuel prêt à publier — vous suivez le rythme des tendances.",
            src: "Bench marques mode & beauté",
          },
        },
        {
          sectorTitle: "Secteur agences & marketing",
          sectorDescription:
            "Ads Meta, TikTok, Google, UGC créateurs virtuels : produisez 100 variantes de chaque angle en quelques clics et laissez l'algo trouver le winner.",
          media: { kind: "facemesh", src: diagnosticFace },
          mediaBadge: "ADS CREATOR",
          mediaTitle: "100 variantes d'ads sans jamais briefer un designer.",
          ctaCard: {
            heading: "Le studio créatif de vos performances media.",
            text: "Formats verticaux, carrés, statique, animé, avec ou sans texte — l'IA décline vos angles en batch pour saturer l'apprentissage des algos.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Repère media buying",
            prefix: "×",
            value: "8,4",
            suffix: "*",
            expl: "De créatives testées par campagne — la fatigue publicitaire disparait.",
            src: "* Agences media partenaires 2024",
          },
          large2: {
            type: "comparison",
            heading: "Le CPM baisse quand la créativité suit.",
            text: "Injecter 30 variantes d'un même angle divise le coût pour mille impressions : Meta et TikTok récompensent les comptes qui alimentent l'algorithme.",
            axisTitle: "CPM moyen",
            pillA: "Sans variantes · 14,20 €",
            pillB: "Avec variantes · 6,80 €",
            axisLeft: "0 €",
            axisMid: "+ créativité",
            axisRight: "+ ROAS",
          },
          kpi2: {
            label: "ROAS",
            prefix: "×",
            value: "2,3",
            suffix: "*",
            expl: "De retour sur dépense pub après switch vers un pipeline créatif IA.",
            src: "* Comparatif 6 mois, e-commerçants D2C",
          },
        },
      ],
      seo: {
        title: "Création de contenu IA — Studio Photo, Ads & UGC — Lystes",
        description: "Générez photos produit, publicités et vidéos UGC à la chaîne avec l'IA.",
      },
    },
  },
  ugc: {
    id: "ugc",
    href: "/solutions/ugc",
    menu: {
      title: "Équipe IA UGC",
      tagline: "Créateurs virtuels et vidéos UGC générés à la chaîne.",
      thumb: ugcCreation.url,
    },
    page: {
      kicker: "UGC CREATOR",
      title: "Générez du contenu UGC avec des créateurs virtuels IA",
      subtitle:
        "Des vidéos et visuels UGC réalistes, générés à la chaîne pour Meta, TikTok et votre e-commerce — sans casting, sans tournage.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Essayer le studio", href: "/creator" },
      heroImage: ugcCreation.url,
      features: [
        { title: "Créateurs virtuels", desc: "Des avatars réalistes qui présentent vos produits en vidéo." },
        { title: "Formats réseaux", desc: "Vertical, carré, paysage — prêts pour Meta, TikTok, Google." },
        { title: "Génération batch", desc: "Produisez des dizaines de variantes en quelques clics." },
        { title: "Coût contrôlé", desc: "Zéro tournage, zéro agence, zéro négociation d'influenceur." },
      ],
      steps: [
        { n: "01", title: "Uploadez un produit", desc: "Une simple photo suffit." },
        { n: "02", title: "Choisissez un créateur", desc: "Avatar, style, format, script." },
        { n: "03", title: "L'IA génère", desc: "Vidéos UGC en batch." },
        { n: "04", title: "Publiez", desc: "Export direct vers vos campagnes et réseaux." },
      ],
      sectors: [],
      seo: {
        title: "Équipe IA UGC — Créateurs virtuels & vidéos — Lystes",
        description: "Générez du contenu UGC à la chaîne avec des créateurs virtuels IA.",
      },
    },
  },
  evenementiel: {
    id: "evenementiel",
    href: "/solutions/evenementiel",
    menu: {
      title: "Équipe IA événementiel",
      tagline: "Activations live, stands connectés, expériences immersives.",
      thumb: creationThumb.url,
    },
    page: {
      kicker: "ÉQUIPE IA ÉVÉNEMENTIEL",
      title: "Prolongez vos événements avec des équipes IA",
      subtitle:
        "Activations live, stands connectés, expériences immersives : chaque visiteur repart avec un assistant IA qui se souvient de lui.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Prendre rendez-vous", href: BOOKING_URL },
      heroImage: creationThumb.url,
      features: [],
      steps: [],
      sectors: [
        {
          sectorTitle: "Équipe IA événementiel",
          sectorDescription:
            "Activations live, stands connectés, expériences immersives : vos agents IA prolongent l'événement bien au-delà de la soirée et transforment chaque visiteur en contact qualifié.",
          media: { kind: "video", src: syncbeauty.url },
          mediaBadge: "CLIENT",
          mediaTitle: "Et si vos événements étaient connectés à des agents IA ?",
          mediaLink: { label: "SEVMYLOOK.COM", href: "https://sevmylook.com/" },
          ctaCard: {
            heading: "Rendez vos events plus innovants avec des agents IA qui interagissent avec vos invités.",
            text: "Chaque invité repart avec un assistant qui se souvient de lui : ses préférences, son diagnostic, ses essais. Vous capitalisez sur l'émotion du moment pour nourrir la relation longtemps après.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Repère event",
            prefix: "×",
            value: "6,2",
            suffix: "*",
            expl: "De leads qualifiés collectés vs un stand classique sans agent IA conversationnel.",
            src: "* Mesure activations 2024-2025",
          },
          large2: {
            type: "comparison",
            heading: "De la data précieuse, captée à chaud sur l'événement.",
            text: "Vous récupérez les préférences, diagnostics et essais de chaque invité au moment où son intérêt est au pic. De quoi nourrir vos campagnes post-événement avec des contacts vraiment qualifiés, pas une simple liste d'emails.",
            axisTitle: "Visiteur → contact qualifié",
            pillA: "Stand classique · 4 %",
            pillB: "Avec agent IA · 31 %",
            axisLeft: "0 %",
            axisMid: "+ engagement",
            axisRight: "+ leads",
          },
          kpi2: {
            label: "Rétention",
            prefix: "+",
            value: "48",
            suffix: "%",
            expl: "Des invités reprennent contact dans les 30 jours via l'agent IA reçu sur place.",
            src: "L'événement continue après la soirée",
          },
        },
      ],
      seo: {
        title: "Équipe IA événementiel — Activations & stands connectés — Lystes",
        description:
          "Des équipes IA qui prolongent vos événements et transforment chaque visiteur en contact qualifié.",
      },
    },
  },
  "point-de-vente": {
    id: "point-de-vente",
    href: "/solutions/point-de-vente",
    menu: {
      title: "Équipe IA point de vente",
      tagline: "Un vendeur IA derrière chaque produit, en rayon comme à domicile.",
      thumb: cosmetiqueDomicile.url,
    },
    page: {
      kicker: "ÉQUIPE IA POINT DE VENTE",
      title: "Vos produits prennent la parole en magasin",
      subtitle:
        "En magasin, sur les corners et les pop-up stores : chaque produit devient un vendeur IA disponible 24h/24. Le client scanne, questionne, compare — et repart conseillé, même quand vos équipes sont ailleurs.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Prendre rendez-vous", href: BOOKING_URL },
      heroImage: cosmetiqueDomicile.url,
      features: [],
      steps: [],
      sectors: [
        {
          sectorTitle: "Équipe IA point de vente",
          sectorDescription:
            "En magasin, sur les corners et les pop-up stores : chaque produit devient un vendeur IA disponible 24h/24. Le client scanne, questionne, compare — et repart conseillé, même quand vos équipes sont ailleurs.",
          media: { kind: "image", src: distributionSlide2.url },
          mediaTitle: "Vendeur IA en point de vente scannant un produit",
          ctaCard: {
            heading: "Un vendeur IA derrière chaque référence, dans chaque rayon.",
            text: "Vos produits en rayon prennent la parole. L'agent IA connaît la gamme, argumente, oriente vers la bonne référence et rassure sur les alternatives. Vos équipes se concentrent sur la vente à forte valeur.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Repère retail",
            prefix: "×",
            value: "3,4",
            suffix: "",
            expl: "De taux de conversion en rayon lorsqu'un agent IA répond en temps réel aux questions produit.",
            src: "vs rayon sans assistance conversationnelle",
          },
          large2: {
            type: "comparison",
            heading: "La data terrain qui manquait à vos équipes retail.",
            text: "Chaque conversation en point de vente remonte : questions récurrentes, freins à l'achat, produits comparés. Vous ajustez merchandising, formation et assortiment sur des signaux réels — pas sur des intuitions.",
            axisTitle: "Questions traitées",
            pillA: "Équipe seule · 41 %",
            pillB: "Avec agent IA · 93 %",
            axisLeft: "0 %",
            axisMid: "+ couverture",
            axisRight: "+ ventes",
          },
          kpi2: {
            label: "Autonomie",
            prefix: "+",
            value: "68",
            suffix: "%",
            expl: "Des clients trouvent seuls la référence adaptée grâce à l'agent IA en rayon.",
            src: "Zéro attente, zéro produit manqué",
          },
        },
      ],
      seo: {
        title: "Équipe IA point de vente — Vendeurs IA en magasin — Lystes",
        description:
          "Des équipes IA qui prennent la parole en rayon et font remonter les insights terrain.",
      },
    },
  },
  "expert-produit": {
    id: "expert-produit",
    href: "/solutions/expert-produit",
    menu: {
      title: "Équipe IA de conseillers produit",
      tagline: "Un conseiller IA qui répond, qualifie et vend 24/7.",
      thumb: expertThumb.url,
    },
    page: {
      kicker: "AGENT EXPERT PRODUIT",
      title: "Un conseiller IA qui connait votre catalogue par cœur",
      subtitle:
        "Il répond aux questions techniques, qualifie les besoins, oriente vers le bon produit et convertit — sur votre site, WhatsApp, email et réseaux sociaux.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Voir un exemple", href: "/" },
      heroImage: expertThumb.url,
      features: [
        { title: "Formé sur VOS produits", desc: "Import automatique catalogue Shopify, WooCommerce, CSV." },
        { title: "Multi-canal", desc: "Site, WhatsApp, Instagram, Email — un seul agent partout." },
        { title: "Qualifie les leads", desc: "Détecte l'intention d'achat et pousse au bon moment." },
        { title: "Transfert humain", desc: "Escalade vers votre équipe quand c'est nécessaire." },
      ],
      steps: [
        { n: "01", title: "Import catalogue", desc: "Connectez votre e-commerce en 1 clic." },
        { n: "02", title: "Personnalisation", desc: "Ton, langue, expertise, positionnement." },
        { n: "03", title: "Déploiement", desc: "Widget site + WhatsApp + Instagram en simultané." },
        { n: "04", title: "Vente", desc: "Il conseille, qualifie et pousse à l'achat 24/7." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur de la distribution",
          sectorDescription:
            "En rayon comme à domicile, vos produits prennent la parole : chaque référence devient un agent IA capable d'expliquer ses bénéfices, d'orienter le choix et d'accompagner l'utilisation après l'achat.",
          media: { kind: "image", src: cosmetiqueDomicile.url },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "Un QR code sur le packaging, un vendeur IA derrière.",
          ctaCard: {
            heading: "Laissez vos produits convaincre vos clients en rayon.",
            text: "Un QR code sur le packaging, et chaque produit répond aux questions de vos clients comme le ferait votre meilleur vendeur — sans mobiliser un seul collaborateur en magasin.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Repère rayon",
            prefix: "×",
            value: "4,1",
            suffix: "*",
            expl: "De scans QR transformés en conversation produit, vs un simple lien vers une fiche web.",
            src: "* Comparatif scan QR → fiche statique",
          },
          large2: {
            type: "comparison",
            heading: "De la data réelle, avant et après l'achat.",
            text: "Vous comprenez enfin ce qui motive ou freine vos clients avant l'achat, puis comment ils utilisent réellement vos produits à domicile. De quoi affiner vos fiches, votre merchandising et vos prochaines gammes.",
            axisTitle: "Mise au panier",
            pillA: "Sans l'IA · 3,02 %",
            pillB: "Avec l'IA · 6,76 %",
            axisLeft: "0 %",
            axisMid: "+ engagement",
            axisRight: "+ ventes",
          },
          kpi2: {
            label: "Sans vendeur",
            prefix: "+",
            value: "72",
            suffix: "%",
            expl: "Des questions clients en rayon traitées par l'agent IA, sans mobiliser un collaborateur.",
            src: "Vos équipes se concentrent sur la vente",
          },
        },
        {
          sectorTitle: "Secteur événementiel",
          sectorDescription:
            "Activations live, stands connectés, expériences immersives : vos agents IA prolongent l'événement bien au-delà de la soirée et transforment chaque visiteur en contact qualifié.",
          media: { kind: "video", src: syncbeauty.url },
          mediaBadge: "CLIENT",
          mediaTitle: "Et si vos événements étaient connectés à des agents IA ?",
          mediaLink: { label: "SEVMYLOOK.COM", href: "https://sevmylook.com/" },
          ctaCard: {
            heading: "Des événements connectés à des agents IA sur mesure.",
            text: "Chaque invité repart avec un assistant qui se souvient de lui : ses préférences, son diagnostic, ses essais. Vous capitalisez sur l'émotion du moment pour nourrir la relation longtemps après.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Repère event",
            prefix: "×",
            value: "6,2",
            suffix: "*",
            expl: "De leads qualifiés collectés vs un stand classique sans agent IA conversationnel.",
            src: "* Mesure activations 2024-2025",
          },
          large2: {
            type: "comparison",
            heading: "De la data précieuse, captée à chaud sur l'événement.",
            text: "Vous récupérez les préférences, diagnostics et essais de chaque invité au moment où son intérêt est au pic. De quoi nourrir vos campagnes post-événement avec des contacts vraiment qualifiés, pas une simple liste d'emails.",
            axisTitle: "Visiteur → contact qualifié",
            pillA: "Stand classique · 4 %",
            pillB: "Avec agent IA · 31 %",
            axisLeft: "0 %",
            axisMid: "+ engagement",
            axisRight: "+ leads",
          },
          kpi2: {
            label: "Rétention",
            prefix: "+",
            value: "48",
            suffix: "%",
            expl: "Des invités reprennent contact dans les 30 jours via l'agent IA reçu sur place.",
            src: "L'événement continue après la soirée",
          },
        },
      ],
      seo: {
        title: "Agent conseiller produit IA — Lystes",
        description: "Un agent IA formé sur votre catalogue qui conseille et vend 24/7.",
      },
    },
  },
  coiffure: {
    id: "coiffure",
    href: "/solutions/coiffure",
    menu: {
      title: "Essayage coiffure",
      tagline: "Coupes, couleurs, perruques testées en live avant l'achat ou le RDV.",
      thumb: coiffureAfter.url,
    },
    page: {
      kicker: "ESSAYAGE COIFFURE IA",
      title: "Vos clientes essayent une coupe ou une couleur avant de réserver",
      subtitle:
        "Perruques, extensions, coupes, colorations… L'essayage capillaire IA convertit les hésitations en réservations et en achats.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Voir une démo", href: "/" },
      heroImage: coiffureAfter.url,
      features: [
        { title: "Coupe & coloration", desc: "Simulation photo-réaliste sur selfie ou photo importée." },
        { title: "Perruques & extensions", desc: "Catalogue essayable en temps réel." },
        { title: "Salons connectés", desc: "Réservation directe depuis l'essai virtuel." },
        { title: "Avant / après", desc: "Comparateur visuel qui rassure et convertit." },
      ],
      steps: [
        { n: "01", title: "Photo cliente", desc: "Un selfie suffit." },
        { n: "02", title: "Choix du style", desc: "Coupe, couleur ou perruque du catalogue." },
        { n: "03", title: "Rendu IA", desc: "Résultat photo-réaliste en quelques secondes." },
        { n: "04", title: "Conversion", desc: "Achat ou prise de RDV en un clic." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur salons & barbershops",
          sectorDescription:
            "Vos clientes essaient une coupe, une couleur ou une perruque depuis leur téléphone avant même de pousser la porte du salon.",
          media: { kind: "image", src: coiffureAfter.url },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "Un selfie, dix coupes testées, un RDV pris.",
          ctaCard: {
            heading: "L'essayage capillaire qui remplit l'agenda.",
            text: "Chaque cliente visualise le rendu avant de réserver — vos coiffeurs reçoivent des RDV déjà pré-qualifiés, avec la coupe et la couleur attendues.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Repère salon",
            prefix: "×",
            value: "3,4",
            suffix: "*",
            expl: "De RDV pris quand la cliente a pu tester le rendu avant de réserver.",
            src: "* Salons partenaires 2024",
          },
          large2: {
            type: "before-after",
            heading: "Avant / après : la preuve visuelle qui convertit.",
            text: "Le comparateur photo balaie les hésitations et transforme la curiosité en achat ou en réservation.",
            beforeImg: coiffureBefore.url,
            afterImg: coiffureAfter.url,
            beforeLabel: "Avant",
            afterLabel: "Après essayage IA",
          },
          kpi2: {
            label: "Panier moyen",
            prefix: "+",
            value: "38",
            suffix: "%",
            expl: "De prestations additionnelles vendues quand la cliente visualise le résultat final.",
            src: "Salons Lystes 2024",
          },
        },
      ],
      seo: {
        title: "Essayage coiffure IA — Perruques, coupes & couleurs — Lystes",
        description: "Essayage virtuel de coupes, colorations et perruques pour salons et marques capillaires.",
      },
    },
  },
  "agents-autonomes": {
    id: "agents-autonomes",
    href: "/solutions/agents-autonomes",
    menu: {
      title: "Équipe IA autonome",
      tagline: "Une équipe d'agents IA qui pilote votre e-commerce 24/7.",
      thumb: showcaseAmarsi.url,
    },
    page: {
      kicker: "Équipe A autonome",
      title: "12 produits = 63 agents dédiés + 1 Copilote pour booster vos ventes",
      subtitle:
        "Chaque produit de votre catalogue génère automatiquement des agents spécialisés en conversion, création de contenu, marketing et analytics.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Pourquoi Lystes\u00a0", href: "/pourquoi" },
      heroImage: showcaseAmarsi.url,
      features: [
        { title: "Copilote 360°", desc: "Un directeur général IA qui orchestre toute l'équipe." },
        { title: "4 directions", desc: "Conversion, créative, marketing, analytics — chaque pôle a son directeur." },
        { title: "Managers spécialisés", desc: "UGC, photo, design, SEO, email, ads, analytics…" },
        { title: "Scaling automatique", desc: "De 4 à 2 000 produits, l'équipe grandit avec votre catalogue." },
      ],
      steps: [
        { n: "01", title: "Import catalogue", desc: "Shopify, WooCommerce, CSV — 1 clic." },
        { n: "02", title: "Génération d'équipe", desc: "L'IA crée automatiquement vos agents et managers." },
        { n: "03", title: "Orchestration", desc: "Le Copilote coordonne conversion, créa, marketing, analytics." },
        { n: "04", title: "Reporting", desc: "Un dashboard unique pour piloter toute l'équipe." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur e-commerce mode & beauté",
          sectorDescription:
            "Une équipe complète d'agents IA orchestre conversion, contenu, marketing et analytics — vous gardez la vision, ils exécutent 24/7.",
          media: { kind: "image", src: showcaseAmarsi.url },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "12 produits, 63 agents dédiés, 1 Copilote.",
          ctaCard: {
            heading: "Une équipe IA qui scale avec votre catalogue.",
            text: "Chaque produit reçoit ses agents spécialisés en conversion, création, marketing et analytics — orchestrés par un Copilote qui pilote la stratégie globale.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Repère e-commerce",
            prefix: "×",
            value: "5,3",
            suffix: "*",
            expl: "De volume d'actions marketing exécutées par mois vs une équipe humaine seule.",
            src: "* Marques D2C 2024",
          },
          large2: {
            type: "comparison",
            heading: "Équipe humaine seule vs équipe humaine + IA.",
            text: "L'équipe IA prend en charge l'exécution répétitive — vos équipes humaines pilotent la stratégie et se concentrent sur la relation client.",
            axisTitle: "Actions marketing / mois",
            pillA: "Sans IA · 24",
            pillB: "Avec IA · 128",
            axisLeft: "0",
            axisMid: "+ vélocité",
            axisRight: "+ CA",
          },
          kpi2: {
            label: "Coûts opérationnels",
            prefix: "−",
            value: "62",
            suffix: "%",
            expl: "De charge répétitive absorbée par l'équipe IA — vos talents se concentrent sur la vraie valeur ajoutée.",
            src: "Bench marques partenaires",
          },
        },
      ],
      seo: {
        title: "Équipe IA autonome pour e-commerce — Lystes",
        description: "Des agents IA autonomes qui pilotent conversion, contenu, marketing et analytics de votre e-commerce.",
      },
    },
  },
  seo: {
    id: "seo",
    href: "/solutions/seo",
    menu: {
      title: "Équipe IA SEO",
      tagline: "Fiches produits, meta et mots-clés optimisés en continu.",
      thumb: showcasePeau.url,
    },
    page: {
      kicker: "ÉQUIPE EXPERT SEO AI",
      title: "Référencement naturel optimisé en continu par l'IA",
      subtitle:
        "Votre Expert SEO IA optimise automatiquement fiches produits, méta-descriptions, H1 et mots-clés pour vous rendre visible sur Google dès le lancement.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Voir un audit", href: "/" },
      heroImage: showcasePeau.url,
      features: [
        { title: "Meta title & description", desc: "Rédigés et A/B testés automatiquement par produit." },
        { title: "H1 & structure", desc: "Hiérarchie éditoriale optimisée pour Google." },
        { title: "Mots-clés dynamiques", desc: "Le catalogue est enrichi avec les requêtes qui convertissent." },
        { title: "Alt images", desc: "Toutes vos images produit taguées automatiquement." },
      ],
      steps: [
        { n: "01", title: "Audit du catalogue", desc: "L'IA scanne chaque fiche et note un score SEO." },
        { n: "02", title: "Réécriture", desc: "Meta, H1, mots-clés, alt — refondus automatiquement." },
        { n: "03", title: "Publication", desc: "Sync directe avec Shopify, WooCommerce, headless." },
        { n: "04", title: "Suivi", desc: "Positions Google trackées et re-optimisées en continu." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur e-commerce",
          sectorDescription:
            "Vos fiches produits sont réécrites, structurées et optimisées en continu pour capter la demande Google — sans mobiliser une agence SEO.",
          media: { kind: "image", src: showcasePeau.url },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "Un catalogue entier ré-optimisé chaque semaine.",
          ctaCard: {
            heading: "Le SEO qui suit le rythme de votre catalogue.",
            text: "Meta, H1, mots-clés, alt images : chaque fiche produit est audit ée, réécrite et publiée automatiquement — puis re-optimisée dès que Google bouge.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Repère SEO",
            prefix: "×",
            value: "4,8",
            suffix: "*",
            expl: "De fiches produits optimisées par mois vs une équipe SEO classique.",
            src: "* Marques D2C 2024",
          },
          large2: {
            type: "comparison",
            heading: "Trafic organique avant vs après IA SEO.",
            text: "L'IA identifie les requêtes qui convertissent et enrichit chaque fiche en conséquence — le trafic qualifié suit en quelques semaines.",
            axisTitle: "Sessions organiques / mois",
            pillA: "Avant IA · 4 200",
            pillB: "Après IA · 18 600",
            axisLeft: "0",
            axisMid: "+ visibilité",
            axisRight: "+ ventes",
          },
          kpi2: {
            label: "Coût par mot-clé",
            prefix: "−",
            value: "88",
            suffix: "%",
            expl: "De coût par requête optimisée vs une prestation agence classique.",
            src: "Bench agences SEO 2024",
          },
        },
      ],
      seo: {
        title: "Expert SEO IA e-commerce — Lystes",
        description: "Optimisation SEO automatique de vos fiches produits, meta et mots-clés par l'IA.",
      },
    },
  },
  marketing: {
    id: "marketing",
    href: "/solutions/marketing",
    menu: {
      title: "Équipe IA marketing",
      tagline: "Campagnes, emails et posts pilotés par la data 24/7.",
      thumb: ugcCreation.url,
    },
    page: {
      kicker: "ÉQUIPE MARKETING AI",
      title: "Votre plan marketing piloté par la data",
      subtitle:
        "Une équipe Marketing IA qui crée des plans d'action personnalisés, des campagnes email, des posts sociaux et des stratégies de conversion. Un directeur marketing qui travaille 24h/24.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Voir un plan type", href: "/" },
      heroImage: ugcCreation.url,
      features: [
        { title: "Plan d'action hebdo", desc: "5 actions marketing programmées chaque semaine." },
        { title: "Emails automatiques", desc: "Bienvenue, relance panier, réactivation, promo." },
        { title: "Posts sociaux", desc: "Instagram, TikTok, LinkedIn — planifiés et publiés." },
        { title: "Data-driven", desc: "Chaque action est priorisée sur vos vraies données." },
      ],
      steps: [
        { n: "01", title: "Connexion data", desc: "E-commerce, CRM, réseaux sociaux." },
        { n: "02", title: "Diagnostic", desc: "L'IA identifie leviers et angles morts." },
        { n: "03", title: "Plan hebdo", desc: "5 actions marketing générées et validables." },
        { n: "04", title: "Exécution", desc: "L'équipe IA lance et mesure chaque action." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur DTC & retail",
          sectorDescription:
            "Un directeur marketing IA planifie, exécute et mesure vos campagnes chaque semaine — sur les canaux qui comptent, avec les bons angles.",
          media: { kind: "image", src: ugcCreation.url },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "5 actions marketing prêtes chaque lundi matin.",
          ctaCard: {
            heading: "Un plan marketing piloté par la data.",
            text: "Emails, posts sociaux, campagnes ads, réactivations : le plan hebdomadaire est généré à partir de vos vraies données de ventes et priorisé par impact.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Repère DTC",
            prefix: "×",
            value: "3,1",
            suffix: "*",
            expl: "D'actions marketing exécutées par semaine vs une équipe interne standard.",
            src: "* Marques DTC 2024",
          },
          large2: {
            type: "comparison",
            heading: "Marketing intuitif vs marketing piloté data.",
            text: "L'IA lit votre CRM, votre e-commerce et vos réseaux, puis priorise l'action qui rapporte le plus — pas celle qu'on lance par habitude.",
            axisTitle: "ROAS moyen",
            pillA: "Sans data · 1,6",
            pillB: "Avec IA · 4,2",
            axisLeft: "0",
            axisMid: "+ pertinence",
            axisRight: "+ ROI",
          },
          kpi2: {
            label: "Temps équipe",
            prefix: "−",
            value: "70",
            suffix: "%",
            expl: "De temps passé sur la planification et l'exécution répétitive.",
            src: "Vos équipes se concentrent sur la création",
          },
        },
      ],
      seo: {
        title: "Plan marketing IA data-driven — Lystes",
        description: "Un directeur marketing IA qui pilote emails, posts, campagnes et conversion 24/7.",
      },
    },
  },
  analytics: {
    id: "analytics",
    href: "/solutions/analytics",
    menu: {
      title: "Équipe IA d'analyse comportementale",
      tagline: "Comprenez frictions, objections et déclencheurs d'achat de vos clients.",
      thumb: showcase2.url,
    },
    page: {
      kicker: "ÉQUIPE ANALYTICS AI",
      title: "Comprenez les points de friction de vos clients",
      subtitle:
        "En analysant chaque conversation entre vos agents IA et vos clients, l'équipe Analytics identifie questions récurrentes, objections, points de blocage et produits les plus demandés. Des insights concrets tirés de vrais échanges.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Voir un rapport", href: "/" },
      heroImage: showcase2.url,
      features: [
        { title: "Conversations analysées", desc: "Chaque échange agent ↔ client est extrait et catégorisé." },
        { title: "Top objections", desc: "Les 10 freins récurrents à l'achat, remontés par produit." },
        { title: "Top produits", desc: "Ce que vos clients demandent vs ce qu'ils achètent." },
        { title: "Dashboard exécutif", desc: "CA, taux de conversion, top produits — au quotidien." },
      ],
      steps: [
        { n: "01", title: "Capture", desc: "Toutes les conversations agent IA sont archivées." },
        { n: "02", title: "Extraction", desc: "L'IA détecte questions, objections, intentions." },
        { n: "03", title: "Priorisation", desc: "Impact business × fréquence = liste d'actions." },
        { n: "04", title: "Décision", desc: "Vous ajustez fiches, prix, gammes en connaissance de cause." },
      ],
      sectors: [
        {
          sectorTitle: "Secteur e-commerce",
          sectorDescription:
            "Chaque conversation entre vos agents IA et vos clients devient une donnée exploitable : objections, questions récurrentes, produits demandés vs achetés.",
          media: { kind: "video", src: showcase2.url },
          mediaBadge: "CAS D'USAGE",
          mediaTitle: "Les vraies raisons pour lesquelles vos clients n'achètent pas.",
          ctaCard: {
            heading: "Des insights tirés de conversations réelles.",
            text: "L'IA analyse chaque échange, détecte les frictions récurrentes et remonte les 10 objections principales par produit — de quoi ajuster fiches, prix et gammes.",
            ctaLabel: "S'inscrire gratuitement",
            ctaHref: "/auth?mode=signup",
          },
          kpi1: {
            label: "Repère conversion",
            prefix: "×",
            value: "2,7",
            suffix: "*",
            expl: "De taux de conversion après correction des 3 principales objections détectées.",
            src: "* Marques Lystes 2024",
          },
          large2: {
            type: "comparison",
            heading: "Sondage classique vs conversations analysées.",
            text: "Les sondages capturent ce que les clients disent qu'ils veulent. Les conversations capturent ce qui les fait vraiment hésiter ou acheter.",
            axisTitle: "Signaux exploitables / mois",
            pillA: "Sondages · 40",
            pillB: "Conversations IA · 2 400",
            axisLeft: "0",
            axisMid: "+ profondeur",
            axisRight: "+ actions",
          },
          kpi2: {
            label: "Time-to-insight",
            prefix: "−",
            value: "84",
            suffix: "%",
            expl: "De délai entre une objection détectée et une correction déployée sur vos fiches.",
            src: "Bench e-commerçants partenaires",
          },
        },
      ],
      seo: {
        title: "Analyse comportementale IA e-commerce — Lystes",
        description: "Comprenez les frictions, objections et déclencheurs d'achat de vos clients grâce à l'IA.",
      },
    },
  },
  "coach-domicile": {
    id: "coach-domicile",
    href: "/solutions/coach-domicile",
    menu: {
      title: "Équipe IA de coach à domicile",
      tagline: "Accompagne le client après l'achat et fidélise.",
      thumb: showcaseAmarsi.url,
    },
    page: {
      kicker: "Coach IA à domicile",
      title: "Un coach IA à domicile qui accompagne chaque client après l'achat",
      subtitle:
        "Chaque produit devient un agent IA qui explique, oriente et accompagne l'utilisation — en rayon comme à domicile.",
      ctaPrimary: { label: "Démarrer gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Prendre rendez-vous", href: BOOKING_URL },
      heroImage: showcaseAmarsi.url,
      features: [],
      steps: [],
      sectors: [],
      seo: {
        title: "Équipe IA de coach à domicile — Lystes",
        description: "Un coach IA à domicile qui accompagne chaque client après l'achat via un simple QR code sur le packaging.",
      },
    },
  },
  avis: {
    id: "avis",
    href: "/solutions/avis",
    menu: {
      title: "Équipe IA de gestion des avis",
      tagline: "Collecte, répond et référence vos avis, produit par produit.",
      thumb: diagnosticThumb.url,
    },
    page: {
      kicker: "ÉQUIPE IA GESTION DES AVIS",
      title: "Vos avis clients, collectés, gérés et référencés produit par produit",
      subtitle:
        "Un hub d'avis sur lystes.ai/votre-marque : agrégé, vérifié, optimisé SEO. Chaque produit a sa page d'avis avec un spécialiste IA qui répond instantanément aux questions des futurs acheteurs.",
      ctaPrimary: { label: "S'inscrire gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Voir la démo live", href: "https://lystes.ai/valtheaparis/avis" },
      heroImage: diagnosticThumb.url,
      features: [],
      steps: [],
      sectors: [],
      seo: {
        title: "Équipe IA de gestion des avis — Lystes",
        description:
          "Un hub d'avis par marque et par produit, avec un spécialiste IA qui répond aux questions des futurs acheteurs et optimise votre référencement.",
      },
    },
  },
  journalistes: {
    id: "journalistes",
    href: "/solutions/journalistes",
    menu: {
      title: "Équipe IA de journalistes",
      tagline: "Articles sponsorisés publiés dans nos magazines, indexés sur Google.",
      thumb: diagnosticThumb.url,
    },
    page: {
      kicker: "ÉQUIPE IA JOURNALISTES",
      title: "Des articles sponsorisés dans de vrais magazines beauté",
      subtitle:
        "Un réseau de magazines à la ligne éditoriale distincte. Nos journalistes IA écrivent de vrais articles qui parlent de votre marque et se référencent sur Google, pour votre notoriété et votre trafic.",
      ctaPrimary: { label: "S'inscrire gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Voir un magazine", href: "#magazines" },
      heroImage: diagnosticThumb.url,
      features: [],
      steps: [],
      sectors: [],
      seo: {
        title: "Équipe IA de journalistes — Articles sponsorisés — Lystes",
        description:
          "Un réseau de magazines beauté avec des journalistes IA qui publient de vrais articles sur votre marque, indexés sur Google.",
      },
    },
  },
  "lystes-agents": {
    id: "lystes-agents",
    href: "/agents",
    menu: {
      title: "Lystes Agents",
      tagline: "Tous vos agents IA reunis sur une seule page.",
      thumb: expertThumb.url,
    },
    page: {
      kicker: "LYSTES AGENTS",
      title: "Vos equipes IA, reunies",
      subtitle:
        "Conseillers produit, essayage virtuel, diagnostic, point de vente, evenementiel, coach a domicile.",
      ctaPrimary: { label: "S'inscrire gratuitement", href: "/auth?mode=signup" },
      ctaSecondary: { label: "Prendre rendez-vous", href: BOOKING_URL },
      heroImage: expertThumb.url,
      features: [],
      steps: [],
      sectors: [],
      seo: {
        title: "Lystes Agents -- Toutes vos equipes IA -- Lystes",
        description:
          "Conseillers produit, essayage virtuel, diagnostic beaute, point de vente, evenementiel et coach a domicile : toutes vos equipes IA sur une seule page.",
      },
    },
  },
};

export const SOLUTION_ORDER: SolutionId[] = [
  "expert-produit",
  "essayage",
  "diagnostic",
  "creation",
  "ugc",
  "evenementiel",
  "point-de-vente",
  "marketing",
  "seo",
  "analytics",
  "coach-domicile",
  "avis",
  "journalistes",
];

