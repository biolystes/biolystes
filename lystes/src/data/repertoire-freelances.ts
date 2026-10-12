/**
 * Répertoire des freelances (agences) affiché dans le Cowork, sur
 * /dashboard/agences, sur /dashboard/experts-marketing et dans le copilote.
 *
 * VIDE, ET C'EST VOULU (30/09/2026). Le répertoire portait neuf fiches
 * inventées : adresses @exemple.fr, notes et nombres d'avis, gains en
 * pourcentage, présentées comme « freelances et studios vérifiés ». Aucune
 * n'était une vraie personne. Elles ont été retirées partout : un faux profil
 * annoncé vérifié ne se montre pas, ni à une marchande ni à un investisseur.
 *
 * Les fiches reviendront des inscriptions réelles (page LIEN_INSCRIPTION_FREELANCE).
 * Tant que la liste est vide, chaque écran affiche un état vide honnête avec
 * ce lien, jamais une fiche de démonstration. Le test
 * `src/test/aucun-faux-freelance.test.tsx` échoue si un des neuf noms ou une
 * adresse @exemple.fr réapparaît dans le code servi.
 */

export type Freelance = {
  cat: string;
  nom: string;
  initiales: string;
  titre: string;
  studio: string;
  site: string;
  note: number;
  avis: number;
  ville: string;
  reponse: string;
  /** Tarif journalier en euros. */
  jour: number;
  bio: string;
  tags: string[];
  email: string;
  /** Photo de profil (URL CDN), sinon initiales. */
  photo?: string;
};

/** Catégories du répertoire, dans l'ordre d'affichage des pastilles. */
export const CATEGORIES_FREELANCES = [
  { id: 'cro', mot: 'CRO' },
  { id: 'media', mot: 'Media Buyer' },
  { id: 'seo', mot: 'SEO' },
  { id: 'contenu', mot: 'Contenu' },
  { id: 'data', mot: 'Data' },
  { id: 'email', mot: 'E-mailing' },
] as const;

/** Page publique où un freelance s'inscrit. */
export const LIEN_INSCRIPTION_FREELANCE = '/freelances/inscription';

/** Aucun freelance inscrit pour l'instant : pas une seule fiche inventée. */
export const FREELANCES: Freelance[] = [];
