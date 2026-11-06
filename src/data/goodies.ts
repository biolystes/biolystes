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

/* Une entrée par variante (produit × coloris), chacune avec sa propre photo de rendu. */
export interface Goodie { nom: string; coloris: string | null; categorie: CategorieGoodie; image: string }

export const GOODIES: Goodie[] = [
 {
  "nom": "Sac en coton personnalisé",
  "coloris": "Beige",
  "categorie": "textile",
  "image": "https://cdn-pim.packhelp.com/assets/3b26a1da-342e-4721-9ca1-fcef27a17af9/719713-plain-tote-bag?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Sac en coton personnalisé",
  "coloris": "Gris",
  "categorie": "textile",
  "image": "https://cdn-pim.packhelp.com/assets/00d6b4b1-4179-4722-8a7a-3ac8f9382b3b/1145526-pp-plain-drawstring-bag?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "T-shirt unisexe coton bio léger",
  "coloris": "Blanc",
  "categorie": "textile",
  "image": "https://cdn-pim.packhelp.com/assets/300329b0-0838-4b2e-b846-6b81d965eb28/430070-logo-custom-unisex-lightweight-organic-cotton-t-shirt-white-front?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "T-shirt unisexe coton bio léger",
  "coloris": "Noir",
  "categorie": "textile",
  "image": "https://cdn-pim.packhelp.com/assets/693f50ea-7dc5-42a4-8923-6425ef17ec18/2563689-logo-custom-unisex-lightweight-organic-cotton-t-shirt-black-front?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "T-shirt unisexe coton bio léger",
  "coloris": "Bleu marine",
  "categorie": "textile",
  "image": "https://cdn-pim.packhelp.com/assets/75d3f8c4-55ea-4c88-8413-956b1a1b6d96/3129693-logo-custom-unisex-lightweight-organic-cotton-t-shirt-french-navy-front?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "T-shirt unisexe coton bio léger",
  "coloris": "Gris chiné",
  "categorie": "textile",
  "image": "https://cdn-pim.packhelp.com/assets/a85b6084-b37c-408f-b2c3-14de7d12b70b/1815388-logo-custom-unisex-lightweight-organic-cotton-t-shirt-heather-grey-front?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "T-shirt unisexe coton bio léger",
  "coloris": "Anthracite",
  "categorie": "textile",
  "image": "https://cdn-pim.packhelp.com/assets/f1c7b533-daa5-4b18-96a3-a2c95fa38174/2398844-logo-custom-unisex-lightweight-organic-cotton-t-shirt-anthracite-front?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Tumbler double paroi inox recyclé 1200 ml",
  "coloris": "Blanc",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/07277fa2-d824-46d2-b881-fd40e09592f0/1126745-logo-custom-recycled-stainless-steel-double-wall-tumbler-1200-ml-white-3?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Tumbler double paroi inox recyclé 1200 ml",
  "coloris": "Bleu marine",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/0dc549d9-1046-4b1e-bb9c-02fef489ac8c/885141-logo-custom-recycled-stainless-steel-double-wall-tumbler-1200-ml-french-navy-0?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Tumbler double paroi inox recyclé 1200 ml",
  "coloris": "Noir",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/4e48b313-adc1-406f-886b-7fddf225b0dc/818115-logo-custom-recycled-stainless-steel-double-wall-tumbler-1200-ml-black-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Tumbler double paroi inox recyclé 1200 ml",
  "coloris": "Gris",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/646f1f52-602d-49a9-bd72-6a902fecc1f7/1097786-logo-custom-recycled-stainless-steel-double-wall-tumbler-1200-ml-grey-0?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Tumbler double paroi inox 510 ml",
  "coloris": "Noir",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/15775fbd-8a9b-4b10-9b60-ead877a7d128/908524-logo-custom-stainless-steel-double-wall-tumbler-510-ml-black?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Tumbler double paroi inox 510 ml",
  "coloris": "Argent mat",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/227e82f1-e1e8-40ec-a52f-6078fb0b6199/1579579-logo-custom-stainless-steel-double-wall-tumbler-510-ml-matt-silver-3?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Tumbler double paroi inox 510 ml",
  "coloris": "Blanc",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/3cd50905-1106-4b79-a144-c082b72c6905/646590-logo-custom-stainless-steel-double-wall-tumbler-510-ml-white?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Tumbler double paroi inox 510 ml",
  "coloris": "Bleu marine",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/49d206c6-11fc-4750-b607-3c665df8f2a2/470318-logo-custom-stainless-steel-double-wall-tumbler-510-ml-french-navy?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Tumbler double paroi inox 510 ml",
  "coloris": "Beige",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/6f1532c3-5f5e-40db-af2c-85d04280dd2f/830543-logo-custom-stainless-steel-double-wall-tumbler-510-ml-beige?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Tumbler double paroi 300 ml",
  "coloris": "Blanc",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/446fd1c6-3a25-49cd-9085-96ac1ffb649b/749336-logo-custom-double-wall-tumbler-300-ml-white-0?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Tumbler double paroi 300 ml",
  "coloris": "Noir",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/6658e061-adb8-425c-b582-7b4d634ac541/1048351-logo-custom-double-wall-tumbler-300-ml-black-0?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Tumbler double paroi 300 ml",
  "coloris": "Beige",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/8f2fd3d7-ba2c-4661-b5c7-5f490f627c82/1665347-logo-custom-double-wall-tumbler-300-ml-beige-0-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bouteille inox recyclé avec mousqueton 1000 ml",
  "coloris": "Blanc",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/013158bc-f92e-43ae-be04-303e4e052c82/901371-logo-custom-recycled-stainless-steel-single-wall-bottle-1000-ml-white?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bouteille inox recyclé avec mousqueton 1000 ml",
  "coloris": "Argent mat",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/0e4b099d-0fa7-4746-997f-aec21c87f8df/1143608-logo-custom-recycled-stainless-steel-single-wall-bottle-1000-ml-matt-silver?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bouteille inox recyclé avec mousqueton 1000 ml",
  "coloris": "Rouge",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/11b03d9f-4870-4378-94c0-dbc8a78a3af0/1016413-logo-custom-recycled-stainless-steel-single-wall-bottle-1000-ml-red?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bouteille inox recyclé avec mousqueton 1000 ml",
  "coloris": "Noir",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/31d16b81-f359-4d85-bbc9-32c61f64286f/730631-logo-custom-recycled-stainless-steel-single-wall-bottle-1000-ml-black?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bouteille inox recyclé avec mousqueton 1000 ml",
  "coloris": "Orange",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/45d69351-09db-4489-a67e-34d5715199bc/1108494-logo-custom-recycled-stainless-steel-single-wall-bottle-1000-ml-orange?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bouteille inox recyclé avec mousqueton 1000 ml",
  "coloris": "Vert",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/4d7fc751-ecdd-4d93-b0ca-bc6ae47824e3/1123599-logo-custom-recycled-stainless-steel-single-wall-bottle-1000-ml-green?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bouteille inox recyclé avec mousqueton 1000 ml",
  "coloris": "Bleu",
  "categorie": "gourdes",
  "image": "https://cdn-pim.packhelp.com/assets/59418c2a-860e-4bf5-b69d-68fc715517ea/984129-logo-custom-recycled-stainless-steel-single-wall-bottle-1000-ml-blue?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carnet A5 couverture rigide",
  "coloris": "Blanc",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/06b96ffb-e554-48f1-8483-e5b1b733d61f/678437-logo-custom-a-5-notebook-with-hard-cover-white-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carnet A5 couverture rigide",
  "coloris": "Vert citron",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/29368527-3ee7-4476-8849-57ea50b9db21/776260-logo-custom-a-5-notebook-with-hard-cover-lime-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carnet A5 couverture rigide",
  "coloris": "Bleu pétrole",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/341edb9e-dc25-4380-b712-beb9a7e318b9/2325500-logo-custom-a-5-notebook-with-hard-cover-petrol-3?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carnet A5 couverture rigide",
  "coloris": "Rouge",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/41083a27-2beb-46fd-a973-49c05a92d161/324469-logo-custom-a-5-notebook-with-hard-cover-red-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carnet A5 couverture rigide",
  "coloris": "Gris pierre",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/48a8b3bd-afff-4d4c-a65e-e59a67e50f73/260841-logo-custom-a-5-notebook-with-hard-cover-stone-grey-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carnet A5 couverture rigide",
  "coloris": "Noir",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/749c6394-5bcd-4358-8d0d-676cc90f03ac/168582-logo-custom-a-5-notebook-with-hard-cover-black-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carnet A5 couverture rigide",
  "coloris": "Rose pâle",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/76d1fe83-7131-41ed-bef2-3d4f0bed3988/467522-logo-custom-a-5-notebook-with-hard-cover-baby-pink-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carnet A5 couverture rigide",
  "coloris": "Orange",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/ca7a6eb0-7cdb-4212-9e53-3da8f91798e4/983835-logo-custom-a-5-notebook-with-hard-cover-orange-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carnet A5 couverture rigide",
  "coloris": "Bleu",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/d6e08e0b-9156-4945-824e-76577fa7145b/356365-logo-custom-a-5-notebook-with-hard-cover-blue-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carnet A5 couverture rigide liège",
  "coloris": "Blanc",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/1ff570eb-72f3-432d-9536-a5e81ba1af28/3360096-logo-custom-a-5-notebook-with-hard-cork-cover-white-2?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carnet A5 couverture rigide liège",
  "coloris": "Noir",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/3d50d8b0-3d18-4a36-a13f-abc182d7f647/2944598-logo-custom-a-5-notebook-with-hard-cork-cover-black-3?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carnet A5 couverture antibactérienne",
  "coloris": null,
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/19126c2e-87dd-4c9f-bfcb-380094906519/434708-logo-custom-a-5-notebook-with-antibacterial-cover?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Stylo bouton poussoir",
  "coloris": "Rouge",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/0423fde6-0d98-4f2b-bf02-d0caed3f2898/348493-logo-custom-push-button-pen-red-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Stylo bouton poussoir",
  "coloris": "Beige",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/10eb8bc6-dab2-4788-8560-72b2c5c2f892/404105-logo-custom-push-button-pen-beige-0?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Stylo bouton poussoir",
  "coloris": "Bleu",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/1bccd5fc-2fb8-4a7c-85a9-ea25ece6dd20/318608-logo-custom-push-button-pen-blue-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Stylo bouton poussoir",
  "coloris": "Vert",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/389d83f9-9fd5-4c71-9c13-5f9aeecc4e80/397766-logo-custom-push-button-pen-green-0?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Stylo bouton poussoir",
  "coloris": "Orange",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/608dd5f8-9f87-4590-84f6-99e695e7af70/417292-logo-custom-push-button-pen-orange-0?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Stylo bouton poussoir",
  "coloris": "Noir",
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/ab052b34-7e94-46fd-8a0a-197a8ce5a562/248028-logo-custom-push-button-pen-black-0?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Stylo bille bambou",
  "coloris": null,
  "categorie": "papeterie",
  "image": "https://cdn-pim.packhelp.com/assets/0c0e7d07-6c01-4c74-9636-2ac4688cd653/508562-logo-custom-bamboo-ballpoint-pen-4?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bougie cire végétale verre dépoli 280 g",
  "coloris": "Blanc",
  "categorie": "bougies",
  "image": "https://cdn-pim.packhelp.com/assets/0efe5f5f-6362-40d3-919a-d412a06bfa1f/1628889-logo-custom-plant-based-wax-candle-in-frosted-glass-280-g-white-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bougie cire végétale verre dépoli 280 g",
  "coloris": "Bourgogne",
  "categorie": "bougies",
  "image": "https://cdn-pim.packhelp.com/assets/0fc51ccc-1883-40e9-9ece-f7f1b456c116/1288101-logo-custom-plant-based-wax-candle-in-frosted-glass-280-g-burgundy-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bougie cire végétale verre dépoli 280 g",
  "coloris": "Noir",
  "categorie": "bougies",
  "image": "https://cdn-pim.packhelp.com/assets/37c8826f-85e4-4e1f-8b40-17efde2729d6/1075018-logo-custom-plant-based-wax-candle-in-frosted-glass-280-g-black-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bougie cire végétale en grès 200 g",
  "coloris": null,
  "categorie": "bougies",
  "image": "https://cdn-pim.packhelp.com/assets/00bcc88c-6e21-45d2-bbe1-9c84578632e8/394590-logo-custom-plant-based-wax-candle-in-stoneware-200-g-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bougie cire végétale mèche en bois 80 g",
  "coloris": "Bleu",
  "categorie": "bougies",
  "image": "https://cdn-pim.packhelp.com/assets/0cac1bdf-d58a-48f3-b252-a6d65f77023b/1318654-logo-custom-plant-based-wax-candle-with-wooden-wick-80-g-blue-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bougie cire végétale mèche en bois 80 g",
  "coloris": "Noir",
  "categorie": "bougies",
  "image": "https://cdn-pim.packhelp.com/assets/0f532ba1-488e-4e50-b345-c42b08b04fff/872702-logo-custom-plant-based-wax-candle-with-wooden-wick-80-g-black-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bougie cire végétale mèche en bois 80 g",
  "coloris": "Vert",
  "categorie": "bougies",
  "image": "https://cdn-pim.packhelp.com/assets/1a1d0bca-c4e4-4b89-ac2b-109374c08dfa/1390304-logo-custom-plant-based-wax-candle-with-wooden-wick-80-g-green-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bougie cire végétale mèche en bois 80 g",
  "coloris": "Bourgogne",
  "categorie": "bougies",
  "image": "https://cdn-pim.packhelp.com/assets/32f1d9da-8850-49e7-9c7c-e3f08c51205b/1282002-logo-custom-plant-based-wax-candle-with-wooden-wick-80-g-burgundy-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bougie cire végétale mèche en bois 80 g",
  "coloris": "Blanc",
  "categorie": "bougies",
  "image": "https://cdn-pim.packhelp.com/assets/4c08fb8d-597a-4c22-a282-059df601fef4/1054551-logo-custom-plant-based-wax-candle-with-wooden-wick-80-g-white-2?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bougie cire végétale mèche en bois 80 g",
  "coloris": "Marron",
  "categorie": "bougies",
  "image": "https://cdn-pim.packhelp.com/assets/6cc0ce25-8123-4c79-b716-ccacbe61384a/1142279-logo-custom-plant-based-wax-candle-with-wooden-wick-80-g-brown-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Bougie cire végétale en bambou 160 g",
  "coloris": null,
  "categorie": "bougies",
  "image": "https://cdn-pim.packhelp.com/assets/ac16b6f7-d223-4259-b031-5907e4bcc591/1490630-logo-custom-plant-based-wax-candle-in-bamboo-160-g?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Powerbank 4000 mAh 10 W",
  "coloris": "Rouge",
  "categorie": "high-tech",
  "image": "https://cdn-pim.packhelp.com/assets/0077fe0d-bfc2-4cac-9242-1b8415e66657/465863-logo-custom-powerbank-4000-m-ah-10-w-red-3?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Powerbank 4000 mAh 10 W",
  "coloris": "Bleu roi",
  "categorie": "high-tech",
  "image": "https://cdn-pim.packhelp.com/assets/012903fa-9d8d-41dc-8559-fb6586418bc7/2286339-logo-custom-powerbank-4000-m-ah-10-w-royal-blue-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Powerbank 4000 mAh 10 W",
  "coloris": "Argent mat",
  "categorie": "high-tech",
  "image": "https://cdn-pim.packhelp.com/assets/1e240117-2b52-49ee-a59c-0c9fe0ea4327/175651-logo-custom-powerbank-4000-m-ah-10-w-matt-silver-4?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Powerbank 4000 mAh 10 W",
  "coloris": "Vert foncé",
  "categorie": "high-tech",
  "image": "https://cdn-pim.packhelp.com/assets/1e7d2392-a4c5-4d89-bf75-a44ea6e2468a/1984397-logo-custom-powerbank-4000-m-ah-10-w-dark-green-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Powerbank 4000 mAh 10 W",
  "coloris": "Orange",
  "categorie": "high-tech",
  "image": "https://cdn-pim.packhelp.com/assets/47ad98e7-a924-4773-baaf-59acfc2bc4e7/2901345-logo-custom-powerbank-4000-m-ah-10-w-orange-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Powerbank 4000 mAh 10 W",
  "coloris": "Noir",
  "categorie": "high-tech",
  "image": "https://cdn-pim.packhelp.com/assets/6da1490c-b29a-4d1f-96b3-84c2ec7280ba/723083-logo-custom-powerbank-4000-m-ah-10-w-black-2?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Sac cadeau personnalisé",
  "coloris": "Blanc",
  "categorie": "emballage",
  "image": "https://cdn-pim.packhelp.com/assets/b24fcd9d-7863-4ee9-9a99-47516f911bed/607606-rigid-bag-2-1?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Étiquettes rectangulaires personnalisées",
  "coloris": null,
  "categorie": "emballage",
  "image": "https://cdn-pim.packhelp.com/assets/473ad522-b3da-457d-a871-4d44016c649b/404068-export?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carte « Thank You » personnalisée",
  "coloris": "Kraft",
  "categorie": "emballage",
  "image": "https://cdn-pim.packhelp.com/assets/3b1d0aa3-2fce-4fcc-aa72-3714f920c72d/329392-outside-kraft?w=800&h=600&fit=min&auto=format"
 },
 {
  "nom": "Carte « Thank You » personnalisée",
  "coloris": "Blanc",
  "categorie": "emballage",
  "image": "https://cdn-pim.packhelp.com/assets/3cfbe089-80c8-49ee-acd0-82b7ade0e789/122950-outside-white?w=800&h=600&fit=min&auto=format"
 }
];
