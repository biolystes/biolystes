/* /avis : tous les avis des anciennes clientes de Biolystes (JP, 21/10/2026),
   l'avis audio d'une ancienne cliente en tête, puis les six avis écrits.
   La même section que sur l'accueil et sur /tarifs (src/components/
   TemoignagesClientes.tsx). Cadre, en-tête et pied de page :
   src/pages/pied/CadrePied.tsx. Aucun prix, aucune étoile, aucune note. */
import SEO from "@/components/SEO";
import TemoignagesClientes from "@/components/avis/TemoignagesClientes";
import { Bande, BoutonRdv, Entete } from "./pied/elements";

const INSECABLE = " ";

export default function AvisPage() {
  return (
    <>
      <SEO
        title="Avis des clientes | Biolystes"
        description="Les avis d’anciennes clientes de Biolystes : leurs premiers mois, leurs premières ventes, et un avis audio."
        path="/avis"
      />
      <TemoignagesClientes niveau={1} />
      <Bande gris>
        <div className="max-w-[48rem] mx-auto px-[1.25rem] md:px-[1.5rem]">
          <Entete surtitre="Votre projet" noir="On en parle" gris={"en" + INSECABLE + "rendez-vous."}
            texte="Nous choisissons ensemble le pack, les produits et l’échéancier." />
          <BoutonRdv className="mt-8" />
        </div>
      </Bande>
    </>
  );
}
