export default function MentionsLegalesPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: "rgb(29,29,31)", marginBottom: 32 }}>
        Mentions légales
      </h1>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "rgb(29,29,31)", marginBottom: 12 }}>Éditeur du site</h2>
        <p style={{ fontSize: 15, color: "rgb(100,100,105)", lineHeight: 1.7 }}>
          Le site biolystes.com est édité par la société <strong>Lystes</strong>.<br />
          Forme juridique : [à compléter]<br />
          Capital social : [à compléter]<br />
          Siège social : [adresse à compléter]<br />
          SIRET : [à compléter]<br />
          RCS : [à compléter]<br />
          Numéro de TVA intracommunautaire : [à compléter]<br />
          Directeur de la publication : [nom à compléter]<br />
          Email : hello@biolystes.com
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "rgb(29,29,31)", marginBottom: 12 }}>Hébergement</h2>
        <p style={{ fontSize: 15, color: "rgb(100,100,105)", lineHeight: 1.7 }}>
          Ce site est hébergé par Lovable (lovable.dev).<br />
          Infrastructure sous-jacente : services cloud conformes aux normes européennes.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "rgb(29,29,31)", marginBottom: 12 }}>Propriété intellectuelle</h2>
        <p style={{ fontSize: 15, color: "rgb(100,100,105)", lineHeight: 1.7 }}>
          L'ensemble du contenu de ce site (textes, images, vidéos, logos, marques) est la propriété exclusive
          de Lystes ou de ses partenaires. Toute reproduction, représentation ou diffusion, en tout ou partie,
          est interdite sans autorisation préalable écrite.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "rgb(29,29,31)", marginBottom: 12 }}>Contact</h2>
        <p style={{ fontSize: 15, color: "rgb(100,100,105)", lineHeight: 1.7 }}>
          Pour toute question, vous pouvez nous contacter à l'adresse : hello@biolystes.com
        </p>
      </section>
    </div>
  );
}
