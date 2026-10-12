import JSZip from "jszip";
import type { PlateformeEditoriale } from "@lystes/components/mygpt/editorial-formats";
import { CONFIG_PLATEFORME } from "@lystes/components/mygpt/editorial-formats";

/**
 * TÉLÉCHARGER L'IMAGE ET LE TEXTE, POUR LE JOUR OU POUR LA SEMAINE.
 *
 * 14/09/2026 (JP) : « que ce soit facile de télécharger l'image, le wording,
 * pour le jour même, pour le reste de la semaine ». Une archive, un dossier
 * par jour, un fichier image et un fichier texte par publication, plus un
 * récapitulatif. Une publication sans image n'est pas omise en silence : elle
 * est listée comme manquante.
 */

export interface PublicationTelechargeable {
  jour: number;
  jourLibelle: string;
  plateforme: PlateformeEditoriale;
  index: number;
  produit?: string | null;
  imageUrl?: string | null;
  legende?: string;
  hashtags?: string[];
  appelAction?: string;
  texteImage?: string;
  prompt?: string;
}

function extension(url: string): string {
  const propre = url.split("?")[0];
  const trouvee = propre.match(/\.(jpe?g|png|webp|gif)$/i)?.[1];
  return trouvee ? trouvee.toLowerCase() : "jpg";
}

function nomFichier(publication: PublicationTelechargeable): string {
  const reseau = CONFIG_PLATEFORME[publication.plateforme].court.replace(/[^\w-]/g, "");
  return `${String(publication.index + 1).padStart(2, "0")}-${reseau}`;
}

function bloqueTexte(publication: PublicationTelechargeable): string {
  const lignes = [
    `Jour : ${publication.jourLibelle}`,
    `Réseau : ${CONFIG_PLATEFORME[publication.plateforme].libelle}`,
    `Produit : ${publication.produit || "non affecté"}`,
    "",
    "LÉGENDE",
    publication.legende?.trim() || "(à générer)",
    "",
    "HASHTAGS",
    publication.hashtags?.length ? publication.hashtags.join(" ") : "(à générer)",
    "",
    "APPEL À L’ACTION",
    publication.appelAction?.trim() || "(à générer)",
  ];
  if (publication.texteImage?.trim()) {
    lignes.push("", "TEXTE DANS L’IMAGE", publication.texteImage.trim());
  }
  if (publication.prompt?.trim()) {
    lignes.push("", "PROMPT EXACT DE L’IMAGE", publication.prompt.trim());
  }
  return lignes.join("\n");
}

function echapper(valeur: string): string {
  return `"${valeur.replace(/"/g, '""')}"`;
}

/**
 * Construit l'archive et déclenche le téléchargement. Renvoie le nombre de
 * publications écrites et celles dont l'image manquait.
 */
export async function telechargerPublications(
  publications: PublicationTelechargeable[],
  nomArchive: string,
): Promise<{ total: number; sansImage: number }> {
  const zip = new JSZip();
  const csv: string[] = ["Jour;Réseau;Produit;Légende;Hashtags;Appel à l’action;Image"];
  let sansImage = 0;

  for (const publication of publications) {
    const dossier = zip.folder(publication.jourLibelle) ?? zip;
    const base = nomFichier(publication);
    dossier.file(`${base}.txt`, bloqueTexte(publication));

    let etatImage = "manquante";
    if (publication.imageUrl) {
      try {
        const reponse = await fetch(publication.imageUrl);
        if (!reponse.ok) throw new Error(String(reponse.status));
        dossier.file(`${base}.${extension(publication.imageUrl)}`, await reponse.blob());
        etatImage = "incluse";
      } catch {
        etatImage = "non téléchargeable";
      }
    }
    if (etatImage !== "incluse") sansImage += 1;

    csv.push([
      publication.jourLibelle,
      CONFIG_PLATEFORME[publication.plateforme].libelle,
      publication.produit || "",
      publication.legende?.replace(/\n/g, " ") || "",
      publication.hashtags?.join(" ") || "",
      publication.appelAction || "",
      etatImage,
    ].map(echapper).join(";"));
  }

  zip.file("planning.csv", `\uFEFF${csv.join("\n")}`);

  const archive = await zip.generateAsync({ type: "blob" });
  const lien = document.createElement("a");
  lien.href = URL.createObjectURL(archive);
  lien.download = `${nomArchive}.zip`;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  URL.revokeObjectURL(lien.href);

  return { total: publications.length, sansImage };
}
