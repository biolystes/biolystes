/* Conditions générales de vente. Texte inchangé (dernière retouche de JP
   dans Lovable le 07/10/2026 : plus aucun montant) ; mise en page de
   l’accueil depuis le 14/10/2026 (src/pages/pied/PageLegale.tsx). Les
   tirets d’origine entre une offre et son contenu deviennent un retour à la
   ligne, les « – » de liste des puces. */
import type { ReactNode } from "react";
import PageLegale, { ListeLegale } from "./pied/PageLegale";

function Groupe({ titre, precision, children }: { titre: string; precision?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-secondary p-4 md:p-6 space-y-4">
      <h3 className="text-[1.0625rem] !font-semibold text-foreground leading-snug text-pretty"
        style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif", textTransform: "none", letterSpacing: "-0.01em" }}>
        {titre}{precision && <span className="block sm:inline !font-normal text-muted-foreground"> {precision}</span>}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Offre({ nom, conditions, contenu }: { nom?: string; conditions: ReactNode; contenu?: ReactNode }) {
  return (
    <div className="text-[0.9375rem] md:text-base leading-[1.7]">
      <p className="text-foreground">{nom && <><strong>{nom}</strong> : </>}{conditions}</p>
      {contenu && <p className="text-foreground/70 mt-1 text-pretty">{contenu}</p>}
    </div>
  );
}

export default function CGVPage() {
  return (
    <PageLegale
      noir="Conditions générales"
      gris="de vente"
      miseAJour="Dernière mise à jour : mars 2026"
      articles={[
        {
          id: "objet",
          numero: "Article 1",
          titre: "Objet",
          contenu: (
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre
              la société <strong>Lystes</strong> (ci-après « Le Prestataire ») et ses clients dans le cadre des services suivants :
              création de marques cosmétiques bio en marque blanche, services de communication digitale et solutions d'intelligence artificielle pour le e‑commerce.
            </p>
          ),
        },
        {
          id: "offres",
          numero: "Article 2",
          titre: "Offres et services",
          contenu: (
            <>
              <p>Le Prestataire propose les offres suivantes :</p>
              <Groupe titre="A. Biolystes Cosmétique">
                <Offre nom="Pack Agence" conditions="frais de mise en place + abonnement PRO mensuel sans engagement" contenu="Logo, packaging, site e‑commerce, SEO, automatisation livraison, support premium, expert dédié." />
                <Offre nom="Pack IA" conditions="frais de mise en place + abonnement PRO IA mensuel sans engagement" contenu="Tout le Pack Agence + UGC IA, diagnostic intelligent, recommandations produits par IA, gestion réseaux sociaux." />
              </Groupe>
              <Groupe titre="B. Agence Communication" precision="(pour les marques ayant déjà un laboratoire)">
                <Offre nom="Pack Visibilité" conditions="abonnement mensuel sans engagement" contenu="publications mensuelles, calendrier éditorial, création de visuels, photos IA, community management, rapport mensuel, SEO fiches produits." />
                <Offre nom="Pack Accélération" conditions="abonnement mensuel sans engagement" contenu="Tout le Pack Visibilité + Meta Ads, campagne influence, UGC IA, retargeting, articles blog SEO. Le budget publicitaire n'est pas inclus." />
              </Groupe>
              <Groupe titre="C. Biolystes AI Standalone" precision="(Shopify & WooCommerce)">
                <Offre conditions="Frais de setup + abonnement mensuel sans engagement" contenu="Agents conversationnels, diagnostic peau & cheveux, photos produits IA, UGC, SEO, analytics, support multilingue." />
              </Groupe>
              <Groupe titre="D. Abonnements additionnels">
                <Offre nom="Marketing + CRO" conditions="abonnement mensuel sans engagement" contenu="Publicités Meta & TikTok, Media Buying, CRO, A/B testing, SEO, rapports détaillés." />
                <Offre nom="Community Manager" conditions="abonnement mensuel sans engagement" contenu="Gestion Instagram, Facebook, TikTok, Pinterest, calendrier éditorial, création de contenu, modération." />
              </Groupe>
              <p>Des offres promotionnelles temporaires peuvent être proposées. Leurs conditions sont précisées au client au moment de leur mise en place.</p>
            </>
          ),
        },
        {
          id: "abonnements",
          numero: "Article 3",
          titre: "Abonnements et engagement",
          contenu: (
            <>
              <p><strong>Tous les abonnements sont sans engagement.</strong> Le client peut résilier son abonnement à tout moment, sans pénalité ni justification. La résiliation prend effet à la fin de la période mensuelle en cours.</p>
              <p>Le paiement de l'abonnement est prélevé automatiquement chaque mois par carte bancaire. En cas de résiliation, le client conserve l'accès aux services jusqu'à la fin de la période déjà payée.</p>
            </>
          ),
        },
        {
          id: "prix",
          numero: "Article 4",
          titre: "Prix et paiement",
          contenu: (
            <>
              <p>Les tarifs sont communiqués au client lors d'un rendez-vous avec un expert et précisés dans le devis ou le contrat signé. Ils sont exprimés en euros.</p>
              <p>Les frais de mise en place sont exigibles à la signature du contrat. Un paiement échelonné peut être proposé selon l'offre souscrite.</p>
              <p>Tout retard de paiement entraîne de plein droit des pénalités de retard au taux légal en vigueur.</p>
            </>
          ),
        },
        {
          id: "livraison",
          numero: "Article 5",
          titre: "Livraison",
          contenu: (
            <p>
              Les délais de livraison sont donnés à titre indicatif. Lystes s'engage à informer le client
              de tout retard éventuel. Les frais de livraison sont à la charge du client, sauf accord contraire ou mention « livraison incluse » dans l'offre souscrite.
            </p>
          ),
        },
        {
          id: "retours",
          numero: "Article 6",
          titre: "Retours et produits endommagés",
          contenu: (
            <>
              <p><strong>Produit endommagé ou défectueux :</strong> Seuls les produits endommagés ou défectueux sont éligibles à un retour. Si votre client reçoit un produit dans cet état, il vous contacte, vous nous transmettez la réclamation avec photo, et nous procédons au remplacement. La demande doit être faite dans le mois suivant la livraison.</p>
              <p>Pour les commandes perdues, la réclamation doit également être soumise dans le mois suivant la date de livraison estimée.</p>
              <p><strong>Retour pour changement d'avis :</strong> Nos produits étant personnalisés à votre marque (logo, packaging, couleurs), ils ne sont pas éligibles au droit de rétractation classique de 14 jours, conformément à l'article L221-28 du Code de la consommation qui exclut les produits personnalisés. C'est le cas pour toutes les marques en marque blanche personnalisée.</p>
              <p>En résumé : vos clients sont protégés en cas de problème réel (casse, défaut), mais il n'y a pas de retour pour simple changement d'avis sur un produit personnalisé.</p>
            </>
          ),
        },
        {
          id: "responsabilites",
          numero: "Article 7",
          titre: "Répartition des responsabilités réglementaires",
          contenu: (
            <>
              <p>Dans le cadre de la réglementation européenne (Règlement CE n°1223/2009), les responsabilités sont réparties comme suit :</p>
              <p><strong>Le laboratoire est la Personne Responsable au sens réglementaire.</strong> C'est lui qui :</p>
              <ListeLegale elements={[
                "Garantit la conformité et la sécurité des formulations",
                "Établit et conserve le DIP (Dossier d'Information Produit)",
                "Assure l'enregistrement au CPNP (portail européen de notification)",
                "Gère la cosmétovigilance",
                "Vérifie les allégations produit",
                "Maintient les certifications COSMOS / ECOCERT",
              ]} />
              <p><strong>Vous, en tant que marque, vous êtes le distributeur.</strong> Votre logo apparaît sur le packaging, mais la responsabilité réglementaire du produit en lui-même reste celle du laboratoire fabricant.</p>
              <p><strong>Concernant le contrat :</strong> un cadre contractuel définit clairement les responsabilités de chaque partie avant toute commercialisation. Ce cadre précise les obligations du laboratoire en tant que fabricant et Personne Responsable, et vos obligations en tant que distributeur.</p>
            </>
          ),
        },
        {
          id: "propriete",
          numero: "Article 8",
          titre: "Propriété intellectuelle et propriété du site",
          contenu: (
            <>
              <p>Le site web e‑commerce créé dans le cadre de la prestation est la propriété pleine et entière du client dès sa mise en ligne. Aucun reliquat ni frais supplémentaire n'est dû pour en conserver la propriété.</p>
              <p>Les créations réalisées dans le cadre du contrat (logos, designs, packagings, visuels) sont cédées au client dès le paiement intégral de la prestation, sans restriction d'usage.</p>
            </>
          ),
        },
        {
          id: "limitation",
          numero: "Article 9",
          titre: "Limitation de responsabilité",
          contenu: (
            <p>
              La responsabilité de Lystes ne saurait être engagée en cas de force majeure ou d'événements
              indépendants de sa volonté. La responsabilité est limitée au montant de la commande concernée.
            </p>
          ),
        },
        {
          id: "litiges",
          numero: "Article 10",
          titre: "Litiges",
          contenu: (
            <p>
              En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action
              judiciaire. À défaut, le tribunal compétent sera celui du siège social de Lystes.
              Les présentes CGV sont soumises au droit français.
            </p>
          ),
        },
      ]}
    />
  );
}
