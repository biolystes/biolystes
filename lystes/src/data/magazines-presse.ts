/**
 * Catalogue presse — magazines ouverts à l'article sponsorisé.
 *
 * Source : export du catalogue éditeurs fourni par JP le 02/09/2026
 * (fichier « Magazine.csv »). Aucune valeur n'est estimée ici : prix, Trust
 * Flow, Domain Rating, domaines référents et visites mensuelles sont repris
 * tels quels. Un champ absent de l'export reste vide plutôt qu'inventé.
 */
export type Magazine = {
  editeur: string;
  thematiques: string[];
  prix: number;
  tf: number;
  dr: number;
  rd: number;
  visites: number;
};

export const MAGAZINES: Magazine[] = [
  { editeur: 'vogue.fr', thematiques: ['Culture & Art', 'Shopping & Promo', 'Mode & Beauté', 'Lifestyle & Vie pratique'], prix: 19950, tf: 64, dr: 82, rd: 11798, visites: 954277 },
  { editeur: 'gqmagazine.fr', thematiques: ['Culture & Art', 'Shopping & Promo', 'Lifestyle & Vie pratique', 'Santé & Bien-être'], prix: 13300, tf: 54, dr: 75, rd: 5353, visites: 532963 },
  { editeur: 'fr.euronews.com', thematiques: ['Culture & Art', 'Economie & Société', 'Business & Entreprise', 'Tourisme & Voyage'], prix: 13300, tf: 38, dr: 90, rd: 8746, visites: 229800 },
  { editeur: 'purepeople.com', thematiques: ['Loisirs & Divertissement', 'Mode & Beauté', 'Lifestyle & Vie pratique'], prix: 5191, tf: 57, dr: 71, rd: 5455, visites: 1477845 },
  { editeur: 'grazia.fr', thematiques: [], prix: 4851, tf: 55, dr: 75, rd: 5518, visites: 330043 },
  { editeur: 'strategies.fr', thematiques: ['Business & Entreprise', 'Education & Emploi', 'Marketing & Communication'], prix: 2860, tf: 59, dr: 77, rd: 4737, visites: 12850 },
  { editeur: 'forbes.fr', thematiques: ['Business & Entreprise'], prix: 2660, tf: 35, dr: 83, rd: 10237, visites: 14761 },
  { editeur: 'cbnews.fr', thematiques: ['Business & Entreprise'], prix: 2300, tf: 52, dr: 76, rd: 3452, visites: 12235 },
  { editeur: 'madame.lefigaro.fr', thematiques: ['Culture & Art', 'Loisirs & Divertissement', 'Mode & Beauté', 'Lifestyle & Vie pratique'], prix: 2083, tf: 45, dr: 91, rd: 10553, visites: 609500 },
  { editeur: 'latribune.fr', thematiques: ['Economie & Société'], prix: 1932, tf: 65, dr: 85, rd: 23223, visites: 137845 },
  { editeur: 'femmeactuelle.fr', thematiques: ['Mode & Beauté', 'Famille & Enfant', 'Santé & Bien-être'], prix: 1848, tf: 58, dr: 81, rd: 10756, visites: 1106315 },
  { editeur: 'voici.fr', thematiques: ['Shopping & Promo', 'Loisirs & Divertissement', 'Mode & Beauté', 'Lifestyle & Vie pratique'], prix: 1848, tf: 55, dr: 73, rd: 5010, visites: 1454644 },
  { editeur: 'marieclaire.fr', thematiques: ['Culture & Art', 'Economie & Société', 'Shopping & Promo', 'Mode & Beauté'], prix: 1764, tf: 67, dr: 84, rd: 14870, visites: 1589724 },
  { editeur: 'cosmopolitan.fr', thematiques: ['Culture & Art', 'Mode & Beauté', 'Lifestyle & Vie pratique'], prix: 1694, tf: 32, dr: 77, rd: 6201, visites: 617239 },
  { editeur: 'challenges.fr', thematiques: ['Economie & Société', 'Business & Entreprise', 'High-Tech & Geek', 'Auto & Moto'], prix: 1395, tf: 43, dr: 83, rd: 15813, visites: 108172 },
  { editeur: 'solutions.lesechos.fr', thematiques: ['Economie & Société', 'Finance & Banque', 'Business & Entreprise', 'Marketing & Communication'], prix: 985, tf: 36, dr: 90, rd: 3386, visites: 23350 },
  { editeur: 'public.fr', thematiques: ['Loisirs & Divertissement', 'Mode & Beauté'], prix: 924, tf: 49, dr: 72, rd: 3802, visites: 491214 },
];

/** Thématiques présentes dans le catalogue, dans l'ordre alphabétique. */
export const THEMATIQUES_MAGAZINES = Array.from(
  new Set(MAGAZINES.flatMap((m) => m.thematiques)),
).sort((a, b) => a.localeCompare(b, 'fr'));
