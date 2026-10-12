/**
 * organigramme-data.ts — Données statiques des agents nommés + builder dynamique
 */
import type { AgentCounts } from "@lystes/hooks/useAgentCounts";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OrgAgent {
  name: string;
  title: string;
  tag?: string;
  avatar: string;
  bio: string;
  mission?: string;
  isSpecialist?: boolean;
}

export interface OrgTeam {
  name: string;
  count: number;
  description: string;
  subtitle: string;
  href?: string;
}

export interface CoworkCard {
  name: string;
  description: string;
  cta: string;
  href: string;
}

export interface OrgDirector extends OrgAgent {
  id: string;
  label: string;
  managers: OrgAgent[];
  teams: OrgTeam[];
  cowork?: CoworkCard; // Seulement pour la directrice analytics
}

export interface OrgData {
  ceo: OrgAgent;
  directors: OrgDirector[];
}

// ─── Builder ─────────────────────────────────────────────────────────────────

export function buildOrgData(counts: Omit<AgentCounts, "loading">, hasDiagnostic: boolean): OrgData {
  const pc = counts.productCount;
  return {
    ceo: {
      name: "Cowork",
      title: "Manager Général",
      avatar: "https://lystes.ai/__l5e/assets-v1/1dff8f72-fdf1-4292-9855-bd0de0688f3f/clea-ceo-new.png",
      bio: "Superviseur central de l'ensemble des équipes IA. Coordonne les 4 directions et assure la cohérence stratégique globale de votre boutique.",
    },
    directors: [
      // ── Eva — Conversion ──
      {
        id: "conversion",
        name: "Eva",
        title: "Directrice Conversion",
        label: "ÉQUIPE CONVERSION",
        avatar: "https://static.thenounproject.com/png/7385763-200.png",
        bio: "Pilote l'ensemble de l'équipe dédiée à transformer vos visiteurs en acheteurs.",
        mission: "Vendre",
        managers: [
          { name: "Adam", title: "Manager Conseillers", tag: "CONSEILLERS", avatar: "https://static.thenounproject.com/png/7544872-200.png", bio: "Encadre les conseillers produits. Chaque conseiller connaît parfaitement un produit et guide le client vers le bon choix." },
          { name: "Sofia", title: "Manager coach à domicile", tag: "COACHES", avatar: "https://static.thenounproject.com/png/7544900-200.png", bio: "Dirige l'équipe de coaches post-achat. Ils accompagnent chaque client après son achat pour maximiser la satisfaction." },
          ...(hasDiagnostic ? [{
            name: "Zoé", title: "Spécialiste Diagnostic", tag: "DIAGNOSTIC",
            avatar: "https://static.thenounproject.com/png/7544878-200.png",
            bio: "Experte sectorielle qui réalise des diagnostics personnalisés pour orienter le client vers le produit idéal.",
            isSpecialist: true,
          }] : []),
        ],
        teams: [
          /* Un seul conseiller boutique par compte : il répond sur tout le
             catalogue, il compte donc comme un membre, pas comme un réglage. */
          { name: "Conseiller boutique", count: 1, description: "Répond sur tout le site, à l'écrit et au téléphone", subtitle: "1 conseiller", href: "/dashboard/my-team?tab=specialists" },
          { name: "Équipe IA de conseillers produit", count: pc, description: "1 conseiller dédié par produit", subtitle: `${pc} conseillers`, href: "/dashboard/experts-produit" },
          { name: "Équipe IA de coach à domicile", count: pc, description: "Accompagnement après achat", subtitle: `${pc} coaches`, href: "/dashboard/coach-domicile" },
        ],
      },
      // ── Raphaël — Créatif ──
      {
        id: "creative",
        name: "Raphaël",
        title: "Directeur Créatif",
        label: "ÉQUIPE CRÉATIVE",
        avatar: "https://static.thenounproject.com/png/7038302-200.png",
        bio: "Responsable de toute la production de contenu visuel. Supervise ambassadeurs, photographes et graphiste.",
        mission: "Produire",
        managers: [
          { name: "Emma", title: "Manager Ambassadeurs", tag: "UGC", avatar: "https://static.thenounproject.com/png/7385783-200.png", bio: "Coordonne les créateurs UGC qui produisent du contenu authentique et engageant." },
          { name: "Noah", title: "Manager Photographes", tag: "PHOTO", avatar: "https://static.thenounproject.com/png/7923622-200.png", bio: "Supervise l'équipe de photographes IA pour des mises en scène professionnelles." },
          { name: "Léa", title: "Manager Design", tag: "DESIGN", avatar: "https://static.thenounproject.com/png/7385779-200.png", bio: "Responsable du branding et du design éditorial. Cohérence visuelle de tous les supports." },
        ],
        teams: [
          { name: "Ambassadeurs UGC", count: counts.creative.ugc, description: "Contenu UGC réaliste par secteur", subtitle: `${counts.creative.ugc} créateurs`, href: "/dashboard/ugc-creators" },
          { name: "Photographes IA", count: counts.creative.photographers, description: "Photos produit professionnelles", subtitle: `${counts.creative.photographers} photographes`, href: "/dashboard/ai-photographers" },
          { name: "Graphistes IA", count: counts.creative.designers, description: "Branding & design éditorial", subtitle: `${counts.creative.designers} graphiste`, href: "/dashboard/ai-graphistes" },
        ],
      },
      // ── Lucas — Marketing ──
      {
        id: "marketing",
        name: "Lucas",
        title: "Directeur Marketing",
        label: "ÉQUIPE MARKETING",
        avatar: "https://static.thenounproject.com/png/7999219-200.png",
        bio: "Dirige la stratégie de croissance. Optimise le SEO, planifie les campagnes et suit la performance de tous les canaux.",
        mission: "Promouvoir",
        managers: [
          { name: "Maya", title: "Manager Optimisation", tag: "SEO/CRO", avatar: "https://static.thenounproject.com/png/7544902-200.png", bio: "Encadre les optimiseurs produits. Chacun améliore le SEO et la conversion d'une fiche produit." },
          { name: "Inès", title: "Stratégiste Marketing", tag: "STRATÉGIE", avatar: "https://static.thenounproject.com/png/7385763-200.png", bio: "Génère votre plan marketing hebdomadaire avec des recommandations concrètes." },
          { name: "Théo", title: "Ads Manager", tag: "ADS", avatar: "https://static.thenounproject.com/png/7038302-200.png", bio: "Simule et optimise votre budget publicitaire Meta, Google et TikTok Ads." },
          { name: "Jade", title: "Manager Influence", tag: "INFLUENCE", avatar: "https://static.thenounproject.com/png/7385779-200.png", bio: "Gère les collaborations influenceurs et suit la performance de chaque partenariat." },
          { name: "Hugo", title: "Manager Tracking", tag: "TRACKING", avatar: "https://static.thenounproject.com/png/7923622-200.png", bio: "Suit la performance de tous vos liens, campagnes et réseaux sociaux." },
        ],
        teams: [
          { name: "Optimiseurs Produits", count: pc, description: "1 optimiseur dédié par produit", subtitle: `${pc} optimiseurs`, href: "/dashboard/boost-produit" },
        ],
      },
      // ── Maya — Analytics ──
      {
        id: "analytics",
        name: "Maya",
        title: "Directrice Analytics",
        label: "ÉQUIPE ANALYTICS",
        avatar: "https://static.thenounproject.com/png/7385779-200.png",
        bio: "Centralise et analyse toutes les données de votre boutique. Supervise les analystes spécialisés et alimente Cowork, votre assistant IA stratégique.",
        mission: "Mesurer",
        managers: [
          { name: "Analyste Performance", title: "Performance & Conversion", tag: "PERF", avatar: "https://static.thenounproject.com/png/7544872-200.png", bio: "Analyse les taux de conversion, la performance des pages et les parcours d'achat." },
          { name: "Analyste Ventes", title: "Ventes & Commandes", tag: "VENTES", avatar: "https://static.thenounproject.com/png/7544900-200.png", bio: "Suit les ventes, les commandes et le chiffre d'affaires en temps réel." },
          { name: "Analyste Paniers", title: "Paniers abandonnés", tag: "PANIERS", avatar: "https://static.thenounproject.com/png/7923622-200.png", bio: "Détecte les patterns d'abandon de panier et identifie les leviers de récupération." },
          { name: "Analyste Trafic", title: "Trafic & Acquisition", tag: "TRAFIC", avatar: "https://static.thenounproject.com/png/7038302-200.png", bio: "Analyse les sources de trafic, les canaux d'acquisition et leur rentabilité." },
          { name: "Analyste Audience", title: "Avatar client", tag: "AUDIENCE", avatar: "https://static.thenounproject.com/png/7385783-200.png", bio: "Génère l'avatar client automatique et segmente votre audience." },
          { name: "Analyste Classements", title: "Top Clients & Produits", tag: "TOP", avatar: "https://static.thenounproject.com/png/7544902-200.png", bio: "Classe vos meilleurs clients et produits par chiffre d'affaires et fréquence." },
        ],
        teams: [], // Pas d'équipe terrain — les analystes SONT l'équipe
        cowork: {
          name: "Cowork",
          description: "Posez n'importe quelle question sur votre boutique. Cowork analyse vos données et vous répond.",
          cta: "Ouvrir Cowork",
          href: "/dashboard/cowork",
        },
      },
    ],
  };
}
