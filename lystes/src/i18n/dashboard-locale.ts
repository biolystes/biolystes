/**
 * Chargeur de langues pour le tableau de bord marchand.
 *
 * Même mécanique que `docs-locale.ts`, appliquée à une autre racine. Ce n'est
 * pas un troisième mécanisme : c'est le deuxième, réutilisé.
 *
 * Pourquoi un fichier à part plutôt que la racine `dashboard` dans le gros
 * `locales/<lang>.json` : ces fichiers font 350 Ko, portent 6 021 clés et
 * quatorze sessions écrivent dedans en même temps. Une racine isolée dans son
 * propre dossier évite les conflits, et rend la règle vérifiable d'un coup
 * d'œil : une langue existe si, et seulement si, son fichier existe.
 *
 * `locales/dashboard/<lang>.json`, découvert par glob Vite. Déposer un fichier
 * suffit à activer la langue, aucun import à ajouter.
 *
 * `dashboard/fr.json` EST OBLIGATOIRE. La chaîne de repli de l'application est
 * `['fr', 'en']` : une clé absente du français mais présente en anglais serait
 * servie EN ANGLAIS à un visiteur français. La leçon vient de la documentation,
 * où une page entière s'est affichée en anglais pour cette raison.
 *
 * Le français de `fr.json` doit rester identique, au caractère près, à la valeur
 * par défaut écrite dans le composant. Cette valeur par défaut est le dernier
 * filet : une clé absente de tous les fichiers s'affiche en français, jamais en
 * « dashboard.sidebar.installation » brut.
 *
 * CE QUI N'EST PAS ICI, et pourquoi. Six libellés de la barre latérale passent
 * encore par `sidebar.items.*`, dans les fichiers globaux. Ils y sont traduits
 * en QUATORZE langues. Les rapatrier ici les ferait retomber à cinq, donc
 * régresser en japonais, chinois, russe, arabe, hindi, polonais, néerlandais,
 * portugais et suédois. Le partage est délibéré et vaut mieux qu'une régression.
 */

type Dict = Record<string, unknown>;

const modules = import.meta.glob<{ default: Dict }>("./locales/dashboard/*.json", {
  eager: true,
});

const SOURCES: Record<string, Dict> = {};

for (const [path, mod] of Object.entries(modules)) {
  // path : ./locales/dashboard/de.json
  // Même limite connue que syncTranslations : codes à deux lettres seulement.
  const match = path.match(/\/([a-z]{2})\.json$/i);
  if (!match) continue;
  SOURCES[match[1].toLowerCase()] = (mod as { default: Dict }).default;
}

function fusionner(base: Dict, dessus: Dict): Dict {
  const out: Dict = { ...base };
  for (const cle of Object.keys(dessus)) {
    const v = dessus[cle];
    const b = out[cle];
    if (
      typeof v === "object" && v !== null && !Array.isArray(v) &&
      typeof b === "object" && b !== null && !Array.isArray(b)
    ) {
      out[cle] = fusionner(b as Dict, v as Dict);
    } else {
      out[cle] = v;
    }
  }
  return out;
}

/**
 * Les langues pour lesquelles un fichier de tableau de bord existe réellement.
 *
 * Dérivé du glob, jamais recopié : déposer `locales/dashboard/ja.json` suffit à
 * faire apparaître le japonais ici, et par ricochet dans `languesDisponibles`
 * (voir config.ts). Il n'y a aucune deuxième liste à mettre à jour.
 */
export const languesTableauDeBord = Object.keys(SOURCES).sort();

/**
 * Le dictionnaire `dashboard` d'une langue.
 *
 * Trois couches, de la plus faible à la plus forte :
 *  1. `racineGlobale` — la racine `dashboard` du gros `locales/<lang>.json`.
 *     500 clés, dont les 471 clés `dashboard.<zone>.<nom>` (equipe, avis,
 *     commandes, commun…), traduites en quatorze langues.
 *  2. le `dashboard/fr.json` de ce dossier — le filet français.
 *  3. le `dashboard/<lang>.json` de ce dossier, s'il existe.
 *
 * POURQUOI LA COUCHE 1 EXISTE, mesuré le 10/08/2026. config.ts posait
 * `dashboard: getDashboardLocale(code)` en écrasement pur : les 500 clés de la
 * racine globale disparaissaient, dans les quatorze langues. C'est ce qui
 * faisait afficher « Completude Par Langue », sans accents, sur la page d'audit
 * i18n elle-même : la clé `dashboard.auditI18n.titreCompletudeParLangue` EXISTE et est
 * traduite, elle était simplement effacée au démarrage par cet écrasement.
 * Les deux jeux de clés ne se recouvrent nulle part, zéro collision sur les
 * quatorze langues : la fusion est strictement additive.
 */
export function getDashboardLocale(lang: string, racineGlobale: Dict = {}): Dict {
  const fr = SOURCES.fr ?? {};
  const code = (lang || "fr").substring(0, 2).toLowerCase();
  const socle = fusionner(racineGlobale, fr);
  const courant = code === "fr" ? undefined : SOURCES[code];
  return courant ? fusionner(socle, courant) : socle;
}
