/**
 * business-organigramme-data.ts — l'organigramme de `/business`.
 *
 * ⚠️ LA STRUCTURE EST CELLE DE L'ACCUEIL, au slot près : mêmes quatre
 * directions, mêmes identifiants (`conversion`, `creative`, `marketing`,
 * `analytics`), même nombre de managers et d'équipes dans chacune, mêmes
 * avatars, mêmes compteurs. Rien ne bouge dans la mise en page. Seul le TEXTE
 * change, parce que la cible change.
 *
 * Ce que l'accueil vend et qui ne parle pas à une entreprise sans catalogue :
 * le diagnostic, l'essayage, le coach après achat, l'optimiseur de fiche
 * produit, les paniers abandonnés. Ces postes cèdent leur place à ceux qu'une
 * entreprise attend : prise de rendez-vous, prospection, comptabilité,
 * juridique, recrutement.
 *
 * Ce qui est CONSERVÉ parce que ça vaut aussi hors ecommerce : le standard et
 * le service client, les photographes et graphistes IA, les créateurs de
 * contenu, le SEO, la stratégie marketing, les publicités, le suivi des liens,
 * et toute l'équipe d'analyse.
 *
 * Fichier indépendant de `src/components/team/organigramme-data.ts` : le
 * modifier ne peut pas bouger l'accueil.
 */
import type { AgentCounts } from "@lystes/hooks/useAgentCounts";
import type { OrgData } from "@lystes/components/team/organigramme-data";

