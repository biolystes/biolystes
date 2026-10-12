/* Réglages de la barre flottante et de l’orbital de biolystes.com
   (JP, 12/10/2026 : « l’orbital et les actus devaient être mis »).

   Un seul endroit à changer, sans recoder :

   1. CONSEILLER : qui répond dans l’orbital.
      - "biolystes-chat" (aujourd’hui) : le chat qui existe déjà sur
        biolystes.com (supabase/functions/biolystes-chat), réponse en flux.
      - "conseiller-selection" : le conseiller de sélection de produits de
        lystes.ai (petal-diagnostics, PR 346), dès qu’il est déployé.

   2. Le widget complet de lystes.ai : quand l’identifiant de l’agent
      Biolystes est collé dans index.html (AGENT_LYSTES), le widget pose sa
      propre barre et son propre orbital. Ceux d’ici s’effacent alors d’eux-
      mêmes (index.html marque <html data-lystes-widget>), sans doublon. */

export type Conseiller = "biolystes-chat" | "conseiller-selection";

export const CONSEILLER: Conseiller = "biolystes-chat";

export const ADRESSES_CONSEILLER: Record<Conseiller, string> = {
  "biolystes-chat": `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/biolystes-chat`,
  "conseiller-selection": "https://sjvxyiqiacpwskglgxkf.supabase.co/functions/v1/conseiller-selection",
};

/* La barre du milieu : libellé et page des actualités. */
export const BARRE = {
  libelle: "Voir nos dernières actus",
  libelleCourt: "Nos dernières actus",
  lien: "/blog",
};

/* Le seul appel à l’action du site (décision de JP). */
export const LIEN_RDV = "https://biolystes.pro/rdv";

/* Pages où ni la barre ni l’orbital n’apparaissent : espaces connectés,
   outils internes, pages partagées qui ont leur propre interface. */
export const PAGES_SANS_BARRE = [
  "/agent/",
  "/selection/",
  "/admin",
  "/espace-client",
  "/onboarding",
  "/login",
  "/signup",
  "/forgot-password",
  "/settings",
  "/chat",
  "/catalogue",
];
