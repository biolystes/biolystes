/**
 * L'APERÇU D'ARTICLE : voir ce qu'un journaliste écrira, avant de le choisir.
 *
 * 15/09/2026 (JP) : « si je dois choisir un agent SEO, je dois savoir quel
 * type d'article il va écrire pour moi, c'est quoi sa spécialité, c'est quoi
 * ce qu'il fait dans le SEO. Je dois avoir tout ça pour pouvoir sélectionner. »
 *
 * ET LA RÈGLE QUI VA AVEC, donnée le même jour : « toujours commencer par ce
 * qui se voit, parce que c'est ce que le client voit quand il est dans le
 * back-office ».
 *
 * CE QU'UN APERÇU DOIT MONTRER. Pas un prompt : un prompt est écrit pour un
 * modèle, pas pour une marchande. Ce qui permet de choisir, c'est la FORME de
 * l'article, parce que c'est elle qui diffère d'un journaliste à l'autre. Une
 * enquête ouvre sur une réponse nette puis cite ses sources. Un comparatif
 * ouvre sur un tableau. Un guide est une suite d'étapes numérotées. Une page
 * de questions est une série de blocs autonomes. Un reportage est fait de
 * citations. Une définition tient dans son premier paragraphe.
 *
 * Ces six formes sont dessinées ici. Elles coûtent zéro crédit, s'affichent
 * instantanément, et disent la vérité : ce sont des gabarits, pas des articles
 * déjà écrits.
 */

type Bloc =
  | { genre: "titre"; texte: string }
  | { genre: "chapo"; texte: string }
  | { genre: "soustitre"; texte: string }
  | { genre: "paragraphe"; lignes: number }
  | { genre: "tableau"; colonnes: number; rangees: number }
  | { genre: "etape"; numero: number; texte: string }
  | { genre: "citation"; texte: string }
  | { genre: "question"; texte: string }
  | { genre: "encadre"; texte: string };

export interface ApercuEditorial {
  /** Ce que le journaliste fait, en une phrase de marchande. */
  specialite: string;
  /** Ce qu'il refuse de faire : c'est souvent ça qui décide. */
  refuse: string;
  /** Longueur habituelle, pour situer l'effort. */
  calibre: string;
  blocs: Bloc[];
}

export const APERCUS_EDITORIAUX: Record<string, ApercuEditorial> = {
  "journaliste-enquete": {
    specialite: "Répond à une question que vos clientes posent vraiment, et cite ses sources.",
    refuse: "Ne conclut jamais au-delà de ce que les sources disent.",
    calibre: "1000 à 1500 mots",
    blocs: [
      { genre: "titre", texte: "Est-ce que ce produit fonctionne vraiment ?" },
      { genre: "chapo", texte: "La réponse en trois lignes, avant tout le contexte." },
      { genre: "soustitre", texte: "Ce que disent les sources" },
      { genre: "paragraphe", lignes: 3 },
      { genre: "encadre", texte: "Ce qui n'est pas prouvé" },
      { genre: "paragraphe", lignes: 2 },
    ],
  },
  "journaliste-comparatif": {
    specialite: "Met votre produit face à ses alternatives réelles, dans un tableau.",
    refuse: "N'avantage pas votre produit : ce qui le dessert est écrit aussi.",
    calibre: "1000 à 1500 mots",
    blocs: [
      { genre: "titre", texte: "Ce produit ou ses trois alternatives ?" },
      { genre: "tableau", colonnes: 4, rangees: 4 },
      { genre: "soustitre", texte: "Pour qui chacune convient" },
      { genre: "paragraphe", lignes: 3 },
      { genre: "encadre", texte: "Ce qui dessert ce produit" },
    ],
  },
  "journaliste-guide": {
    specialite: "Explique le geste en étapes numérotées, avec durée et matériel.",
    refuse: "Aucune étape ne suppose un achat supplémentaire.",
    calibre: "800 à 1200 mots",
    blocs: [
      { genre: "titre", texte: "Comment faire, étape par étape" },
      { genre: "chapo", texte: "Durée totale annoncée dès la première ligne." },
      { genre: "etape", numero: 1, texte: "Préparer — 2 minutes" },
      { genre: "etape", numero: 2, texte: "Appliquer — 5 minutes" },
      { genre: "etape", numero: 3, texte: "Laisser agir — 10 minutes" },
      { genre: "encadre", texte: "Liste de contrôle en dix points" },
    ],
  },
  "journaliste-questions": {
    specialite: "Répond aux questions de votre service client, en blocs autonomes.",
    refuse: "Ne contourne jamais une objection : elle est citée mot pour mot.",
    calibre: "1000 à 1500 mots",
    blocs: [
      { genre: "titre", texte: "Vos questions, une réponse par question" },
      { genre: "question", texte: "Combien de temps avant de voir quelque chose ?" },
      { genre: "paragraphe", lignes: 2 },
      { genre: "question", texte: "Est-ce que ça convient à tout le monde ?" },
      { genre: "paragraphe", lignes: 2 },
      { genre: "encadre", texte: "Chaque réponse citable seule par une IA" },
    ],
  },
  "journaliste-terrain": {
    specialite: "Fait parler vos clientes, avec leurs mots, datés et attribués.",
    refuse: "Ne reformule pas une citation pour la rendre flatteuse.",
    calibre: "800 à 1300 mots",
    blocs: [
      { genre: "titre", texte: "Trois mois d'usage, raconté par celles qui l'ont fait" },
      { genre: "citation", texte: "« Au début je n'y croyais pas du tout. »" },
      { genre: "paragraphe", lignes: 2 },
      { genre: "citation", texte: "« Ce qui m'a gênée, c'est l'odeur. »" },
      { genre: "paragraphe", lignes: 2 },
      { genre: "encadre", texte: "Ce qui les a déçues figure aussi" },
    ],
  },
  "journaliste-lexique": {
    specialite: "Définit les termes de votre secteur, pour être la source que l'IA cite.",
    refuse: "Ne développe jamais avant d'avoir défini en deux lignes.",
    calibre: "800 à 1200 mots",
    blocs: [
      { genre: "titre", texte: "Ce terme, défini en deux lignes" },
      { genre: "encadre", texte: "La définition, autonome et citable" },
      { genre: "soustitre", texte: "Ce que le terme ne dit pas" },
      { genre: "paragraphe", lignes: 3 },
      { genre: "soustitre", texte: "Ne pas confondre avec" },
      { genre: "paragraphe", lignes: 2 },
    ],
  },
};

