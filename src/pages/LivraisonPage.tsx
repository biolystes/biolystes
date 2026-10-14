/* /livraison : comment se passe la livraison des clientes de nos marques
   (JP, 14/10/2026 : « les gens doivent savoir comment se passe la
   livraison, les pays pris en compte ; dans le contrat on peut donner l’URL
   de cette info »). Le contrat (article 7 ter) et les CGV renvoient ici.
   Cadre, en-tête et pied de page : src/pages/pied/CadrePied.tsx, comme les
   autres pages du pied de page. Tout est à plat, rien ne se replie.

   Ce qui est écrit, et d’où ça vient (rien d’autre) :
   - pays, délais par pays, préparation, fabrication, frais au poids :
     src/data/livraison.ts, fichier jumeau de celui de biolystes.pro
     (même contenu dans les deux dépôts, mêmes chiffres sur les deux pages) ;
   - les deux modes, leurs zones et leurs délais : section Livraison de
     l’accueil (lystes/src/pages/BioPage.tsx, textes de JP du 14/10/2026) et
     article 7 ter.4 du contrat : Standard, Europe et continent américain,
     6 à 7 jours ; Express, monde entier, 24 à 48 heures, depuis le stock
     acheté par la cliente. Écarts avec les délais par pays signalés à JP
     le 14/10/2026 (États-Unis 12 j ouvrés, Portugal et Suisse 8 j) ;
   - port payé par la cliente finale ou offert par la marque (page /tarifs,
     FAQ) ; préparation comprise dans le prix d’achat (page /tarifs) ;
   - ruptures : article 7 ter du contrat, en langage simple ;
   - colis perdu ou abîmé : CGV, article 8, et FAQ ; douane hors UE :
     biolystes.pro/livraison.
   Les frais de port sont un coût de transport, pas un prix d’offre : la
   règle « aucun prix en ligne » ne vise que les offres. */
import type { ReactNode } from "react";
import {
  CalendarClock, Check, Clock, FileText, FlaskConical, Globe, Hourglass, Mail, Package, PackageCheck, PackageX, Repeat, Scale,
  ShoppingBag, Truck, Users, Warehouse, Zap, type LucideIcon,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Bande, BoutonRdv, Entete, RondIcone } from "./pied/elements";
import {
  DELAIS_PAR_PAYS, FABRICATION, FRAIS_STANDARD_FRANCE, LIVRAISON_MISE_A_JOUR, PREPARATION, euros, lignesParDelai, ttc,
} from "@/data/livraison";

const BRICOLAGE = "'Bricolage Grotesque', 'Inter', sans-serif";
const NBSP = " ";

type Etape = { icone: LucideIcon; label: string; texte: string; differe?: boolean };
type Mode = { icone: LucideIcon; nom: string; delai: string; zone: string; chapeau: string; etapes: Etape[] };

const COMMANDE: Etape = { icone: ShoppingBag, label: "Commande client", texte: "Votre client passe commande sur votre boutique en ligne." };

/* Les deux modes, avec les textes de la section Livraison de l’accueil. */
const MODES: Mode[] = [
  {
    icone: Clock, nom: "Mode Standard", delai: "Livraison en 6 à 7" + NBSP + "jours",
    zone: "Europe et continent américain",
    chapeau: "Plus de souplesse : fabriqué à la demande, sans aucune trésorerie engagée dans du stock.",
    etapes: [
      COMMANDE,
      { icone: FlaskConical, label: "Fabrication", texte: "Le laboratoire fabrique à la demande, sous votre nom.", differe: true },
      { icone: Package, label: "Emballage", texte: "Votre packaging, sous votre nom de marque." },
      { icone: Truck, label: "Expédition", texte: "Le colis part directement chez votre client." },
      { icone: Check, label: "Livré", texte: "En 6 à 7" + NBSP + "jours." },
    ],
  },
  {
    icone: Zap, nom: "Mode Express", delai: "Livraison en 24 à 48" + NBSP + "heures",
    zone: "Monde entier",
    chapeau: "Votre stock chez notre logisticien : mêlez d’autres produits aux nôtres et personnalisez plus librement votre packaging.",
    etapes: [
      COMMANDE,
      { icone: Warehouse, label: "Prélevé dans votre stock", texte: "Nos produits et les vôtres, déjà chez le logisticien.", differe: true },
      { icone: Package, label: "Emballage", texte: "Votre packaging, personnalisé plus librement." },
      { icone: Truck, label: "Expédition", texte: "Expédié directement par le logisticien." },
      { icone: Check, label: "Livré", texte: "En 24 à 48" + NBSP + "heures." },
    ],
  },
];

