/* /standard-de-beaute-propre : le standard que Biolystes applique à chaque
   formule du catalogue (JP, 13/11/2026 : « deux pages sur biolystes.com, dans le
   menu »). Cadre, en-tête et pied de page : src/pages/pied/CadrePied.tsx. Pièces
   communes : src/pages/pied/cartes-standard.tsx.

   Règles tenues ici :
   - aucun nom de laboratoire, aucun prix ;
   - ne figurent que les exclusions VÉRIFIÉES sur la liste INCI de chaque produit
     du catalogue : parabènes, silicones, SLS et SLES, microplastiques, donneurs
     de formaldéhyde, isothiazolinones, BHA et BHT, huiles minérales. Celles qui
     ne tiennent pas pour tous les produits (PEG et dérivés, colorants de
     synthèse, phénoxyéthanol, « sans sulfates ») ne sont pas annoncées ;
   - « végan » : la grande majorité des formules, jamais « toutes » ;
   - le test src/test/pages-standard-propre.test.ts garde ces règles ;
   - plan et sujets seulement : aucun texte repris d'une page d'un tiers. */
import {
  Ban, ClipboardCheck, ListChecks, PawPrint, Percent, SprayCan, Vegan,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { BoutonRdv, Entete } from "./pied/elements";
import { Carte, Cartes, Chiffre, Zone } from "./pied/cartes-standard";
import { t } from "@/lib/typographie-fr";

const SEO_DESCRIPTION =
  "Parabènes, silicones, SLS et SLES, microplastiques : huit familles d’ingrédients écartées de chaque formule du catalogue, et le cadre réglementaire européen.";

export default function StandardBeautePropre() {
  return (
    <>
      <SEO
        title="Notre standard de beauté propre | Biolystes"
        description={SEO_DESCRIPTION}
        path="/standard-de-beaute-propre"
      />

      {/* ═══ HAUT DE PAGE ═══ */}
      <section className="bg-background pt-12 md:pt-20 pb-10 md:pb-12 px-[1.25rem] md:px-[1.5rem]">
        <Entete niveau={1} surtitre="Standard de beauté propre"
          noir="Un standard clair" gris="pour une beauté propre."
          texte={t("Chaque formule du catalogue suit le même socle : le règlement cosmétique européen, huit familles d’ingrédients écartées après vérification des listes INCI, et des certifications que vous pouvez montrer à vos clientes.")} />
      </section>

      {/* ═══ LE SOCLE EN TROIS REPÈRES ═══ */}
      <Zone gris>
        <div className="grid gap-4 md:grid-cols-3">
          <Chiffre valeur="COSMOS" texte="La plupart des formules sont certifiées COSMOS Natural ou COSMOS Organic par Ecocert." />
          <Chiffre valeur="8" texte="familles d’ingrédients écartées de chaque formule du catalogue." />
          <Chiffre valeur="0" texte="test sur les animaux : ils sont interdits en Europe pour les cosmétiques et leurs ingrédients." />
        </div>
      </Zone>

      {/* ═══ LE CADRE EUROPÉEN ═══ */}
      <Zone>
        <Entete className="mb-8 md:mb-10" surtitre="Le cadre" noir="Le règlement européen"
          gris={"comme point de départ."} aLaLigne={false} />
        <Cartes colonnes={4}>
          <Carte icone={Ban} titre="Substances bannies"
            texte="Plus d’un millier de substances sont interdites dans les cosmétiques en Europe (annexe II du règlement CE n° 1223/2009)." />
          <Carte icone={ListChecks} titre="Usages encadrés"
            texte="Plusieurs centaines d’autres ne sont autorisées que sous conditions : dose maximale, type de produit, mentions obligatoires." />
          <Carte icone={ClipboardCheck} titre="Sécurité évaluée"
            texte="Chaque formule est évaluée par un professionnel qualifié avant sa mise sur le marché, et une Personne Responsable est établie dans l’Union européenne." />
          <Carte icone={PawPrint} titre="Aucun test sur les animaux"
            texte="Ils sont interdits pour les produits finis comme pour leurs ingrédients." />
        </Cartes>
        <p className="mt-8 md:mt-10 max-w-2xl mx-auto text-center text-[0.9375rem] md:text-base text-foreground/80 leading-[1.75] text-pretty">
          {t("Ce cadre fixe un minimum. Notre standard écarte en plus des ingrédients que la loi autorise, listés ci-dessous.")}
        </p>
      </Zone>

      {/* ═══ CE QUE NOUS ÉCARTONS ═══ */}
      <Zone gris id="ecartes">
        <Entete className="mb-8 md:mb-10" surtitre="Ingrédients écartés" noir="Huit familles"
          gris={"absentes de chaque formule."} aLaLigne={false}
          texte={t("Nous avons vérifié la liste INCI de chaque formule du catalogue. Aucune ne contient les familles ci-dessous.")} />
        <Cartes colonnes={4} rail>
          <Carte numero="01" titre="Parabènes"
            texte="Des conservateurs très courants, dont plusieurs sont soupçonnés de perturber le système hormonal. La réglementation en limite certains et en interdit d’autres." />
          <Carte numero="02" titre="Silicones"
            texte="Ces polymères de synthèse et leurs dérivés, les siloxanes, laissent un film lisse sur la peau et le cheveu, et certains persistent longtemps dans l’environnement." />
          <Carte numero="03" titre="SLS et SLES"
            texte="Des détergents puissants, susceptibles d’irriter et de dessécher. Nos produits lavants utilisent des agents d’origine végétale, issus du coco." />
          <Carte numero="04" titre="Microplastiques"
            texte="Billes, paillettes et particules de plastique, qui finissent dans l’eau et s’y accumulent." />
          <Carte numero="05" titre="Formaldéhyde"
            texte="Des conservateurs qui libèrent du formaldéhyde, un allergène de contact connu." />
          <Carte numero="06" titre="Isothiazolinones (MIT, MCI)"
            texte="Des conservateurs reconnus comme allergisants, que la réglementation européenne a déjà fortement restreints." />
          <Carte numero="07" titre="BHA et BHT"
            texte="Des antioxydants de synthèse, soupçonnés de perturber le système hormonal." />
          <Carte numero="08" titre="Huiles minérales"
            texte="Paraffine liquide, vaseline : dérivées du pétrole, elles forment un film occlusif sur la peau." />
        </Cartes>
      </Zone>

      {/* ═══ EN TOUTE TRANSPARENCE ═══ */}
      <Zone>
        <Entete className="mb-8 md:mb-10" surtitre="Précisions" noir="Ce que nous" gris="précisons." aLaLigne={false} />
        <Cartes colonnes={3}>
          <Carte icone={SprayCan} titre="Le parfum"
            texte="De nombreuses formules sont parfumées. Le parfum est déclaré dans la liste des ingrédients, avec les allergènes réglementés. Certaines formules existent sans parfum : nous vous les indiquons à la sélection." />
          <Carte icone={Vegan} titre="Le végan"
            texte="La grande majorité des formules sont véganes. Nous vous indiquons lesquelles au moment de la sélection." />
          <Carte icone={Percent} titre="Les taux naturels et bio"
            texte="Chaque formule certifiée affiche son taux d’ingrédients d’origine naturelle et, quand il existe, son taux d’ingrédients bio." />
        </Cartes>
      </Zone>

      {/* ═══ SUITE ═══ */}
      <Zone gris>
        <div className="max-w-[48rem] mx-auto">
          <Entete surtitre="Une question sur nos formules ?" noir="Parlons de votre sélection" gris={"en rendez-vous."}
            texte={t("Un expert produit répond à vos questions sur les ingrédients, les certifications et le cadre réglementaire.")} />
          <BoutonRdv className="mt-8" />
          <p className="mt-6 text-center text-[0.9375rem]">
            <Link to="/formules-et-ingredients" className="underline underline-offset-4 text-foreground hover:text-foreground/70">
              {t("Lire formules et ingrédients")}
            </Link>
          </p>
        </div>
      </Zone>
    </>
  );
}
