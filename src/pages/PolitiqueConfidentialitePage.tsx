/* Politique de confidentialité. Texte inchangé (mars 2026) ; mise en page
   de l’accueil depuis le 14/10/2026 (src/pages/pied/PageLegale.tsx). */
import PageLegale, { ListeLegale } from "./pied/PageLegale";

const MAIL = <a href="mailto:hello@biolystes.com" className="underline underline-offset-4">hello@biolystes.com</a>;

export default function PolitiqueConfidentialitePage() {
  return (
    <PageLegale
      noir="Politique"
      gris="de confidentialité"
      miseAJour="Dernière mise à jour : mars 2026"
      articles={[
        {
          id: "responsable",
          titre: "Responsable du traitement",
          contenu: (
            <p>
              La société <strong>Lystes</strong> est responsable du traitement des données personnelles collectées sur ce site.<br />
              Contact : {MAIL}
            </p>
          ),
        },
        {
          id: "donnees",
          titre: "Données collectées",
          contenu: (
            <>
              <p>Nous collectons les données suivantes lorsque vous utilisez notre site :</p>
              <ListeLegale elements={[
                "Nom, prénom, adresse email (lors de l'inscription ou d'une prise de contact)",
                "Données de navigation (cookies, adresse IP)",
                "Informations relatives à votre projet cosmétique (brief, sélections produits)",
              ]} />
            </>
          ),
        },
        {
          id: "finalites",
          titre: "Finalités",
          contenu: (
            <>
              <p>Vos données sont utilisées pour :</p>
              <ListeLegale elements={[
                "La gestion de votre compte et de vos projets",
                "La communication relative à nos services",
                "L'amélioration de notre site et de nos offres",
                "Le respect de nos obligations légales",
              ]} />
            </>
          ),
        },
        {
          id: "conservation",
          titre: "Durée de conservation",
          contenu: (
            <p>
              Vos données personnelles sont conservées pendant la durée de la relation commerciale,
              puis archivées conformément aux délais légaux applicables (généralement 3 à 5 ans).
            </p>
          ),
        },
        {
          id: "droits",
          titre: "Vos droits",
          contenu: (
            <p>
              Conformément au RGPD, vous disposez des droits d'accès, de rectification, de suppression,
              de limitation, de portabilité et d'opposition concernant vos données personnelles.<br />
              Pour exercer ces droits, contactez-nous à : {MAIL}
            </p>
          ),
        },
        {
          id: "cookies",
          titre: "Cookies",
          contenu: (
            <p>
              Ce site utilise des cookies techniques nécessaires à son bon fonctionnement.
              Des cookies analytiques peuvent également être utilisés pour mesurer l'audience du site.
              Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur.
            </p>
          ),
        },
      ]}
    />
  );
}