/* Mode Standard, vers la France : src/data/livraison.ts, jumeau de
   biolystes.pro. TTC = HT × 1,2. */
const FRAIS = FRAIS_STANDARD_FRANCE.map((f) => ({
  poids: f.poids.replace(/ kg$/, NBSP + "kg"), ht: euros(f.ht), ttc: euros(ttc(f.ht)),
}));

/* Article 7 ter du contrat, « Disponibilité des produits », en clair. */
const RUPTURES: { icone: LucideIcon; titre: string; texte: string }[] = [
  {
    icone: FlaskConical, titre: "Fabriqué à la demande",
    texte: "Vos produits sont fabriqués à chaque commande, selon la disponibilité des matières premières. Nous ne gardons aucun stock pour vous, sauf en mode Express : le stock que vous avez acheté.",
  },
  {
    icone: Mail, titre: "Vous êtes prévenue par écrit",
    texte: "Si un produit ou une matière première manque, nous vous écrivons au plus vite, avec la date de retour prévue quand elle est connue.",
  },
  {
    icone: Repeat, titre: "Vous choisissez la solution",
    texte: "Attendre le retour du produit, prendre un produit équivalent que nous vous proposons, ou être remboursée du produit manquant. Sans réponse de votre part sous 15" + NBSP + "jours, la commande de ce produit reste en attente.",
  },
  {
    icone: Hourglass, titre: "Le reste part sans attendre",
    texte: "Les délais annoncés sont indicatifs. En cas de rupture, ceux du produit concerné sont suspendus, et les autres produits de la commande partent dès que possible.",
  },
  {
    icone: PackageCheck, titre: "Un produit arrêté",
    texte: "Si le fabricant arrête un produit, nous vous proposons une formule équivalente. Si vous la refusez, les produits commandés et non livrés vous sont remboursés.",
  },
  {
    icone: Users, titre: "Vos clientes",
    texte: "Vous prévenez vous-même vos clientes. Sur demande, nous vous donnons un message type et la date de retour prévue.",
  },
];

