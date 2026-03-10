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

          <Section title="Article 5 – Retours et produits endommagés">
            <strong>Produit endommagé ou défectueux :</strong> Seuls les produits endommagés ou défectueux sont éligibles à un retour. Si votre client reçoit un produit dans cet état, il vous contacte, vous nous transmettez la réclamation avec photo, et nous procédons au remplacement. La demande doit être faite dans le mois suivant la livraison.<br /><br />
            Pour les commandes perdues, la réclamation doit également être soumise dans le mois suivant la date de livraison estimée.<br /><br />
            <strong>Retour pour changement d'avis :</strong> Nos produits étant personnalisés à votre marque (logo, packaging, couleurs), ils ne sont pas éligibles au droit de rétractation classique de 14 jours, conformément à l'article L221-28 du Code de la consommation qui exclut les produits personnalisés. C'est le cas pour toutes les marques en marque blanche personnalisée.<br /><br />
            En résumé : vos clients sont protégés en cas de problème réel (casse, défaut), mais il n'y a pas de retour pour simple changement d'avis sur un produit personnalisé.
          </Section>

          <Section title="Article 6 – Répartition des responsabilités réglementaires">
            Dans le cadre de la réglementation européenne (Règlement CE n°1223/2009), les responsabilités sont réparties comme suit :<br /><br />
            <strong>Le laboratoire est la Personne Responsable au sens réglementaire.</strong> C'est lui qui :<br />
            – Garantit la conformité et la sécurité des formulations<br />
            – Établit et conserve le DIP (Dossier d'Information Produit)<br />
            – Assure l'enregistrement au CPNP (portail européen de notification)<br />
            – Gère la cosmétovigilance<br />
            – Vérifie les allégations produit<br />
            – Maintient les certifications COSMOS / ECOCERT / FDA<br /><br />
            <strong>Vous, en tant que marque, vous êtes le distributeur.</strong> Votre logo apparaît sur le packaging, mais la responsabilité réglementaire du produit en lui-même reste celle du laboratoire fabricant.<br /><br />
            <strong>Concernant le contrat :</strong> un cadre contractuel définit clairement les responsabilités de chaque partie avant toute commercialisation. Ce cadre précise les obligations du laboratoire en tant que fabricant et Personne Responsable, et vos obligations en tant que distributeur.
          </Section>

          <Section title="Article 7 – Limitation de responsabilité">
            La responsabilité de Lystes ne saurait être engagée en cas de force majeure ou d'événements
            indépendants de sa volonté. La responsabilité est limitée au montant de la commande concernée.
          </Section>

          <Section title="Article 8 – Propriété intellectuelle">
            Le site web créé dans le cadre de la prestation est la propriété pleine et entière du client dès sa mise en ligne. Aucun reliquat ni frais supplémentaire n'est dû pour en conserver la propriété.<br /><br />
            Les éléments créatifs réalisés par Lystes (logos, designs, packagings) sont cédés au client dès le paiement intégral de la prestation, sans restriction d'usage.
          </Section>

          <Section title="Article 9 – Litiges">
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
