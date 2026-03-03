import { motion } from "framer-motion";
import { ArrowRight, Check, X, Leaf, FlaskConical, Truck, Globe, Sparkles, ScanFace, MessageCircle, QrCode, Camera, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const obstacles = [
  {
    title: "Le stock",
    text: "La majorite des createurs investissent jusqu'a 90% de leur budget dans l'achat de stock. Une fois la marque lancee, il ne reste plus rien pour se faire connaitre. Sans visibilite, pas de ventes. Le stock dort, la tresorerie fond, et le projet s'arrete.",
  },
  {
    title: "La fabrication",
    text: "Trouver la bonne formule, le bon dosage, le bon equilibre. Certains de nos clients avaient passe huit mois, un an, parfois des annees en allers-retours avec des laboratoires, sans jamais reussir a finaliser un seul produit.",
  },
  {
    title: "La chaine de prestataires",
    text: "Il ne suffit pas de trouver un bon laboratoire. Il faut aussi le bon designer, le bon photographe, le bon developpeur. Si un seul maillon est faible, c'est toute votre image de marque qui en souffre.",
  },
  {
    title: "La procrastination",
    text: "Des projets qui restent a l'etat d'idee pendant des mois, parce que la complexite du parcours pousse a toujours remettre a demain.",
  },
  {
    title: "Les certifications",
    text: "COSMOS, ECOCERT, FDA, CPNP, ISO 22716, packaging recyclable, sans parabenes, sans silicones, sans microplastiques. Cocher toutes ces cases par vous-meme, ca prend des annees.",
  },
  {
    title: "Le manque de recul",
    text: "Chaque nouvelle formulation demande du temps pour etre affinee. C'est un investissement en temps que la plupart des createurs n'ont tout simplement pas.",
  },
];

const lystesAiPillars = [
  {
    icon: ScanFace,
    title: "Diagnostic intelligent",
    text: "Votre visiteur prend un selfie. L'IA scanne son visage, analyse sa peau en detail, et recommande automatiquement les produits les plus adaptes de votre boutique.",
  },
  {
    icon: MessageCircle,
    title: "Experts produits IA",
    text: "Chaque produit dispose de son propre expert dedie. Il repond instantanement aux questions sur la composition, la compatibilite, les delais. Comme votre meilleur vendeur, forme sur chaque detail.",
  },
  {
    icon: QrCode,
    title: "Coach post-achat",
    text: "Via un QR code sur votre packaging, votre client accede a un coach IA personnel. Conseils d'utilisation, routines adaptees, suggestions complementaires. Moins de retours, plus de fidelisation.",
  },
  {
    icon: Camera,
    title: "Studio creatif IA",
    text: "Photos produits niveau studio professionnel, visuels UGC avec de vrais visages pour vos reseaux sociaux, contenus marketing. En quelques secondes, sans shooting.",
  },
  {
    icon: BarChart3,
    title: "Tableau de bord intelligent",
    text: "Un assistant IA connait vos chiffres en temps reel. CA, tops produits, questions clients, points de blocage. Des decisions basees sur la realite, pas sur des suppositions.",
  },
];

const eliminates = [
  "Chercher des laboratoires fiables",
  "Investir dans du stock",
  "Gerer les expeditions et la logistique",
  "Creer un site e-commerce",
  "Payer un designer pour le packaging",
  "Organiser des shootings photo",
];

const provides = [
  "Meilleurs laboratoires europeens, certifies Bio, Vegan, COSMOS, ECOCERT, FDA",
  "Packaging 100% recyclable",
  "Zero stock, pas de minimum de commande",
  "Livraison directe au client final",
  "Site e-commerce inclus dans les packs avec site",
  "Creation de logo et packaging inclus",
  "Photos generees par IA, hyperrealistes",
  "Lancement rapide en 15 jours",
];

export default function ConceptPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="relative max-w-4xl mx-auto px-6 py-32 md:py-44 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-primary-foreground/50 text-sm tracking-[0.3em] uppercase mb-8"
          >
            Biolystes
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-light text-primary-foreground leading-[1.1] tracking-tight"
          >
            Sur dix marques qui se lancent,{" "}
            <span className="font-semibold">huit echouent.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-lg md:text-xl text-primary-foreground/60 max-w-2xl mx-auto leading-relaxed"
          >
            Ce n'est pas une opinion, c'est une statistique. Nous avons elimine chacun de ces obstacles pour que vous puissiez vous concentrer sur l'essentiel.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <a href="https://app.iclosed.io/e/paylystes/r2" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 rounded-full px-8 h-12 text-sm tracking-wide"
              >
                Prendre rendez-vous
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Section 1 — Les obstacles */}
      <section className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6"
        >
          <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Le constat
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight">
            Les raisons sont presque toujours les memes.
          </motion.h2>
        </motion.div>

        <div className="mt-16 grid gap-0 divide-y divide-border">
          {obstacles.map((item, i) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              custom={i}
              className="py-8 md:py-10 grid md:grid-cols-[200px_1fr] gap-4 md:gap-12"
            >
              <p className="text-sm font-semibold text-foreground tracking-wide">{item.title}</p>
              <p className="text-muted-foreground leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="mt-16 p-8 md:p-12 rounded-2xl bg-foreground text-primary-foreground"
        >
          <p className="text-xl md:text-2xl font-light leading-relaxed">
            Huit chances sur dix de tomber dans un de ces cas de figure. C'est ce constat qui a donne naissance a Biolystes. Nous avons elimine chacun de ces obstacles, un par un, pour que vous puissiez vous concentrer sur l'essentiel : <span className="font-semibold">vendre et developper votre marque.</span>
          </p>
        </motion.div>
      </section>

      {/* Section 2 — Le concept */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Le concept
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl">
              Vous vendez, on s'occupe de tout le reste.
            </motion.h2>
          </motion.div>

          <div className="mt-16 space-y-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6"
            >
              <p>
                Bonjour, je suis Mathieu de Biolystes. Forts de 18 ans d'experience dans l'e-commerce et la beaute, nous avons deja accompagne plus de 100 marques grace a une solution cle en main pour lancer la votre en seulement 10 a 15 jours.
              </p>
              <p>
                Zero stock, zero risque. Votre client commande, notre reseau de laboratoires francais et europeens d'excellence fabrique le produit a la demande, et nous l'expedions directement chez lui, sous votre nom. Aucun minimum de commande.
              </p>
              <p>
                Tous nos produits sont certifies ECOCERT, COSMOS, et conformes aux normes europeennes et americaines. C'est ce niveau d'exigence qui a convaincu des expertes internationales comme Sev Formal et ses 400 000 abonnes, ainsi que des marques comme Kaniwa Botanique et Fralene Paris, de nous confier la creation de leur marque.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="grid sm:grid-cols-3 gap-6"
            >
              {[
                { icon: FlaskConical, label: "Laboratoires certifies", sub: "Francais et europeens" },
                { icon: Truck, label: "Zero stock", sub: "Aucun minimum de commande" },
                { icon: Globe, label: "10 a 15 jours", sub: "Pour lancer votre marque" },
              ].map((item) => (
                <div key={item.label} className="p-6 rounded-2xl bg-background">
                  <item.icon className="h-5 w-5 text-foreground mb-4" />
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.sub}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3 — Les deux etapes */}
      <section className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6"
        >
          <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Le processus
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight">
            Deux etapes. C'est tout.
          </motion.h2>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Etape 1 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-10 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-sm font-semibold">1</span>
              <h3 className="text-xl font-semibold tracking-tight">Mise en place de votre marque</h3>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
              <p>Votre expert produit vous accompagne dans la selection de vos cosmetiques parmi notre catalogue certifie bio et vegan. Des formulations clean, sans parabenes, sans silicones, sans ingredients controverses.</p>
              <p>Nous realisons un brief creatif pour comprendre l'ADN de votre projet. Un chef de projet dedie pilote l'ensemble de nos equipes. Un seul interlocuteur, zero complexite pour vous.</p>
              <p>En quelques jours, vous recevez l'integralite de vos livrables : logo, identite visuelle, design packagings recyclables, photos IA hyperrealistes, contenu du site redige et optimise, et votre boutique en ligne prete a vendre.</p>
            </div>
          </motion.div>

          {/* Etape 2 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-10 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-sm font-semibold">2</span>
              <h3 className="text-xl font-semibold tracking-tight">Gestion au quotidien</h3>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
              <p>Cote ventes, Lystes.ai travaille pour vous jour et nuit. Un expert produit IA repond aux questions 24h/24. Le diagnostic intelligent scanne le visage de votre client et recommande les produits adaptes.</p>
              <p><strong className="text-foreground">Mode standard</strong> — Votre client commande, le laboratoire fabrique et expedie directement sous votre nom. Aucun stock, livraison en 6-7 jours.</p>
              <p><strong className="text-foreground">Mode express</strong> — Livraison en 24 a 48 heures grace a un stock tampon. Reapprovisionnement automatique chaque semaine, sans minimum.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4 — Lystes.ai */}
      <section className="bg-foreground text-primary-foreground">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-primary-foreground/50">
              Lystes.ai
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl">
              Cinq departements IA. Une seule plateforme.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/60 max-w-2xl leading-relaxed">
              Diagnostic, experts, coaching, contenu, pilotage. Connectee a votre boutique des le premier jour.
            </motion.p>
          </motion.div>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lystesAiPillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10"
              >
                <pillar.icon className="h-5 w-5 text-primary-foreground/70 mb-4" />
                <h3 className="text-sm font-semibold mb-2">{pillar.title}</h3>
                <p className="text-sm text-primary-foreground/60 leading-relaxed">{pillar.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ce que Biolystes elimine / prend en charge */}
      <section className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">Vous n'avez plus a</p>
            <div className="space-y-4">
              {eliminates.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <X className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-muted-foreground text-[15px]">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">Nous prenons tout en charge</p>
            <div className="space-y-4">
              {provides.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-foreground mt-0.5 shrink-0" />
                  <p className="text-foreground text-[15px]">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marques references */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Ils nous font confiance
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight">
              Plus de 100 marques accompagnees.
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a
              href="https://kaniwabotanique.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl bg-background hover:bg-accent transition-colors text-sm font-medium text-foreground"
            >
              Kaniwa Botanique
            </a>
            <a
              href="https://fraleneparis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl bg-background hover:bg-accent transition-colors text-sm font-medium text-foreground"
            >
              Fralene Paris
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-light tracking-tight">
            En resume : vous vendez, on s'occupe de tout le reste.
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Vous ne lancez pas juste une marque. Vous lancez une marque equipee pour vendre.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <a href="https://app.iclosed.io/e/paylystes/r2" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="rounded-full px-8 h-12 text-sm tracking-wide mt-4"
              >
                Prendre rendez-vous avec un expert
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer minimal */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">
          Biolystes — Paris, France — hello@biolystes.com
        </p>
      </footer>
    </div>
  );
}
