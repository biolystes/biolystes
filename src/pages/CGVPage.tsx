/* Conditions générales de vente. Mise en page de l’accueil depuis le
   14/10/2026 (src/pages/pied/PageLegale.tsx).

   Alignées le 14/10/2026 sur le contrat de biolystes.pro (articles 7 bis,
   7 ter, 7 quater, 7 quinquies) et sur le modèle de paiement validé par JP
   (compétence tarifs-biolystes) : packs Design, Solo, Duo, Standard, IA ;
   sélection des produits et fichiers INCI offerts avant tout paiement ;
   acompte 199 € ou 299 € (IA), objet de l’acompte (texte de référence de
   JP) ; trois temps, deux pour Solo et Design ; « Payer sur plusieurs
   mois » (JP, 14/10/2026 soir) : acompte à la validation de la sélection, reste
   de la mise en place à la livraison du site, puis mensualité à partir de
   199 € par mois, abonnement compris ; à l'achat, abonnement payant à
   partir de la livraison du site, une fois le solde réglé ; 39 € par
   produit en plus ; logo
   offert, hors prix des offres ; délais de 10 jours ouvrés ; livraison avec
   renvoi vers /livraison. Les prix de chaque pack se donnent en rendez-vous et
   figurent au contrat ; les articles 3 et 4.7 reprennent mot pour mot ceux
   du contrat (7 quater.6 et 7 quinquies.2, alignés le 14/10/2026 dans les
   trois dépôts), seuls « client » et « site » passent en minuscules. Les « – » de liste
   d’origine sont des puces. */
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
      miseAJour="Dernière mise à jour : 14 octobre 2026"
      articles={[
        {
          id: "objet",
          numero: "Article 1",
          titre: "Objet",
          contenu: (
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre
              la société <strong>Lystes</strong> (ci-après « Le Prestataire ») et ses clients dans le cadre des services suivants :
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
                <Offre nom="Pack Design" conditions="sans site e‑commerce, avec abonnement mensuel sans engagement" contenu="Design de 4 produits, logo et charte graphique. L’abonnement donne accès à tout le catalogue, sans minimum de commande." />
                <Offre nom="Pack Solo" conditions="avec abonnement mensuel sans engagement" contenu="Design d’1 produit, logo, charte, packaging et site e‑commerce." />
                <Offre nom="Pack Duo" conditions="avec abonnement mensuel sans engagement" contenu="Design de 2 produits, logo, charte, packaging et site e‑commerce." />
                <Offre nom="Pack Standard" conditions="en une fois, avec abonnement mensuel sans engagement, ou sur plusieurs mois, abonnement compris dans le loyer mensuel" contenu="Design de 4 produits, logo, charte, packaging, site e‑commerce complet et expert dédié." />
                <Offre nom="Pack IA" conditions="en une fois, avec abonnement PRO IA mensuel sans engagement, ou sur plusieurs mois, abonnement compris dans le loyer mensuel" contenu="Design de 8 produits, tout le Pack Standard, UGC IA, diagnostic intelligent et outils marketing." />
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
              <p>Pour les packs avec site, l’abonnement mensuel démarre à la livraison du site, une fois le solde réglé. Il est payant pour tous ces packs, Pack Standard compris (quatre-vingt-dix-neuf euros (99 €) TTC par mois). Dans la formule « Payer sur plusieurs mois », il est compris dans le loyer mensuel (article 4.7).</p>
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
              <p><strong>4.1 Prix.</strong> Le prix de chaque offre est communiqué au client lors d’un rendez-vous avec un expert et précisé dans le devis ou le contrat signé. Il est exprimé en euros, toutes taxes comprises. Le montant et la date de chaque paiement figurent dans l’échéancier du contrat et dans l’espace client.</p>
              <p><strong>4.1 bis Sélection des produits offerte.</strong> Avant tout paiement, le client vérifie que nos produits lui correspondent, seul avec notre outil d’intelligence artificielle ou avec nos experts produits pour une sélection sur mesure. Il reçoit gratuitement sa sélection de produits et leurs fichiers INCI. Aucune somme n’est due tant que le client n’a pas validé sa sélection.</p>
              <p><strong>4.2 Objet de l’acompte.</strong> Avant de s’engager davantage, le client doit pouvoir vérifier que nos produits tiennent leurs promesses. L’acompte lance le projet : le Prestataire crée le logo et le branding du client, réalise le design de ses produits, les fait fabriquer et les lui envoie, avec les photos qui en montrent le design. Le client reçoit ainsi ses produits à sa marque, et c’est seulement à ce moment qu’il décide de poursuivre ou non. Pendant cette première étape, le Prestataire prend à sa charge une grande partie du coût de création des produits.</p>
              <p><strong>4.3 Montant de l’acompte.</strong> L’acompte est de 199 € TTC, ou de 299 € TTC pour le Pack IA. Il est réglé à la commande, une fois la sélection des produits validée, et n’est pas remboursable.</p>
              <p><strong>4.4 Si le client ne poursuit pas.</strong> À la réception de ses produits, le client qui ne souhaite pas poursuivre ne doit rien d’autre que l’acompte déjà versé. Il conserve son logo, son branding et les designs de ses produits, qu’il peut utiliser librement, y compris avec un autre fabricant.</p>
              <p><strong>4.5 Paiement en trois temps.</strong> Si le client valide ses produits, il règle une deuxième tranche égale à 50 % du prix de l’offre, diminuée de l’acompte déjà versé. Le solde, soit les 50 % restants, est exigible à la livraison du site.</p>
              <p><strong>4.6 Packs Solo et Design.</strong> Pour le Pack Solo et le Pack Design, le paiement se fait en deux temps : l’acompte, puis le reste du prix de l’offre en une fois, à la réception des produits validés.</p>
              <p><strong>4.7 Payer sur plusieurs mois.</strong> Pour le Pack Standard et le Pack IA, le client peut choisir la location avec option d’achat (formule « Payer sur plusieurs mois »), sans engagement de durée. Comme à l’achat, la sélection des produits et leurs fichiers INCI sont offerts avant tout paiement. Une fois sa sélection validée, le client règle un acompte de cent quatre-vingt-dix-neuf euros (199 €) TTC pour le Pack Standard, ou de deux cent quatre-vingt-dix-neuf euros (299 €) TTC pour le Pack IA ; il couvre la création du logo, offerte, et du branding, le design, la fabrication et l’envoi des produits. S’il valide ses produits, le client règle le reste de la mise en place à la livraison du site : la mise en place est de quatre cent quatre-vingt-dix-neuf euros (499 €) TTC pour le Pack Standard et de cinq cent quatre-vingt-dix-neuf euros (599 €) TTC pour le Pack IA, acompte déduit, soit trois cents euros (300 €) TTC dans les deux cas. Le loyer mensuel, abonnement compris, court ensuite à compter de la livraison du site : cent quatre-vingt-dix-neuf euros (199 €) TTC au minimum, pour le Pack Standard comme pour le Pack IA. Le client peut verser davantage chaque mois, ou régler le solde à tout moment. Le site lui appartient dès que le total de ses paiements atteint le prix de l’offre. S’il arrête avant, le site est désactivé, les sommes versées restent acquises et aucune autre somme n’est due ; il conserve son logo, sa charte graphique et les designs de son packaging. Cette formule n’existe pas pour le Pack Design, qui ne comprend pas de site.</p>
              <p><strong>4.8 Produit supplémentaire.</strong> Chaque produit ajouté au-delà du nombre prévu par le pack est facturé 39 € TTC, en paiement unique, pour son design.</p>
              <p><strong>4.9 Logo offert.</strong> La création du logo est offerte : elle n’entre pas dans le prix des offres. Le client qui fournit son propre logo ne bénéficie donc d’aucune réduction de prix.</p>
              <p><strong>4.10 Retard de paiement.</strong> Tout retard de paiement entraîne de plein droit des pénalités de retard au taux légal en vigueur.</p>
            </>
          ),
        },
        {
          id: "delais",
          numero: "Article 5",
          titre: "Délais de réalisation",
          contenu: (
            <>
              <p><strong>5.1 Délai.</strong> Le Prestataire met la marque du client en ligne dans un délai de dix (10) jours ouvrés. Ce délai court à compter de la réception de l’acompte et de l’ensemble des éléments demandés au client : brief, sélection des produits, logo ou éléments de marque, textes et informations légales.</p>
              <p><strong>5.2 Suspension.</strong> Ce délai est suspendu pendant toute période où le Prestataire attend une réponse, une validation ou un élément du client. Il reprend à la réception de cette réponse, pour la durée restant à courir.</p>
              <p><strong>5.3 Modifications.</strong> Chaque étape (sélection des produits, logo et packaging, boutique en ligne) comprend deux (2) séries de modifications. Chaque série supplémentaire prolonge le délai de trois (3) jours ouvrés.</p>
              <p><strong>5.4 Mise en attente.</strong> Sans réponse du client trente (30) jours après une relance écrite, le projet est mis en attente. Il reprend à tout moment à la demande du client.</p>
              <p><strong>5.5 Retard du Prestataire.</strong> Un retard imputable au seul Prestataire ouvre droit à une remise de 5 % du montant de la tranche concernée par semaine de retard, dans la limite de 20 % de cette tranche.</p>
            </>
          ),
        },
        {
          id: "livraison",
          numero: "Article 6",
          titre: "Livraison",
          contenu: (
            <>
              <p><strong>6.1 Deux modes.</strong> En mode Standard, les produits sont fabriqués à la demande et livrés en Europe et sur le continent américain, en six à sept jours. En mode Express, ils sont expédiés depuis le stock acheté par le client et placé chez le logisticien, dans le monde entier, en vingt-quatre à quarante-huit heures.</p>
              <p><strong>6.2 Délais indicatifs.</strong> Les délais de livraison sont donnés à titre indicatif. Lystes informe le client de tout retard éventuel.</p>
              <p><strong>6.3 Frais.</strong> Les frais de livraison dépendent du poids du colis et du pays de destination. Ils sont à la charge du client, qui peut les faire payer à ses propres clients ou les leur offrir, sauf accord contraire ou mention « livraison incluse » dans l’offre souscrite.</p>
              <p><strong>6.4 Détail.</strong> Le détail des zones, des délais, de la préparation et des frais de livraison est publié sur <a href="https://www.biolystes.com/livraison" className="underline underline-offset-4">https://www.biolystes.com/livraison</a>.</p>
            </>
          ),
        },
        {
          id: "disponibilite",
          numero: "Article 7",
          titre: "Disponibilité des produits",
          contenu: (
            <>
              <p><strong>7.1 Fabrication à la demande.</strong> Les produits sont fabriqués à la demande, sous réserve de la disponibilité des matières premières et des capacités du fabricant. Le Prestataire ne détient pas de stock pour le compte du client, sauf en mode Express pour le stock que le client a lui-même acheté.</p>
              <p><strong>7.2 Rupture.</strong> En cas de rupture d’un produit ou d’une matière première, le Prestataire en informe le client par écrit dans les meilleurs délais, avec la date prévisible de retour lorsqu’elle est connue. Le client choisit alors entre attendre le retour du produit, un produit de remplacement de qualité et d’usage équivalents, ou le remboursement du produit indisponible pour la partie non livrée. À défaut de choix sous quinze (15) jours, la commande du produit concerné reste en attente.</p>
              <p><strong>7.3 Délais.</strong> Pendant la rupture, les délais du produit concerné sont suspendus ; les autres produits de la commande sont livrés sans attendre lorsque c’est possible.</p>
              <p><strong>7.4 Arrêt d’un produit.</strong> Si le fabricant arrête définitivement un produit, le Prestataire propose une formule équivalente. Si le client la refuse, il est remboursé des produits commandés et non livrés.</p>
              <p><strong>7.5 Limite.</strong> Hors faute du Prestataire, une rupture chez le fabricant n’ouvre pas droit à d’autre indemnité que les solutions prévues au présent article.</p>
            </>
          ),
        },
        {
          id: "retours",
          numero: "Article 8",
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
          numero: "Article 9",
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
          numero: "Article 10",
          titre: "Propriété intellectuelle et propriété du site",
          contenu: (
            <>
              <p>Avec la formule « Payer en une fois », le site web e‑commerce créé dans le cadre de la prestation est la propriété pleine et entière du client dès sa mise en ligne. Aucun reliquat ni frais supplémentaire n'est dû pour en conserver la propriété.</p>
              <p>Avec la formule « Payer sur plusieurs mois », la propriété du site est transférée au client dès que le total de ses paiements atteint le prix de l’offre (article 4.7).</p>
              <p>Le logo, le branding et les designs des produits sont acquis au client, qui peut les utiliser librement, y compris s’il ne poursuit pas après la réception de ses produits (article 4.4). Les autres créations réalisées dans le cadre du contrat (visuels) sont cédées au client dès le paiement intégral de la prestation, sans restriction d'usage.</p>
            </>
          ),
        },
        {
          id: "limitation",
          numero: "Article 11",
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
          numero: "Article 12",
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
