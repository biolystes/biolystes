/* /faq : les questions fréquentes de Biolystes (JP, 14/10/2026 : « rajoute
   une page questions fréquentes »). Cadre, en-tête et pied de page :
   src/pages/pied/CadrePied.tsx, comme les autres pages du pied de page.

   Règles tenues ici :
   - tout à plat, aucune question repliée : un titre par thème, les
     questions en cartes dessous (règle de JP, 11/10/2026) ;
   - aucun prix (page publique) : les montants se donnent en rendez-vous ;
   - aucun nom de laboratoire ;
   - chaque réponse reprend un fait déjà écrit ailleurs : contrat (articles
     4, 7 bis, 7 ter, 17.5, 17 bis, 28 ter), méthodes Biolystes, centre
     d’aide du laboratoire relu le 13/10/2026, section livraison de
     l’accueil (Europe et continent américain en Standard, monde entier en
     Express, JP 14/10/2026). Les points que les sources contredisent
     (durée d’engagement, nombre exact d’allers-retours, Shopify) ne sont
     pas tranchés ici : la page n’en parle pas ou reste générale.
   - payer sur plusieurs mois et départ de l’abonnement : décisions de JP du
     14/10/2026 (soir), compétence tarifs-biolystes ; mêmes mots que /tarifs
     et les CGV (articles 3 et 4.7), sans montant.

   Les questions sont aussi publiées en données structurées FAQPage. */
import {
  BadgeCheck, Box, Calculator, ClipboardCheck, CalendarClock, CircleDollarSign, Clock, Crown, FileText, FlaskConical, Globe, Handshake,
  HeartHandshake, Layers, Leaf, Map, MessageCircle, PackageOpen, PackagePlus, PackageX, Palette, PenLine, RefreshCw,
  ShieldCheck, ShoppingBag, Sparkles, Store, Truck, Wallet, Warehouse, type LucideIcon,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Bande, BoutonRdv, Entete, RondIcone } from "./pied/elements";

type Question = { icone: LucideIcon; q: string; r: string };
type Theme = { id: string; titre: string; gris: string; questions: Question[] };

