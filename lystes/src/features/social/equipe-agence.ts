import type { MembreAgenceSociale } from "./types-agence";

/* Portraits UGC déjà présents dans le dépôt : aucune génération d'image n'est
   nécessaire pour illustrer l'équipe. Ce sont des portraits illustratifs, pas
   des collaborateurs réels.

   15/09/2026 (JP) : « tu ne mets pas les enfants comme photo de profil ».

   DIX DES QUATORZE PORTRAITS ÉTAIENT DES ENFANTS, mesuré en REGARDANT les
   images et non en lisant les noms de fichiers. Théo, community manager
   LinkedIn, est un adolescent. Valentina, « responsable connaissance client »,
   a une dizaine d'années. Une équipe illustrée par des enfants ne se présente
   pas à une cliente.

   LE POINT QUI COMPLIQUE, et qu'on ne masque pas : le dépôt ne contient AUCUN
   portrait d'homme adulte. Les trois seuls visages masculins du lot sont ceux
   de trois garçons. Poser un visage de femme sur « Théo » serait un second
   mensonge, pas une correction : les trois membres masculins sont donc
   renommés. C'est défendable ici, la clientèle de la boutique est féminine à
   98 pour cent, chiffre lu dans son propre écran de contexte cliente.

   Les CLÉS techniques ne bougent pas, `cm-linkedin`, `cm-x`, `ugc-3` : le jour
   où des portraits d'hommes adultes existeront, le retour en arrière ne coûte
   qu'un import. */
import portraitAmara from "@lystes/assets/ugc-profile-amara.jpeg";
import portraitAicha from "@lystes/assets/ugc-avatar-aisha.jpeg";
import portraitKenza from "@lystes/assets/ugc-profile-kenza.jpeg";
import portraitJasmine from "@lystes/assets/ugc-profile-jasmine.jpeg";
import portraitKeisha from "@lystes/assets/ugc-profile-keisha.jpeg";
import portraitAliyah from "@lystes/assets/ugc-profile-aliyah.jpeg";
import portraitNyla from "@lystes/assets/ugc-profile-nyla.jpeg";
import portraitDenise from "@lystes/assets/ugc-profile-denise.jpeg";
import portraitImani from "@lystes/assets/ugc-profile-imani.jpeg";
import portraitLiya from "@lystes/assets/ugc-profile-liya.jpeg";
import portraitLex from "@lystes/assets/ugc-profile-lex.jpeg";
import portraitTiana from "@lystes/assets/ugc-profile-tiana.jpeg";
import portraitNaomi from "@lystes/assets/ugc-avatar-naomi.jpeg";
import portraitFatoumata from "@lystes/assets/ugc-profile-fatoumata.jpeg";

/* Un community manager par réseau : chaque réseau a son responsable nommé,
   aucun regroupement de deux plateformes sur une même personne. */
const roles = [
  ["cm-instagram", "Amara", portraitAmara, "Community Manager Instagram", "Social Media", "Pilote les posts, Stories et Reels Instagram.", ["Instagram"]],
  ["cm-facebook", "Aïcha", portraitAicha, "Community Manager Facebook", "Social Media", "Anime la page et les conversations Facebook.", ["Facebook"]],
  ["cm-tiktok", "Kenza", portraitKenza, "Community Manager TikTok", "Social Media", "Programme et publie les vidéos TikTok.", ["TikTok"]],
  ["cm-linkedin", "Théo", portraitKeisha, "Community Manager LinkedIn", "Social Media", "Construit les prises de parole professionnelles.", ["LinkedIn"]],
  ["cm-x", "Nyla", portraitNyla, "Community Manager X", "Social Media", "Écrit les posts courts et les fils sur X.", ["X"]],
  ["cm-snapchat", "Jasmine", portraitJasmine, "Community Manager Snapchat", "Social Media", "Tient les Snaps et la présence quotidienne.", ["Snapchat"]],
  ["cm-pinterest", "Denise", portraitDenise, "Community Manager Pinterest", "Social Media", "Organise les tableaux et les épingles produit.", ["Pinterest"]],
  ["ugc-manager", "Aliyah", portraitAliyah, "Responsable UGC", "UGC", "Coordonne les briefs et valide les contenus UGC.", ["TikTok", "Reels"]],
  ["ugc-1", "Imani", portraitImani, "Créatrice UGC", "UGC", "Produit des démonstrations produit naturelles.", ["TikTok", "Reels"]],
  ["ugc-2", "Salomé", portraitLiya, "Créatrice UGC", "UGC", "Produit des témoignages et routines d’usage.", ["Stories", "TikTok"]],
  ["ugc-3", "Lex", portraitLex, "Créateur UGC", "UGC", "Produit des tests et comparatifs produit.", ["TikTok", "Instagram"]],
  ["ugc-4", "Tiana", portraitTiana, "Créatrice UGC", "UGC", "Produit des tutoriels courts et incarnés.", ["Reels", "Stories"]],
  ["photo", "Naomi", portraitNaomi, "Photographe", "Production photo", "Garantit les références, cadrages et formats.", ["Tous formats"]],
  ["avatar", "Fatoumata", portraitFatoumata, "Responsable connaissance client", "Connaissance client", "Transforme préoccupations et objections en angles éditoriaux.", ["Avatar client"]],
] as const;

export function equipeAgenceParDefaut(nomDirection: string, avatarDirection?: string | null): MembreAgenceSociale[] {
  const direction: MembreAgenceSociale = {
    cle: "direction",
    nom: nomDirection,
    role: "Direction d’agence",
    pole: "Direction",
    mission: "Coordonne la stratégie, les produits de la semaine et la validation finale.",
    reseaux: ["Tous réseaux"],
    avatar: avatarDirection ?? null,
  };

  return [
    direction,
    ...roles.map(([cle, nom, avatar, role, pole, mission, reseaux]) => ({
      cle,
      nom,
      role,
      pole,
      mission,
      reseaux: [...reseaux],
      avatar,
      parent: cle.startsWith("ugc-") && cle !== "ugc-manager" ? "ugc-manager" : "direction",
    } as MembreAgenceSociale)),
  ];
}