function CarteMode({ mode }: { mode: Mode }) {
  return (
    <div className="rounded-2xl bg-secondary p-6 md:p-8 min-w-0">
      <div className="flex items-center gap-3">
        <RondIcone icone={mode.icone} />
        <div className="min-w-0">
          <h3 className="text-[1.0625rem] !font-semibold text-foreground leading-snug"
            style={{ fontFamily: BRICOLAGE, textTransform: "none", letterSpacing: "-0.01em" }}>
            {mode.nom}
          </h3>
          <p className="text-[0.875rem] text-foreground">{mode.delai}</p>
        </div>
      </div>
      <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-background px-3.5 py-1.5 text-[0.875rem] text-foreground">
        <Globe className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        {mode.zone}
      </p>
      <p className="mt-4 text-[0.9375rem] text-foreground/80 leading-[1.7] text-pretty md:min-h-[3lh]">{mode.chapeau}</p>
      <ol className="mt-6">
        {mode.etapes.map((e, k) => (
          <li key={e.label} className="relative flex gap-4 pb-5 last:pb-0">
            {k < mode.etapes.length - 1 && <span aria-hidden="true" className="absolute left-[17px] top-9 bottom-0 w-px bg-border" />}
            <div className="relative w-9 h-9 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center">
              <e.icone className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div className="pt-1.5 min-w-0">
              <p className="text-[0.9375rem] font-semibold text-foreground leading-snug">
                <span className={e.differe ? "rounded bg-[#e1f3c5] px-1.5 -mx-1.5" : undefined}>{e.label}</span>
              </p>
              <p className="mt-0.5 text-[0.9375rem] text-foreground/70 leading-relaxed text-pretty">{e.texte}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CarteTexte({ icone, titre, children }: { icone: LucideIcon; titre: string; children: ReactNode }) {
  return (
    <div className="bg-secondary rounded-2xl p-6 md:p-7 flex items-start gap-4 min-w-0">
      <RondIcone icone={icone} />
      <div className="min-w-0">
        <h3 className="text-[1.0625rem] !font-semibold text-foreground leading-snug text-balance"
          style={{ fontFamily: BRICOLAGE, textTransform: "none", letterSpacing: "-0.01em" }}>
          {titre}
        </h3>
        <p className="mt-2 text-[0.9375rem] text-foreground/80 leading-[1.7] text-pretty">{children}</p>
      </div>
    </div>
  );
}

function CartePays({ groupe }: { groupe: (typeof DELAIS_PAR_PAYS)[number] }) {
  return (
    <div className="rounded-2xl bg-secondary p-6 md:p-7 min-w-0">
      <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Mode {groupe.mode}</p>
      <h3 className="mt-1 text-[1.0625rem] !font-semibold text-foreground leading-snug text-balance"
        style={{ fontFamily: BRICOLAGE, textTransform: "none", letterSpacing: "-0.01em" }}>
        {groupe.titre}
      </h3>
      <ul className="mt-4 divide-y divide-border">
        {lignesParDelai(groupe).map((l) => (
          <li key={l.jours} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
            <span className="shrink-0 w-[4.75rem] text-[0.9375rem] font-semibold text-foreground tabular-nums">
              {l.jours}{NBSP}j{NBSP}ouvrés
            </span>
            <span className="min-w-0 text-[0.9375rem] text-foreground/80 leading-[1.7] text-pretty">{l.pays.join(", ").replace(/\. /g, "." + NBSP)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SOMMAIRE: [string, string][] = [
  ["#modes", "Les deux modes"],
  ["#pays", "Pays et délais"],
  ["#preparation", "La préparation"],
  ["#frais", "Les frais de port"],
  ["#ruptures", "Les ruptures"],
  ["#colis", "Colis perdu ou abîmé"],
];

export default function LivraisonPage() {
  return (
    <>
      <SEO
        title="La livraison | Biolystes"
        description="Mode Standard ou Express, zones desservies, délais, préparation, frais de port selon le poids, ruptures : comment vos clientes reçoivent leurs commandes."
        path="/livraison"
      />

      {/* ═══ HAUT DE PAGE ═══ */}
      <section className="bg-background pt-12 md:pt-20 pb-10 md:pb-12 px-6">
        <Entete niveau={1} surtitre="La livraison"
          noir="Comment vos clientes" gris={"reçoivent leurs" + NBSP + "colis."}
          texte="Deux modes d’expédition, les zones desservies, les délais, la préparation et les frais de port : ce qui se passe entre la commande de votre cliente et son colis." />
        <nav aria-label="Sommaire" className="max-w-3xl mx-auto mt-8 md:mt-10 flex flex-wrap justify-center gap-2.5">
          {SOMMAIRE.map(([href, libelle]) => (
            <a key={href} href={href}
              className="rounded-full border border-border bg-background px-4 py-2 text-[0.875rem] text-foreground hover:bg-secondary transition-colors">
              {libelle}
            </a>
          ))}
        </nav>
      </section>

      {/* ═══ LES DEUX MODES ET LEURS ZONES ═══ */}
      <Bande id="modes" className="!pt-4 md:!pt-6">
        <div className="max-w-5xl mx-auto px-6">
          <Entete className="mb-8 md:mb-10" surtitre="Deux modes" noir="Standard ou Express," gris={"selon votre façon de" + NBSP + "vendre."} aLaLigne={false}
            texte="Le mode Standard livre l’Europe et le continent américain. Le mode Express livre le monde entier, depuis votre stock." />
          <div className="grid md:grid-cols-2 gap-4">
            {MODES.map((m) => <CarteMode key={m.nom} mode={m} />)}
          </div>
        </div>
      </Bande>

      {/* ═══ PAYS ET DÉLAIS (DONNÉES DE BIOLYSTES.PRO) ═══ */}
      <Bande id="pays">
        <div className="max-w-5xl mx-auto px-6">
          <Entete className="mb-8 md:mb-10" surtitre="Pays et délais" noir="Les pays livrés," gris={"pays par" + NBSP + "pays."} aLaLigne={false}
            texte="Le délai de transport de chaque pays, en jours ouvrés, selon le mode et le poids du colis." />
          <div className="grid md:grid-cols-2 gap-4">
            {DELAIS_PAR_PAYS.map((g) => <CartePays key={g.id} groupe={g} />)}
          </div>
          <p className="mt-6 text-center text-[0.9375rem] text-foreground/70 leading-[1.7] text-pretty max-w-2xl mx-auto">
            Votre pays n’est pas dans la liste&nbsp;? Demandez‑nous avant d’ouvrir vos ventes&nbsp;: nous vous confirmons s’il est desservi, et à quel tarif.
          </p>
        </div>
      </Bande>

      {/* ═══ LA PRÉPARATION ═══ */}
      <Bande id="preparation">
        <div className="max-w-5xl mx-auto px-6">
          <Entete className="mb-8 md:mb-10" surtitre="La préparation" noir="Deux jours ouvrés" gris={"pour préparer la" + NBSP + "commande."} aLaLigne={false} />
          <div className="grid md:grid-cols-2 gap-4">
            <CarteTexte icone={CalendarClock} titre={`De ${PREPARATION.produitsMin} à ${PREPARATION.produitsMax}${NBSP}produits`}>
              {`En mode Standard, une commande de ${PREPARATION.produitsMin} à ${PREPARATION.produitsMax} produits est préparée en deux jours ouvrés, impression à votre marque comprise. La fabrication peut demander ${FABRICATION.joursMin} à ${FABRICATION.joursMax}${NBSP}jours ouvrés de plus, selon la disponibilité des matières premières. Pour une commande plus importante, nous vous indiquons le délai au moment de la commande.`}
            </CarteTexte>
            <CarteTexte icone={PackageCheck} titre="Sans frais de préparation">
              La préparation de chaque commande est comprise dans le prix d’achat du produit. Seul le transport s’ajoute.
            </CarteTexte>
          </div>
        </div>
      </Bande>

      {/* ═══ LES FRAIS DE PORT ═══ */}
      <Bande id="frais">
        <div className="max-w-5xl mx-auto px-6">
          <Entete className="mb-8 md:mb-10" surtitre="Les frais de port" noir="Calculés selon le poids" gris={"du" + NBSP + "colis."} aLaLigne={false}
            texte="Le transport se paie au poids du colis, pas au nombre de produits. Sur votre boutique, vous choisissez : votre cliente le paie, ou vous l’offrez." />
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl bg-secondary p-4 md:p-6">
              <div className="flex items-center gap-3 px-2 pb-4">
                <RondIcone icone={Scale} petit />
                <p className="text-[0.9375rem] font-semibold text-foreground leading-snug">Mode Standard, livraison en France</p>
              </div>
              <table className="w-full text-left tabular-nums">
                <thead>
                  <tr className="text-[0.8125rem] text-muted-foreground">
                    <th scope="col" className="font-normal text-[0.8125rem] px-2 pb-2">Poids du colis</th>
                    <th scope="col" className="font-normal text-[0.8125rem] px-2 pb-2 text-right">HT</th>
                    <th scope="col" className="font-normal text-[0.8125rem] px-2 pb-2 text-right">TTC</th>
                  </tr>
                </thead>
                <tbody className="text-[0.9375rem] md:text-base text-foreground">
                  {FRAIS.map((f) => (
                    <tr key={f.poids} className="border-t border-border">
                      <th scope="row" className="font-normal px-2 py-3 text-[0.9375rem] md:text-base">{f.poids}</th>
                      <td className="px-2 py-3 text-right text-[0.9375rem] md:text-base">{f.ht}</td>
                      <td className="px-2 py-3 text-right text-[0.9375rem] md:text-base">{f.ttc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[0.875rem] text-foreground/70 leading-[1.7] text-pretty">
              {`Tarifs du transporteur au ${LIVRAISON_MISE_A_JOUR.replace(" ", NBSP)}, TVA de 20${NBSP}% comprise dans les prix TTC. Ils suivent ceux des transporteurs et peuvent changer sans préavis, avec des suppléments ponctuels en période de fêtes par exemple. Pour un autre pays, un colis de plus de 5${NBSP}kg ou le mode Express, nous vous donnons le tarif sur demande. Hors Union européenne, des droits de douane et des taxes peuvent s’ajouter à la réception du colis, à la charge du destinataire.`}
            </p>
          </div>
        </div>
      </Bande>

      {/* ═══ LES RUPTURES (ARTICLE 7 TER) ═══ */}
      <Bande id="ruptures">
        <div className="max-w-5xl mx-auto px-6">
          <Entete className="mb-8 md:mb-10" surtitre="Si un produit manque" noir="En cas de rupture," gris={"vous" + NBSP + "choisissez."} aLaLigne={false} />
          <div className="grid md:grid-cols-2 gap-4">
            {RUPTURES.map((r) => <CarteTexte key={r.titre} icone={r.icone} titre={r.titre}>{r.texte}</CarteTexte>)}
          </div>
        </div>
      </Bande>

      {/* ═══ COLIS PERDU OU ABÎMÉ (CGV, ARTICLE 6) ═══ */}
      <Bande id="colis">
        <div className="max-w-5xl mx-auto px-6">
          <Entete className="mb-8 md:mb-10" surtitre="Après la livraison" noir="Un colis perdu" gris={"ou" + NBSP + "abîmé."} aLaLigne={false} />
          <div className="grid md:grid-cols-2 gap-4">
            <CarteTexte icone={PackageX} titre="Écrivez-nous dans le mois">
              Votre cliente vous contacte. Vous nous transmettez sa réclamation avec le numéro de commande et des photos du produit et du carton, dans le mois qui suit la livraison, ou la date de livraison prévue pour un colis perdu.
            </CarteTexte>
            <CarteTexte icone={Repeat} titre="Le produit est renvoyé">
              Le produit endommagé ou défectueux est remplacé et renvoyé, en général sous 72&nbsp;heures. Un produit personnalisé à votre marque ne se retourne pas pour un simple changement d’avis.
            </CarteTexte>
          </div>
        </div>
      </Bande>

      {/* ═══ LE CONTRAT ═══ */}
      <Bande gris>
        <div className="max-w-3xl mx-auto px-6">
          <Entete surtitre="Le contrat" noir="Ces règles figurent" gris={"dans votre" + NBSP + "contrat."}
            texte={"Elles reprennent l’article 7\u00a0ter de votre contrat, «\u00a0Disponibilité des produits\u00a0», et nos conditions générales de vente. Hors faute de notre part, une rupture chez le fabricant n’ouvre pas droit à une autre indemnité que les solutions ci-dessus."} />
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/cgv" className="btn-outline">
              <span>Lire les conditions générales</span>
              <span className="arrow-circle"><FileText className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" /></span>
            </a>
          </div>
          <BoutonRdv className="mt-4" />
        </div>
      </Bande>
    </>
  );
}
