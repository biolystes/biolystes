import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm mb-8" style={{ color: "#86868b" }}>
        <ArrowLeft size={16} /> Retour à l'accueil
      </Link>
      <div style={{ background: "#fff", borderRadius: 32, padding: "56px 48px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1d1d1f", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Politique de Confidentialité
        </h1>
        <p style={{ fontSize: 15, color: "#86868b", marginBottom: 40 }}>Dernière mise à jour : mars 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <Section title="Responsable du traitement">
            La société <strong>Lystes</strong> est responsable du traitement des données personnelles collectées sur ce site.<br />
            Contact : hello@biolystes.com
          </Section>

          <Section title="Données collectées">
            Nous collectons les données suivantes lorsque vous utilisez notre site :<br />
            – Nom, prénom, adresse email (lors de l'inscription ou d'une prise de contact)<br />
            – Données de navigation (cookies, adresse IP)<br />
            – Informations relatives à votre projet cosmétique (brief, sélections produits)
          </Section>

          <Section title="Finalités">
            Vos données sont utilisées pour :<br />
            – La gestion de votre compte et de vos projets<br />
            – La communication relative à nos services<br />
            – L'amélioration de notre site et de nos offres<br />
            – Le respect de nos obligations légales
          </Section>

          <Section title="Durée de conservation">
            Vos données personnelles sont conservées pendant la durée de la relation commerciale,
            puis archivées conformément aux délais légaux applicables (généralement 3 à 5 ans).
          </Section>

          <Section title="Vos droits">
            Conformément au RGPD, vous disposez des droits d'accès, de rectification, de suppression,
            de limitation, de portabilité et d'opposition concernant vos données personnelles.<br />
            Pour exercer ces droits, contactez-nous à : hello@biolystes.pro
          </Section>

          <Section title="Cookies">
            Ce site utilise des cookies techniques nécessaires à son bon fonctionnement.
            Des cookies analytiques peuvent également être utilisés pour mesurer l'audience du site.
            Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur.
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1d1d1f", marginBottom: 12, letterSpacing: "-0.01em" }}>{title}</h2>
      <p style={{ fontSize: 15, color: "#6e6e73", lineHeight: 1.8 }}>{children}</p>
    </section>
  );
}
