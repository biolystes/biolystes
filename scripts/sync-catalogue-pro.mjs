#!/usr/bin/env node
/* Copie synchronisée du catalogue de biolystes.pro vers biolystes.com.

   JP, 14/10/2026 : biolystes.com/catalogue doit afficher exactement le
   catalogue de biolystes.pro (dépôt biolystes/commandcenterbiolystes,
   src/pages/CataloguePage.tsx) : mêmes produits, même nombre, prix HT,
   composition INCI, mêmes images. Une seule source : les données vivent dans
   biolystes.pro ; ce script les recopie ici à l'identique, jamais à la main.

   Ce qu'il écrit dans src/data/catalogue-pro/ :
   - products.ts            copie octet pour octet de src/data/products.ts
   - clean-image-map.json   copie octet pour octet de src/data/clean-image-map.json
   - images-approuvees.json les photos nettoyées « approved » de la table
                            clean_product_images de biolystes.pro (celles que
                            son catalogue affiche en premier), figées ici
   - source.json            l'empreinte de la copie : commit d'origine,
                            nombre de produits, empreinte des codes (slugs),
                            empreinte des photos approuvées et du composant
                            src/pages/CataloguePage.tsx de biolystes.pro

   Le composant n'est pas recopié tel quel (il porte les boutons du
   back-office) : src/pages/CatalogPage.tsx en est l'adaptation. Son empreinte
   sert d'alarme : si biolystes.pro change sa page (badge « Nouveau », filtre
   « Nouveautés »…), le test échoue tant que l'adaptation n'a pas suivi.

   Le test src/test/catalogue-pro.test.ts échoue si la copie est retouchée à
   la main ou si biolystes.pro a changé depuis la dernière synchronisation.

   Usage : node scripts/sync-catalogue-pro.mjs   (exige `gh` connecté au
   compte biolystes). */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEPOT,
  FICHIER_CARTE_IMAGES,
  FICHIER_COMPOSANT,
  FICHIER_PRODUITS,
  citeLeFournisseur,
  codesProduits,
  dernierCommit,
  lireFichier,
  lireImagesApprouvees,
  sha256,
} from "./catalogue-pro-commun.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CIBLE = path.join(RACINE, "src/data/catalogue-pro");

const commit = dernierCommit();
const produits = lireFichier(FICHIER_PRODUITS, commit);
const carteImages = lireFichier(FICHIER_CARTE_IMAGES, commit);
const composant = lireFichier(FICHIER_COMPOSANT, commit);
const imagesApprouvees = await lireImagesApprouvees(commit);

for (const [nom, texte] of [["products.ts", produits], ["clean-image-map.json", carteImages], ["images-approuvees.json", imagesApprouvees]]) {
  if (citeLeFournisseur(texte)) throw new Error(`${nom} cite le fournisseur : copie refusée.`);
}

const codes = codesProduits(produits);
if (codes.length === 0) throw new Error("Aucun produit lu dans products.ts : format inattendu.");
const nbImages = Object.keys(JSON.parse(imagesApprouvees)).length;

mkdirSync(CIBLE, { recursive: true });
writeFileSync(path.join(CIBLE, "products.ts"), produits);
writeFileSync(path.join(CIBLE, "clean-image-map.json"), carteImages);
writeFileSync(path.join(CIBLE, "images-approuvees.json"), imagesApprouvees);
writeFileSync(
  path.join(CIBLE, "source.json"),
  JSON.stringify(
    {
      depot: DEPOT,
      commit,
      fichier: FICHIER_PRODUITS,
      sha256: sha256(produits),
      nombre: codes.length,
      codes_sha256: sha256(codes.join("\n")),
      carte_images_sha256: sha256(carteImages),
      images_approuvees: nbImages,
      images_sha256: sha256(imagesApprouvees),
      composant: FICHIER_COMPOSANT,
      composant_sha256: sha256(composant),
    },
    null,
    2,
  ) + "\n",
);
console.log(`Catalogue biolystes.pro (${commit.slice(0, 7)}) : ${codes.length} produits, ${nbImages} photos approuvées.`);