const THEMES: Theme[] = [
  {
    id: "modele",
    titre: "Le modèle",
    gris: "sans stock, sans minimum.",
    questions: [
      {
        icone: Warehouse,
        q: "Faut-il acheter du stock ?",
        r: "Non. Chaque produit est fabriqué à la demande, conditionné à votre marque, puis expédié directement chez votre cliente. Vous n’achetez et ne stockez rien.",
      },
      {
        icone: PackageOpen,
        q: "Y a-t-il une quantité minimale ?",
        r: "Aucune. Vous commandez 1, 10 ou 1 000 produits, au rythme de vos ventes. Des remises s’appliquent à partir de 100 unités.",
      },
      {
        icone: FlaskConical,
        q: "Les formules sont-elles créées pour ma marque ?",
        r: "Ce sont des formules existantes de laboratoires européens, personnalisées à votre marque : étiquette, boîte, identité visuelle. Les formules ne changent pas. C’est ce qui permet de démarrer sans stock et sans minimum.",
      },
      {
        icone: Truck,
        q: "Qui fabrique et qui expédie ?",
        r: "Votre cliente commande sur votre boutique. Le laboratoire partenaire fabrique le produit, le conditionne à votre marque et l’expédie chez elle, avec un numéro de suivi.",
      },
      {
        icone: PackagePlus,
        q: "Puis-je ajouter des produits plus tard ?",
        r: "Oui, à tout moment. Chaque produit ajouté reçoit son propre design d’étiquette, qui vous appartient.",
      },
      {
        icone: CircleDollarSign,
        q: "Prenez-vous une commission sur mes ventes ?",
        r: "Non, aucune. Vous fixez librement vos prix et vos promotions.",
      },
    ],
  },
  {
    id: "produits",
    titre: "Les produits",
    gris: "certifiés et notifiés.",
    questions: [
      {
        icone: BadgeCheck,
        q: "Les produits sont-ils certifiés bio ?",
        r: "La plupart des formules sont certifiées COSMOS Natural ou COSMOS Organic par Ecocert. La certification de chaque produit figure sur sa fiche.",
      },
      {
        icone: Leaf,
        q: "Sont-ils végans ? Testés sur les animaux ?",
        r: "Une partie de la gamme est végane : nous vous indiquons lesquels au moment de la sélection. Aucun produit ni aucun ingrédient n’est testé sur les animaux.",
      },
      {
        icone: Map,
        q: "Où sont-ils fabriqués ?",
        r: "Dans l’Union européenne, dans une usine certifiée ISO 22716, la norme des bonnes pratiques de fabrication cosmétique. Le pays exact de chaque produit figure sur son étiquette.",
      },
      {
        icone: ShieldCheck,
        q: "Dois-je faire la notification CPNP ?",
        r: "Non. Chaque formule est déjà notifiée au CPNP et son dossier d’information produit est tenu par le laboratoire. Les mentions obligatoires sont imprimées d’office sur l’étiquette.",
      },
      {
        icone: FileText,
        q: "Où lire la liste des ingrédients ?",
        r: "Chaque fiche donne la liste INCI complète, le taux d’ingrédients naturels et bio, et la certification. La liste INCI fait foi : c’est elle qui figure sur l’étiquette.",
      },
      {
        icone: HeartHandshake,
        q: "Les produits conviennent-ils aux enfants ?",
        r: "Les soins sont déconseillés avant 12 ans. La gamme bébé (shampooing, gel lavant, mousse lavante, lait corps) s’utilise dès la naissance.",
      },
    ],
  },
  {
    id: "marque",
    titre: "Votre marque",
    gris: "et votre packaging.",
    questions: [
      {
        icone: Palette,
        q: "Que puis-je personnaliser ?",
        r: "Votre nom, votre logo, l’étiquette et la boîte quand le produit en a une : tout l’univers visuel de votre marque. Le flacon et la contenance sont ceux de la fiche du produit.",
      },
      {
        icone: Box,
        q: "Puis-je avoir un flacon spray ou une autre contenance ?",
        r: "Seulement si la fiche du produit le prévoit. Nous vérifions le conditionnement avec vous au moment de la sélection. En mode Express, avec votre stock chez notre logisticien, vous personnalisez plus librement votre packaging.",
      },
      {
        icone: PenLine,
        q: "Puis-je demander des modifications ?",
        r: "Oui. Des séries de modifications sont comprises à chaque étape, avant la production : sélection des produits, logo et packaging, boutique. Une modification demandée après l’expédition de vos produits est facturée en plus.",
      },
      {
        icone: Layers,
        q: "Le produit fini ressemble-t-il aux maquettes ?",
        r: "Le rendu est très proche des maquettes que vous validez. Une dorure ou une teinte peut varier légèrement à l’impression.",
      },
      {
        icone: Crown,
        q: "À qui appartient la marque ?",
        r: "À vous : marque, logo, charte et designs, avec leurs fichiers sources. Si vous arrêtez après avoir reçu vos premiers produits, vous les gardez. Avec un pack acheté, la boutique vous appartient dès sa mise en ligne, avec votre nom de domaine et votre fichier client.",
      },
      {
        icone: Handshake,
        q: "Suis-je lié à Biolystes ?",
        r: "Il n’y a aucune exclusivité. Après l’arrêt de votre abonnement, vous pouvez continuer à commander vos produits chez nous ou changer de fournisseur.",
      },
    ],
  },
  {
    id: "delais",
    titre: "Délais et livraison",
    gris: "en Europe et au-delà.",
    questions: [
      {
        icone: CalendarClock,
        q: "Combien de temps pour lancer ma marque ?",
        r: "Dix jours ouvrés, à partir de l’acompte et de la réception de tous vos éléments : brief, choix des produits, logo ou éléments de marque, textes. Le délai s’arrête quand nous attendons une réponse de votre part.",
      },
      {
        icone: ClipboardCheck,
        q: "Puis-je essayer les produits avant de m’engager ?",
        r: "Oui. Vous recevez d’abord vos produits finis à votre marque. Vous avez ensuite 7 jours pour décider de continuer. Si vous arrêtez, vous gardez votre logo, votre charte et vos designs.",
      },
      {
        icone: Globe,
        q: "Où livrez-vous mes clientes ?",
        r: "En mode Standard, fabriqué à la demande : en Europe et sur le continent américain, en 6 à 7 jours. En mode Express, depuis votre stock chez notre logisticien : dans le monde entier, en 24 à 48 heures.",
      },
      {
        icone: Wallet,
        q: "Qui paie la livraison ?",
        r: "Le port dépend du poids du colis et du pays de livraison. Sur votre boutique, vous décidez si votre cliente le paie ou si vous l’offrez à partir d’un montant d’achat.",
      },
      {
        icone: RefreshCw,
        q: "Et si un produit est en rupture ?",
        r: "Nous vous prévenons par écrit, avec la date de retour prévue quand elle est connue. Vous choisissez : attendre, un produit équivalent, ou le remboursement du produit manquant. Les autres produits de la commande partent sans attendre quand c’est possible.",
      },
      {
        icone: PackageX,
        q: "Un colis est perdu ou abîmé : que faire ?",
        r: "Écrivez-nous dans le mois qui suit la livraison, avec le numéro de commande et des photos du produit et du carton. Le produit est renvoyé, en général sous 72 heures.",
      },
    ],
  },
  {
    id: "boutique",
    titre: "Votre boutique",
    gris: "et notre accompagnement.",
    questions: [
      {
        icone: Store,
        q: "Que comprend le site e-commerce ?",
        r: "Une boutique complète à vos couleurs : fiches produits, textes et photos par IA, paiements sécurisés, zones de livraison, référencement et livraisons automatisées. Une formation de deux heures vous apprend à la gérer.",
      },
      {
        icone: Sparkles,
        q: "Quels outils IA sont proposés ?",
        r: "Selon votre formule : diagnostic de peau ou de cheveux pour vos visiteuses, recommandations de produits, photos et vidéos de vos produits par IA, outils de marketing.",
      },
      {
        icone: MessageCircle,
        q: "Qui répond à mes clientes ?",
        r: "Votre marque : vos clientes vous écrivent directement. De notre côté, nous restons votre interlocuteur unique pour tout problème de fabrication, d’expédition ou de retour.",
      },
      {
        icone: Clock,
        q: "Que comprend l’abonnement ?",
        r: "L’hébergement, la maintenance, la sécurité, le support, le référencement, l’automatisation des livraisons et, selon votre formule, les outils IA. Si vous payez en une fois, il s’ajoute au prix du pack et démarre à la livraison de votre site, une fois le solde réglé. Si vous payez sur plusieurs mois, il est compris dans votre mensualité.",
      },
      {
        icone: Wallet,
        q: "Puis-je payer sur plusieurs mois ?",
        r: "Oui, avec les packs Standard et IA. Votre sélection de produits est offerte. Vous réglez l’acompte une fois votre sélection validée, puis le reste de la mise en place à la livraison de votre site. Ensuite, une mensualité minimum, abonnement compris : vous pouvez verser plus ou solder quand vous voulez. Le site est à vous une fois le total réglé. Si vous arrêtez avant, il est désactivé, et vous gardez votre logo, votre charte et votre packaging.",
      },
      {
        icone: ShoppingBag,
        q: "Qu’est-ce qui reste à ma charge ?",
        r: "Vos achats de produits, l’expédition et les frais de votre prestataire de paiement. Tout travail hors forfait fait l’objet d’un devis écrit avant d’être lancé.",
      },
      {
        icone: Calculator,
        q: "Combien coûte le lancement ?",
        r: "Cela dépend du nombre de produits et de la formule choisie. Nous vous donnons tous les montants au rendez-vous, avec l’échéancier complet.",
      },
    ],
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: THEMES.flatMap((t) => t.questions).map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.r },
  })),
};

