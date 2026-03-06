export default function PolitiqueConfidentialitePage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: "rgb(29,29,31)", marginBottom: 32 }}>
        Politique de Confidentialité
      </h1>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "rgb(29,29,31)", marginBottom: 12 }}>Responsable du traitement</h2>
        <p style={{ fontSize: 15, color: "rgb(100,100,105)", lineHeight: 1.7 }}>
          La société <strong>Lystes</strong> est responsable du traitement des données personnelles collectées sur ce site.<br />
          Contact : hello@biolystes.com
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "rgb(29,29,31)", marginBottom: 12 }}>Données collectées</h2>
        <p style={{ fontSize: 15, color: "rgb(100,100,105)", lineHeight: 1.7 }}>
          Nous collectons les données suivantes lorsque vous utilisez notre site :<br />
          – Nom, prénom, adresse email (lors de l'inscription ou d'une prise de contact)<br />
          – Données de navigation (cookies, adresse IP)<br />
          – Informations relatives à votre projet cosmétique (brief, sélections produits)
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "rgb(29,29,31)", marginBottom: 12 }}>Finalités</h2>
        <p style={{ fontSize: 15, color: "rgb(100,100,105)", lineHeight: 1.7 }}>
          Vos données sont utilisées pour :<br />
          – La gestion de votre compte et de vos projets<br />
          – La communication relative à nos services<br />
          – L'amélioration de notre site et de nos offres<br />
          – Le respect de nos obligations légales
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "rgb(29,29,31)", marginBottom: 12 }}>Durée de conservation</h2>
        <p style={{ fontSize: 15, color: "rgb(100,100,105)", lineHeight: 1.7 }}>
          Vos données personnelles sont conservées pendant la durée de la relation commerciale,
          puis archivées conformément aux délais légaux applicables (généralement 3 à 5 ans).
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "rgb(29,29,31)", marginBottom: 12 }}>Vos droits</h2>
        <p style={{ fontSize: 15, color: "rgb(100,100,105)", lineHeight: 1.7 }}>
          Conformément au RGPD, vous disposez des droits d'accès, de rectification, de suppression,
          de limitation, de portabilité et d'opposition concernant vos données personnelles.<br />
          Pour exercer ces droits, contactez-nous à : hello@biolystes.com
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "rgb(29,29,31)", marginBottom: 12 }}>Cookies</h2>
        <p style={{ fontSize: 15, color: "rgb(100,100,105)", lineHeight: 1.7 }}>
          Ce site utilise des cookies techniques nécessaires à son bon fonctionnement.
          Des cookies analytiques peuvent également être utilisés pour mesurer l'audience du site.
          Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur.
        </p>
      </section>
    </div>
  );
}