const GRIS = "#9aa0a6";
const FAINT = "#eceff1";

function Ligne({ largeur }: { largeur: string }) {
  return <div className="rounded-[1px]" style={{ height: 3, width: largeur, background: GRIS, opacity: 0.55 }} />;
}

function RenduBloc({ bloc }: { bloc: Bloc }) {
  switch (bloc.genre) {
    case "titre":
      return (
        /* Équilibré : « Est-ce que ce produit fonctionne / vraiment ? »
           laissait un mot seul en dernière ligne (relecture du 10/10). */
        <p className="text-[9px] font-semibold leading-[12px] text-black [text-wrap:balance]">{bloc.texte}</p>
      );
    case "chapo":
      return (
        <p className="text-[7px] leading-[10px]" style={{ color: "#5f6368" }}>{bloc.texte}</p>
      );
    case "soustitre":
      return (
        <p className="mt-[2px] text-[7px] font-semibold leading-[10px]" style={{ color: "#3f4246" }}>
          {bloc.texte}
        </p>
      );
    case "paragraphe":
      return (
        <div className="flex flex-col gap-[2px]">
          {Array.from({ length: bloc.lignes }).map((_, i) => (
            <Ligne key={i} largeur={i === bloc.lignes - 1 ? "58%" : "100%"} />
          ))}
        </div>
      );
    case "tableau":
      return (
        <div
          className="overflow-hidden rounded-[2px]"
          style={{ border: `1px solid ${FAINT}` }}
        >
          {Array.from({ length: bloc.rangees }).map((_, r) => (
            <div
              key={r}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${bloc.colonnes}, 1fr)`,
                borderTop: r === 0 ? "none" : `1px solid ${FAINT}`,
                background: r === 0 ? "#f7f8f9" : "transparent",
              }}
            >
              {Array.from({ length: bloc.colonnes }).map((_, c) => (
                <div key={c} className="px-[3px] py-[3px]">
                  <Ligne largeur={c === 0 ? "80%" : "52%"} />
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    case "etape":
      return (
        <div className="flex items-center gap-[4px]">
          <span
            className="flex h-[11px] w-[11px] shrink-0 items-center justify-center rounded-full text-[6px] font-bold"
            style={{ background: "#e1f3c5", color: "#3f4246" }}
          >
            {bloc.numero}
          </span>
          <span className="text-[7px] leading-[10px]" style={{ color: "#3f4246" }}>{bloc.texte}</span>
        </div>
      );
    case "citation":
      return (
        <p
          className="pl-[5px] text-[7px] italic leading-[10px]"
          style={{ color: "#3f4246", borderLeft: `2px solid ${FAINT}` }}
        >
          {bloc.texte}
        </p>
      );
    case "question":
      return (
        <p className="text-[7px] font-semibold leading-[10px]" style={{ color: "#3f4246" }}>
          {bloc.texte}
        </p>
      );
    case "encadre":
      return (
        <div className="rounded-[2px] px-[5px] py-[4px]" style={{ background: "#f3f4f5" }}>
          <p className="text-[7px] font-medium leading-[10px]" style={{ color: "#3f4246" }}>
            {bloc.texte}
          </p>
        </div>
      );
    default:
      return null;
  }
}

/**
 * Rend `null` pour un profil sans aperçu déclaré : mieux vaut l'état vide
 * honnête qu'un gabarit inventé pour remplir la case.
 */
export function ApercuArticle({ profilId }: { profilId: string }) {
  const apercu = APERCUS_EDITORIAUX[profilId];
  if (!apercu) return null;

  return (
    <div className="mt-3">
      <p
        className="text-[8px] font-semibold uppercase leading-[11px] tracking-[0.06em]"
        style={{ color: "#777b7f" }}
      >
        {/* Sans genre : le profil est un journaliste, une journaliste ou une
            agence (« Ce qu'il écrit » au-dessus de Théodora, relecture du
            10/10). */}
        Ses articles pour vous
      </p>

      <p className="mt-[4px] text-[8px] leading-[11px]" style={{ color: "#3f4246" }}>
        {apercu.specialite}
      </p>
      <p className="mt-[2px] text-[7px] leading-[10px]" style={{ color: "#777b7f" }}>
        {apercu.refuse}
      </p>

      {/* Le gabarit, dessiné : c'est la forme qui distingue deux journalistes,
          pas le sujet, qui vient du produit de la marchande. */}
      <div
        className="mt-[6px] flex flex-col gap-[4px] rounded-[3px] bg-white p-[7px]"
        style={{ border: `1px solid ${FAINT}` }}
      >
        {apercu.blocs.map((bloc, i) => (
          <RenduBloc key={i} bloc={bloc} />
        ))}
      </div>

      <p className="mt-[4px] text-[7px] leading-[10px]" style={{ color: "#9aa0a6" }}>
        Gabarit, pas un article livré. {apercu.calibre}, un article par semaine.
      </p>
    </div>
  );
}
