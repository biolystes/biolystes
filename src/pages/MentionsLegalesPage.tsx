/* Mentions légales. Texte inchangé (mars 2026) ; mise en page de l’accueil
   depuis le 14/10/2026 (src/pages/pied/PageLegale.tsx). */
import PageLegale, { FicheLegale } from "./pied/PageLegale";

export default function MentionsLegalesPage() {
  return (
    <PageLegale
      noir="Mentions"
      gris="légales"
      miseAJour="Dernière mise à jour : mars 2026"
      articles={[
        {
          id: "editeur",
          titre: "Éditeur du site",
          contenu: (
            <>
              <p>Le site biolystes.pro est édité par la société <strong>LYSTES</strong>.</p>
              <FicheLegale lignes={[
                ["Forme juridique", "Société par actions simplifiée (SAS)"],
                ["Siège social", "26 rue du Général Beuret, 75015 Paris, France"],
                ["SIRET", "907 951 867 00015"],
                ["RCS", "RCS Paris 907 951 867"],
                ["Numéro de TVA intracommunautaire", "FR68 907951867"],
                ["Directeur de la publication", "Jean‑Pierre BIAS, en sa qualité de président"],
                ["Email", <a key="m" href="mailto:hello@biolystes.com" className="underline underline-offset-4">hello@biolystes.com</a>],
              ]} />
            </>
          ),
        },
        {
          id: "hebergement",
          titre: "Hébergement",
          contenu: (
            <p>
              Ce site est hébergé par Lovable (lovable.dev).<br />
              Infrastructure sous-jacente : services cloud conformes aux normes européennes.
            </p>
          ),
        },
        {
          id: "propriete-intellectuelle",
          titre: "Propriété intellectuelle",
          contenu: (
            <p>
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, marques) est la propriété exclusive
              de Lystes ou de ses partenaires. Toute reproduction, représentation ou diffusion, en tout ou partie,
              est interdite sans autorisation préalable écrite.
            </p>
          ),
        },
        {
          id: "contact",
          titre: "Contact",
          contenu: (
            <p>
              Pour toute question, vous pouvez nous contacter à l'adresse : <a href="mailto:hello@biolystes.com" className="underline underline-offset-4">hello@biolystes.com</a>
            </p>
          ),
        },
      ]}
    />
  );
}
