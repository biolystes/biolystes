import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CGVPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm mb-8" style={{ color: "#86868b" }}>
        <ArrowLeft size={16} /> Retour à l'accueil
      </Link>
      <div style={{ background: "#fff", borderRadius: 32, padding: "56px 48px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1d1d1f", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Conditions Générales de Vente
        </h1>
        <p style={{ fontSize: 15, color: "#86868b", marginBottom: 40 }}>Dernière mise à jour : mars 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <Section title="Article 1 – Objet">
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre
            la société <strong>Lystes</strong> et ses clients dans le cadre des services de création et de
            fourniture de produits cosmétiques bio en marque blanche.
          </Section>

          <Section title="Article 2 – Services">
            Lystes propose des services d'accompagnement pour la création de marques cosmétiques,
            incluant :<br />
            – La sélection de produits cosmétiques bio<br />
            – La personnalisation de packaging et d'étiquetage<br />
            – Le conseil en positionnement de marque<br />
            – La fourniture de produits en petites et moyennes quantités
          </Section>

          <Section title="Article 3 – Prix et paiement">
            Les prix sont indiqués en euros et hors taxes, sauf mention contraire. Le paiement est dû
            selon les modalités précisées dans le devis ou la commande. Tout retard de paiement entraîne
            de plein droit des pénalités de retard au taux légal en vigueur.
          </Section>

          <Section title="Article 4 – Livraison">
            Les délais de livraison sont donnés à titre indicatif. Lystes s'engage à informer le client
            de tout retard éventuel. Les frais de livraison sont à la charge du client, sauf accord contraire.
          </Section>

          <Section title="Article 5 – Droit de rétractation">
            Conformément au Code de la consommation, le client dispose d'un délai de 14 jours à compter
            de la réception des produits pour exercer son droit de rétractation, sauf pour les produits
            personnalisés qui en sont exclus.
          </Section>

          <Section title="Article 6 – Responsabilité">
            La responsabilité de Lystes ne saurait être engagée en cas de force majeure ou d'événements
            indépendants de sa volonté. La responsabilité est limitée au montant de la commande concernée.
          </Section>

          <Section title="Article 7 – Propriété intellectuelle">
            Tous les éléments créatifs réalisés par Lystes (logos, designs, packagings) restent la propriété
            de Lystes jusqu'au paiement intégral de la prestation. Après paiement, les droits d'utilisation
            sont cédés au client pour l'usage convenu.
          </Section>

          <Section title="Article 8 – Litiges">
            En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action
            judiciaire. À défaut, le tribunal compétent sera celui du siège social de Lystes.
            Les présentes CGV sont soumises au droit français.
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
