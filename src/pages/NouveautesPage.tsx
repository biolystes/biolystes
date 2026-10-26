/* /nouveautes (26/10/2026) : adresse cachée du catalogue, pour les messages de
   relance — c'est l'adresse principale, à donner aux prospects.
   /catalogue-complet-7q4m y redirige.

   Exactement le même catalogue que /catalogue (mêmes produits, catégories,
   filtres et fiches — CatalogPage avec `sansPrix`), mais :
   - aucun prix nulle part (ni prix, ni €, ni remise, ni bouton d'achat) ;
   - pas de mot de passe ni de connexion ;
   - liée nulle part (ni menu, ni pied de page, ni sitemap) et non indexée
     (noindex, nofollow) ;
   - une accroche en tête, dans l'identité du site (Entete, comme les autres
     pages), dont le nombre est le vrai nombre de fiches du catalogue,
     calculé automatiquement — aucune promesse de délai ;
   - en bas, un seul bouton « Parler à une experte » vers le WhatsApp de Cléa.

   Le cadre (en-tête, pied de page, polices, couleurs) est celui de CadrePied,
   comme /catalogue. */
import { Helmet } from "react-helmet-async";
import { MessageCircle } from "lucide-react";
import CatalogPage from "./CatalogPage";
import { PRODUCTS } from "@/data/catalogue-pro/products";
import { Entete } from "./pied/elements";
import { LIEN_WHATSAPP_EXPERTE } from "@/lib/whatsapp";

/* Le nombre de l'accroche, calculé sur le vrai catalogue : « Près de 300 »
   quand on approche la centaine suivante (à moins de 10 fiches), sinon
   « Plus de » la centaine inférieure — jamais un nombre surestimé. */
export function accrocheNombre(n: number): string {
  const centaine = Math.floor(n / 100) * 100;
  return n >= centaine + 90 ? `Près de ${centaine + 100}` : `Plus de ${centaine}`;
}

export default function NouveautesPage() {
  return (
    <>
      <Helmet>
        <title>Nouveautés — Biolystes</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <section className="bg-background pt-10 md:pt-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Entete
            niveau={1}
            surtitre="Catalogue"
            noir={`${accrocheNombre(PRODUCTS.length)} soins et maquillages`}
            gris="à créer à votre marque."
            texte="Nouveautés en maquillage, soins capillaires et gamme bain. Choisissez vos produits, nous créons votre marque."
          />
        </div>
      </section>
      <CatalogPage sansPrix sansEntete />
      <div className="bg-background pb-16 md:pb-20 -mt-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-center">
          <a
            href={LIEN_WHATSAPP_EXPERTE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "rgb(29,29,31)", color: "#ffffff" }}
          >
            <MessageCircle className="w-4 h-4" /> Parler à une experte
          </a>
        </div>
      </div>
    </>
  );
}
