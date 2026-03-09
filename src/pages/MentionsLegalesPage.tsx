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
            Le site biolystes.pro est édité par la société <strong>LYSTES</strong>.<br />
            Forme juridique : Société par actions simplifiée (SAS)<br />
            Siège social : 26 rue du Général Beuret, 75015 Paris, France<br />
            SIRET : 907 951 867 00015<br />
            RCS : RCS Paris 907 951 867<br />
            Numéro de TVA intracommunautaire : FR68 907951867<br />
            Directeur de la publication : Jean‑Pierre BIAS, en sa qualité de président<br />
            Email : hello@biolystes.pro
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
            Pour toute question, vous pouvez nous contacter à l'adresse : hello@biolystes.pro
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
