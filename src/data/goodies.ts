/* Goodies personnalisés repris de events.lystes.ai/coquilliere-baptiste (06/11/2026).
   Aucun prix ici : les prix ne s'affichent que sur /tarifs. */
export type CategorieGoodie = "textile" | "gourdes" | "papeterie" | "bougies" | "high-tech" | "emballage";

export const CATEGORIES_GOODIES: { id: CategorieGoodie; nom: string }[] = [
  { id: "textile", nom: "Textile & sacs" },
  { id: "gourdes", nom: "Gourdes & tumblers" },
  { id: "papeterie", nom: "Papeterie" },
  { id: "bougies", nom: "Bougies" },
  { id: "high-tech", nom: "High-tech" },
  { id: "emballage", nom: "Emballage & cartes" },
];

export interface Coloris { nom: string; image: string | null }
export interface Goodie { nom: string; categorie: CategorieGoodie; image: string; coloris: Coloris[]; quantiteMin?: number }

const img = (chemin: string) => `https://cdn-pim.packhelp.com/assets/${chemin}?w=800&h=600&fit=min&auto=format`;

export const GOODIES: Goodie[] = [
  { nom: "T-shirt unisexe coton bio léger", categorie: "textile", image: img("693f50ea-7dc5-42a4-8923-6425ef17ec18/2563689-logo-custom-unisex-lightweight-organic-cotton-t-shirt-black-front") },
  { nom: "Sac en coton personnalisé", categorie: "textile", image: img("3b26a1da-342e-4721-9ca1-fcef27a17af9/719713-plain-tote-bag") },
  { nom: "Tumbler double paroi inox 1200 ml", categorie: "gourdes", image: img("eabb5496-1cb1-4987-9b61-ea739755be4d/838199-logo-custom-recycled-stainless-steel-double-wall-tumbler-1200-ml-black-0") },
  { nom: "Tumbler double paroi inox 510 ml personnalisé", categorie: "gourdes", image: img("6b1f76d4-0f33-407f-8123-55161dc79f03/470318-logo-custom-stainless-steel-double-wall-tumbler-510-ml-french-navy") },
  { nom: "Tumbler double paroi 300 ml personnalisé", categorie: "gourdes", image: img("6658e061-adb8-425c-b582-7b4d634ac541/1048351-logo-custom-double-wall-tumbler-300-ml-black-0") },
  { nom: "Bouteille inox recyclé avec mousqueton 1000 ml", categorie: "gourdes", image: img("59418c2a-860e-4bf5-b69d-68fc715517ea/984129-logo-custom-recycled-stainless-steel-single-wall-bottle-1000-ml-blue") },
  { nom: "Carnet A5 couverture rigide", categorie: "papeterie", image: img("fdce406e-a8cf-4073-9188-dcb1f805e876/324469-logo-custom-a-5-notebook-with-hard-cover-red-1") },
  { nom: "Carnet A5 couverture rigide liège", categorie: "papeterie", image: img("679f2c7d-0ab8-4890-bf90-5b3102b9a74b/4851685-logo-custom-a-5-notebook-with-hard-cork-cover-black-1") },
  { nom: "Carnet A5 couverture antibactérienne", categorie: "papeterie", image: img("19126c2e-87dd-4c9f-bfcb-380094906519/434708-logo-custom-a-5-notebook-with-antibacterial-cover") },
  { nom: "Stylo bouton poussoir", categorie: "papeterie", image: img("389d83f9-9fd5-4c71-9c13-5f9aeecc4e80/397766-logo-custom-push-button-pen-green-0") },
  { nom: "Stylo bille bambou", categorie: "papeterie", image: img("a1684806-83e0-4480-8ee8-abc30c7bfa7c/508562-logo-custom-bamboo-ballpoint-pen-1") },
  { nom: "Bougie cire végétale en verre dépoli 280 g", categorie: "bougies", image: img("32009ca4-433e-44f0-8fac-4c545282821e/1288101-logo-custom-plant-based-wax-candle-in-frosted-glass-280-g-burgundy-1") },
  { nom: "Bougie cire végétale en grès 200 g", categorie: "bougies", image: img("00bcc88c-6e21-45d2-bbe1-9c84578632e8/394590-logo-custom-plant-based-wax-candle-in-stoneware-200-g-1") },
  { nom: "Bougie cire végétale mèche en bois 80 g", categorie: "bougies", image: img("6cc0ce25-8123-4c79-b716-ccacbe61384a/1142279-logo-custom-plant-based-wax-candle-with-wooden-wick-80-g-brown-1") },
  { nom: "Bougie cire végétale en bambou 160 g", categorie: "bougies", image: img("ac16b6f7-d223-4259-b031-5907e4bcc591/1490630-logo-custom-plant-based-wax-candle-in-bamboo-160-g") },
  { nom: "Powerbank 4000 mAh 10 W", categorie: "high-tech", image: img("2cfb4c0e-065a-4ec0-98d6-81ed35642a0d/1984397-logo-custom-powerbank-4000-m-ah-10-w-dark-green-1") },
  { nom: "Sac cadeau personnalisé", categorie: "emballage", image: img("b24fcd9d-7863-4ee9-9a99-47516f911bed/607606-rigid-bag-2-1") },
  { nom: "Étiquettes rectangulaires personnalisées", categorie: "emballage", image: img("473ad522-b3da-457d-a871-4d44016c649b/404068-export") },
  { nom: "Carte « Thank You » personnalisée", categorie: "emballage", image: img("5c145850-fe8f-4226-8822-531b31e16e3c/686433-pp-gallery-thank-you-card-2") },
];