/* Les deux derniers mots d'une réponse restent ensemble : jamais un mot seul
   sur la dernière ligne (JP). */
const colle = (t: string) => t.replace(/ (\S+)$/, "\u00a0$1");

function CarteQuestion({ item }: { item: Question }) {
  return (
    <div className="bg-secondary rounded-2xl p-[1.5rem] md:p-[2rem] flex items-start gap-4">
      <RondIcone icone={item.icone} />
      <div className="min-w-0">
        <h3 className="text-[1.0625rem] !font-semibold text-foreground leading-snug text-balance"
          style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif", textTransform: "none", letterSpacing: "-0.01em" }}>
          {item.q}
        </h3>
        <p className="mt-2 text-[0.9375rem] text-foreground/80 leading-[1.7] text-pretty">{colle(item.r)}</p>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <SEO
        title="Questions fréquentes | Biolystes"
        description="Stock, minimum, certifications, packaging, délais, livraison, boutique : les réponses aux questions que l’on nous pose avant de lancer sa marque."
        path="/faq"
        jsonLd={JSON_LD}
      />

      {/* ═══ HAUT DE PAGE ═══ */}
      <section className="bg-background pt-12 md:pt-20 pb-10 md:pb-12 px-[1.25rem] md:px-[1.5rem]">
        <Entete niveau={1} surtitre="Questions fréquentes"
          noir="Ce que l’on nous demande" gris={"avant de se lancer."}
          texte="Les réponses aux questions que nos clientes nous posent le plus souvent, du choix des produits à la livraison de leurs propres clientes." />
        <nav aria-label="Thèmes" className="max-w-3xl mx-auto mt-8 md:mt-10 flex flex-wrap justify-center gap-2.5">
          {THEMES.map((t) => (
            <a key={t.id} href={`#${t.id}`}
              className="rounded-full border border-border bg-background px-4 py-2 text-[0.875rem] text-foreground hover:bg-secondary transition-colors">
              {t.titre}
            </a>
          ))}
        </nav>
      </section>

      {/* ═══ LES THÈMES, À PLAT ═══ */}
      {THEMES.map((t, i) => (
        <Bande key={t.id} id={t.id} className={i === 0 ? "!pt-4 md:!pt-6" : ""}>
          <div className="max-w-5xl mx-auto px-[1.25rem] md:px-[1.5rem]">
            <Entete className="mb-8 md:mb-10" surtitre={`${t.questions.length} questions`} noir={t.titre} gris={t.gris.replace(/ (\S+)$/, "\u00a0$1")} aLaLigne={false} />
            <div className="grid md:grid-cols-2 gap-4">
              {t.questions.map((item) => <CarteQuestion key={item.q} item={item} />)}
            </div>
          </div>
        </Bande>
      ))}

      {/* ═══ RENDEZ-VOUS ═══ */}
      <Bande gris>
        <div className="max-w-[48rem] mx-auto px-[1.25rem] md:px-[1.5rem]">
          <Entete surtitre="Une autre question ?" noir="Parlons de votre projet" gris={"en\u00a0rendez-vous."}
            texte="Nous répondons à vos questions et vous donnons tous les montants, avec l’échéancier complet." />
          <BoutonRdv className="mt-8" />
        </div>
      </Bande>
    </>
  );
}
