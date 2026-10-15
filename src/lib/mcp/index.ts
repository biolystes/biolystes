import { defineMcp } from "@lovable.dev/mcp-js";
import createProductSelection from "./tools/create-product-selection";
import getProductSelection from "./tools/get-product-selection";

export default defineMcp({
  name: "biolystes",
  title: "Biolystes",
  version: "0.1.0",
  instructions:
    "Outils Biolystes. Utilisez `create_product_selection` pour créer un lien public de sélection de produits (sans prix) à partager à une cliente, et `get_product_selection` pour relire une sélection existante.",
  tools: [createProductSelection, getProductSelection],
});