export function buildBusinessOrgData(
  counts: Omit<AgentCounts, "loading">,
  hasDiagnostic: boolean
): OrgData {
  const pc = counts.productCount;
  return {
    ceo: {
      name: "Cowork",
      title: "Assistant de direction",
      avatar: "https://lystes.ai/__l5e/assets-v1/1dff8f72-fdf1-4292-9855-bd0de0688f3f/clea-ceo-new.png",
      bio: "Votre bras droit. Il tient votre liste de tâches, parle à vos outils, coordonne les 4 directions et vous rend compte. Vous lui écrivez, il exécute.",
    },
    directors: [
      // ── Eva — Relation client ──
      {
        id: "conversion",
        name: "Eva",
        title: "Directrice Relation client",
        tag: "24H/24",
        avatar: "https://static.thenounproject.com/png/7385763-200.png",
        label: "RELATION CLIENT",
        bio: "Personne ne tombe plus sur un répondeur. Eva tient le standard, le service après-vente et l'agenda, de jour comme de nuit.",
        managers: [
          { name: "Adam", title: "Manager Standard téléphonique", tag: "APPELS", avatar: "https://static.thenounproject.com/png/7544872-200.png", bio: "Encadre les agents qui décrochent. Chaque appel est compris, qualifié, routé vers la bonne personne, et résumé par mail." },
          { name: "Sofia", title: "Manager Service après-vente", tag: "SAV", avatar: "https://static.thenounproject.com/png/7544900-200.png", bio: "Dirige les agents qui répondent sur WhatsApp, par mail et sur votre site. Même réponse partout, à toute heure." },
          ...(hasDiagnostic ? [{
            name: "Zoé",
            title: "Spécialiste Prise de rendez-vous",
            tag: "AGENDA",
            avatar: "https://static.thenounproject.com/png/7385779-200.png",
            bio: "Propose les créneaux libres, pose le rendez-vous dans votre agenda et envoie l'invitation. Rien à ressaisir.",
            isSpecialist: true,
          }] : []),
        ],
        teams: [
          { name: "Standard téléphonique", count: 1, description: "Un numéro qui décroche toujours, jour et nuit", subtitle: "1 ligne", href: "/dashboard/my-team?tab=specialists" },
          { name: "Équipe IA du service client", count: pc, description: "1 agent dédié par sujet traité", subtitle: `${pc} agents`, href: "/dashboard/my-team?tab=products" },
          { name: "Équipe IA de suivi client", count: pc, description: "Reprise de contact après chaque dossier", subtitle: `${pc} agents`, href: "/dashboard/my-team?tab=postPurchase" },
        ],
      },

      // ── Raphaël — Communication ──
      {
        id: "creative",
        name: "Raphaël",
        title: "Directeur Communication",
        tag: "VISIBILITÉ",
        avatar: "https://static.thenounproject.com/png/7038302-200.png",
        label: "COMMUNICATION",
        bio: "De l'idée à la publication. Raphaël tient vos réseaux, vos visuels et votre identité, sans que vous ouvriez un outil.",
        managers: [
          { name: "Emma", title: "Manager Réseaux sociaux", tag: "SOCIAL", avatar: "https://static.thenounproject.com/png/7385783-200.png", bio: "Coordonne les agents qui créent le visuel, écrivent la légende et programment la publication sur chaque réseau." },
          { name: "Noah", title: "Manager Photographes", tag: "PHOTO", avatar: "https://static.thenounproject.com/png/7923622-200.png", bio: "Supervise l'équipe de photographes IA : portraits d'équipe, locaux, mises en scène de vos services." },
          { name: "Léa", title: "Manager Design", tag: "DESIGN", avatar: "https://static.thenounproject.com/png/7385779-200.png", bio: "Responsable de votre charte : couleurs, typographies, gabarits. Chaque support ressemble aux autres." },
        ],
        teams: [
          { name: "Créateurs de contenu", count: counts.creative.ugc, description: "Publications et vidéos au ton de la maison", subtitle: `${counts.creative.ugc} créateurs`, href: "/dashboard/ugc-creators" },
          { name: "Photographes IA", count: counts.creative.photographers, description: "Images professionnelles pour vos supports", subtitle: `${counts.creative.photographers} photographes`, href: "/dashboard/ai-photographers" },
          { name: "Graphistes IA", count: counts.creative.designers, description: "Identité visuelle et documents", subtitle: `${counts.creative.designers} graphiste`, href: "/dashboard/ai-graphistes" },
        ],
      },

      // ── Lucas — Croissance ──
      {
        id: "marketing",
        name: "Lucas",
        title: "Directeur Croissance",
        tag: "PROSPECTION",
        avatar: "https://static.thenounproject.com/png/7544902-200.png",
        label: "CROISSANCE",
        bio: "Faire venir, puis faire signer. Lucas tient le référencement, la publicité et la prospection, et remplit votre agenda de rendez-vous tenables.",
        managers: [
          { name: "Maya", title: "Manager Référencement", tag: "SEO", avatar: "https://static.thenounproject.com/png/7544902-200.png", bio: "Encadre les rédacteurs SEO. Articles optimisés, publiés sur votre site, et audit du vôtre comme de celui de vos concurrents." },
          { name: "Inès", title: "Stratégiste Marketing", tag: "STRATÉGIE", avatar: "https://static.thenounproject.com/png/7385763-200.png", bio: "Génère votre plan marketing hebdomadaire avec des recommandations concrètes." },
          { name: "Théo", title: "Ads Manager", tag: "ADS", avatar: "https://static.thenounproject.com/png/7038302-200.png", bio: "Simule et optimise votre budget publicitaire Meta, Google et LinkedIn Ads." },
          { name: "Jade", title: "Manager Prospection", tag: "COMMERCIAL", avatar: "https://static.thenounproject.com/png/7385779-200.png", bio: "Mène les campagnes d'appels sortants et l'approche LinkedIn, qualifie les pistes et pose les rendez-vous." },
          { name: "Hugo", title: "Manager Tracking", tag: "TRACKING", avatar: "https://static.thenounproject.com/png/7923622-200.png", bio: "Suit la performance de tous vos liens, campagnes et réseaux sociaux." },
        ],
        teams: [
          { name: "Rédacteurs SEO", count: pc, description: "1 rédacteur dédié par sujet à couvrir", subtitle: `${pc} rédacteurs`, href: "/dashboard/boost-produit" },
        ],
      },

      // ── Maya — Administration & données ──
      {
        id: "analytics",
        name: "Maya",
        title: "Directrice Administration",
        tag: "CONFORMITÉ",
        avatar: "https://static.thenounproject.com/png/7544900-200.png",
        label: "ADMINISTRATION & DONNÉES",
        bio: "Ce qui vous prend vos soirées. Trésorerie, contrats, recrutement, chiffres : Maya tient le dossier et vous alerte avant que ça coince.",
        managers: [
          { name: "Comptabilité", title: "Trésorerie & budgets", tag: "COMPTA", avatar: "https://static.thenounproject.com/png/7544872-200.png", bio: "Prévisions de trésorerie, budgets, rapports mensuels, et les conseils d'optimisation qui vont avec." },
          { name: "Juridique", title: "Contrats & conformité", tag: "JURIDIQUE", avatar: "https://static.thenounproject.com/png/7544900-200.png", bio: "Rédige contrats et conditions de vente, vérifie votre conformité, répond à vos questions sans rendez-vous." },
          { name: "Recrutement", title: "Du poste au candidat", tag: "RH", avatar: "https://static.thenounproject.com/png/7923622-200.png", bio: "Écrit l'offre, la diffuse, trie les candidatures et vous remonte la liste courte, argumentée." },
          { name: "Analyste Activité", title: "Devis & signatures", tag: "ACTIVITÉ", avatar: "https://static.thenounproject.com/png/7038302-200.png", bio: "Suit les devis envoyés, les signatures et le chiffre d'affaires en temps réel." },
          { name: "Analyste Trafic", title: "Trafic & acquisition", tag: "TRAFIC", avatar: "https://static.thenounproject.com/png/7385783-200.png", bio: "Analyse les sources de trafic, les canaux d'acquisition et leur rentabilité." },
          { name: "Analyste Audience", title: "Profil de vos clients", tag: "AUDIENCE", avatar: "https://static.thenounproject.com/png/7544902-200.png", bio: "Décrit qui sont vos clients, et segmente votre audience." },
        ],
        teams: [],
        cowork: {
          name: "Cowork",
          description: "Posez n'importe quelle question sur votre entreprise. Cowork lit vos données et vous répond.",
          cta: "Ouvrir Cowork",
          href: "/dashboard/cowork",
        },
      },
    ],
  };
}
