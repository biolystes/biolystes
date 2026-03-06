import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm mb-8" style={{ color: "#86868b" }}>
        <ArrowLeft size={16} /> Retour à l'accueil
      </Link>
      <div style={{ background: "#fff", borderRadius: 32, padding: "56px 48px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1d1d1f", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Mentions légales
        </h1>
        <p style={{ fontSize: 15, color: "#86868b", marginBottom: 40 }}>Dernière mise à jour : mars 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <Section title="Éditeur du site">
            Le site biolystes.com est édité par la société <strong>Lystes</strong>.<br />
            Forme juridique : [à compléter]<br />
            Capital social : [à compléter]<br />
            Siège social : [adresse à compléter]<br />
            SIRET : [à compléter]<br />
            RCS : [à compléter]<br />
            Numéro de TVA intracommunautaire : [à compléter]<br />
            Directeur de la publication : [nom à compléter]<br />
            Email : hello@biolystes.com
          </Section>

          <Section title="Hébergement">
            Ce site est hébergé par Lovable (lovable.dev).<br />
            Infrastructure sous-jacente : services cloud conformes aux normes européennes.
          </Section>

          <Section title="Propriété intellectuelle">
            L'ensemble du contenu de ce site (textes, images, vidéos, logos, marques) est la propriété exclusive
            de Lystes ou de ses partenaires. Toute reproduction, représentation ou diffusion, en tout ou partie,
            est interdite sans autorisation préalable écrite.
          </Section>

          <Section title="Contact">
            Pour toute question, vous pouvez nous contacter à l'adresse : hello@biolystes.com
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
