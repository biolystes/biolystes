/* /nouveautes et /nos-soins (adresses cachées du catalogue, pour les messages
   envoyés aux prospectes ; /catalogue-complet-7q4m redirige vers /nouveautes).

   Exactement le même catalogue que /catalogue (mêmes produits, filtres et
   fiches : CatalogPage avec sansPrix), mais :
   - aucun prix nulle part (ni prix, ni €, ni remise, ni bouton d'achat) ;
   - pas de mot de passe ni de connexion ;
   - liées nulle part (ni menu, ni pied de page, ni sitemap) et non indexées
     (noindex, nofollow) ;
   - aucun en-tête : la page commence par la barre de filtres (JP, 27/10/2026) ;
   - en bas, un seul bouton « Parler à une experte » vers le WhatsApp de Cléa.

   Le cadre (en-tête du site, pied de page, polices, couleurs) est celui de
   CadrePied, comme /catalogue. */
import { Helmet } from "react-helmet-async";
import { MessageCircle } from "lucide-react";
import CatalogPage from "./CatalogPage";
import { LIEN_WHATSAPP_EXPERTE } from "@/lib/whatsapp";

export default function NouveautesPage() {
  return (
    <>
      <Helmet>
        <title>Catalogue — Biolystes</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <CatalogPage sansPrix />
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
