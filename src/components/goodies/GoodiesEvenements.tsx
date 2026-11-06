/* Case publicitaire « Goodies pour vos events » (4e case de /goodies) + pop-up « En savoir plus ».
   Textes adaptés de la page événementiel du fournisseur, sans son nom, sans prix ni délai. */
import { useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, MessageCircle, X } from "lucide-react";
import photo from "@/assets/goodies_evenement.png.asset.json";
import { PRODUITS_GOODIES } from "@/data/goodies";
import { LIEN_WHATSAPP_EXPERTE } from "@/lib/whatsapp";

const NOIR = "rgb(29,29,31)";
const BANDE = "#f3f4f5";

type Vignette = { nom: string; image: string };
const depuis = (slug: string): Vignette | null => {
  const p = PRODUITS_GOODIES.find((x) => x.slug === slug);
  return p ? { nom: p.nom, image: p.variantes[0].image } : null;
};
const cdn = (id: string) => `https://cdn-pim.packhelp.com/assets/${id}?w=600&fit=min&auto=format`;

const SECTIONS: { sur: string; titre: string; texte: string; produits: Vignette[] }[] = [
  {
    sur: "Votre marque, servie sur un plateau.",
    titre: "Packaging alimentaire personnalisé",
    texte: "La gastronomie rassemble. Un packaging de qualité invite votre marque à la table des conversations. Boîtes alimentaires, gobelets, manchons, sacs, serviettes et emballages à emporter à vos couleurs, pour une image de marque cohérente, du premier café à la dernière bouchée.",
    produits: [
      { nom: "Boîte pâtisserie personnalisée", image: cdn("6c09805b-1c00-4086-8781-ac52de5ea021/543716-bakery-boxes") },
      { nom: "Plateau snack et boisson personnalisé", image: cdn("64003c80-db63-4b06-9dc9-fd447abd17cd/954268-snack-drink-trays-fixed-1") },
      { nom: "Set gobelet à bière et sous-bock", image: cdn("247c9741-4a03-4025-a180-f24e0aceae64/91173-beer-cups-coasters-set") },
      { nom: "Porte-gobelets personnalisé", image: cdn("7898d810-e4a2-4a56-a07b-09e71742fd99/480492-4-pack-drink-carriers-new-1") },
      { nom: "Boîte à pizza personnalisée pour événements", image: cdn("490c8ad8-cb16-4597-91e4-1be86d731600/472977-branded-pizza-boxes") },
    ],
  },
  {
    sur: "Votre marque, à porter.",
    titre: "Goodies textiles personnalisés",
    texte: "Les meilleurs goodies font bien plus qu'arborer un logo. Ils deviennent partie intégrante de l'expérience et restent visibles longtemps après l'événement. Créez des vêtements et accessoires que vos invités auront vraiment envie de porter, d'utiliser et de rapporter chez eux.",
    produits: ["casquette-personnalisee-pour-evenements", "t-shirt-personnalise-pour-evenements", "chemise-personnalisee-pour-evenements"].map(depuis).filter(Boolean) as Vignette[],
  },
  {
    sur: "Votre marque, dans les moindres détails.",
    titre: "Accessoires événementiels et promotionnels",
    texte: "Parfois, les plus petits points de contact ont le plus grand impact. Complétez votre événement avec des badges, bracelets, tours de cou, autocollants et accessoires promotionnels personnalisés qui aident vos invités à s'orienter, à participer et à se souvenir de l'expérience.",
    produits: [
      "ballons-publicitaires-personnalises", "badge-publicitaire-personnalise", "kakemono-publicitaire-personnalise",
      "chaise-longue-publicitaire-personnalisee", "stickers-decoupes-personnalises", "affiche-publicitaire-personnalisee",
      "lingette-microfibre-personnalisee", "bracelet-evenementiel-personnalise", "tote-bag",
      "sac-cadeau-personnalise-pour-emballer-des-objets-publicitaires", "papier-de-soie-personnalise-pour-emballer-des-objets-publicitaires",
      "stylo-personnalise-pour-evenements",
    ].map(depuis).filter(Boolean) as Vignette[],
  },
];

const POURQUOI = [
  { titre: "Une expertise au service de vos marques", texte: "Biolystes aide les marques ambitieuses à tisser des liens physiques plus forts avec leurs clientes. Nous mettons cette expertise au service de chaque aspect de votre événement, en combinant packaging, goodies et articles promotionnels pour une présence de marque cohérente et à votre image." },
  { titre: "Tout pour votre événement, au même endroit", texte: "Packaging alimentaire pour le lieu de réception. Goodies pour vos invités. Boîtes personnalisées pour les invitations et les kits de bienvenue. Accessoires pour le personnel et les participants. Plutôt que de jongler avec plusieurs fournisseurs, centralisez toute votre gamme événementielle auprès d'un seul partenaire." },
  { titre: "Des expertes pour tout orchestrer", texte: "L'organisation d'un événement implique déjà bien assez de variables. Vos supports de marque ne devraient pas en être une de plus. Nos conseillères vous aident à choisir les bons produits, matériaux et options de personnalisation, puis coordonnent toute la commande selon votre brief et votre charte graphique." },
];

const FAQ = [
  { q: "Quels goodies puis-je commander pour mon événement ?", r: "Textile (t-shirts, casquettes, chemises, sweats), tote bags et sacs, gourdes et mugs, papeterie, badges, bracelets, kakémonos, affiches, stickers et emballages : tout le catalogue de cette page." },
  { q: "Puis-je commander packaging, goodies et accessoires en même temps ?", r: "Oui. Ajoutez tout ce dont vous avez besoin à « Ma commande » : notre équipe regroupe l'ensemble dans une seule demande." },
  { q: "Pouvez-vous m'aider à planifier toute ma commande ?", r: "Oui. Une experte vous accompagne sur le choix des produits, des quantités et de la personnalisation, à partir de votre brief." },
  { q: "Chaque goodie peut-il porter mon logo ?", r: "Oui, chaque produit est personnalisable avec votre logo, vos couleurs ou vos messages." },
  { q: "Pouvez-vous créer des emballages pour les invitations et les kits de bienvenue ?", r: "Oui : boîtes d'expédition cadeau, de bienvenue ou événementielles, papier de soie, rubans et cartes de remerciement à votre marque." },
  { q: "Quelle est la quantité minimale de commande ?", r: "Elle dépend du produit. Notre équipe vous l'indique avec le devis." },
];

function Popup({ onFermer }: { onFermer: () => void }) {
  const [faq, setFaq] = useState<number | null>(null);
  return createPortal(
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 10000000, background: "rgba(0,0,0,0.35)" }} onClick={onFermer} />
      <div role="dialog" aria-label="Goodies pour vos événements" className="inset-x-0 top-10 mx-auto overflow-y-auto rounded-[20px]"
        style={{ position: "fixed", zIndex: 10000001, background: "#ffffff", width: "min(1000px, 94vw)", maxHeight: "calc(100dvh - 80px)" }}>
        <button onClick={onFermer} aria-label="Fermer" className="absolute right-4 top-4 z-10 w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ background: BANDE }}><X className="w-4 h-4" /></button>

        <div className="grid md:grid-cols-2">
          <img src={photo.url} alt="Goodies personnalisés lors d'un événement" className="w-full h-full object-cover md:rounded-l-[20px] max-h-[520px]" />
          <div className="p-6 md:p-10 flex flex-col justify-center gap-4">
            <h2 className="text-3xl md:text-[38px] leading-[1.1]" style={{ color: NOIR }}>Des goodies personnalisés qui mettent votre marque sur le devant de la scène.</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">Les grands événements sont faits de moments mémorables. Assurez-vous que chacun d'eux porte votre signature. Des emballages alimentaires et gobelets personnalisés aux tote bags, vêtements, badges et bracelets à vos couleurs : créez une expérience de marque cohérente tout au long de votre événement.</p>
            <a href={LIEN_WHATSAPP_EXPERTE} target="_blank" rel="noopener noreferrer" className="self-start inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-medium" style={{ background: NOIR, color: "#fff" }}>
              <MessageCircle className="w-4 h-4" /> Obtenir un devis
            </a>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-12">
          {SECTIONS.map((s) => (
            <section key={s.titre} className="space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-[1px] text-muted-foreground">{s.sur}</p>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.3px]" style={{ color: NOIR }}>{s.titre}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">{s.texte}</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {s.produits.map((p) => (
                  <div key={p.nom} className="shrink-0 w-[160px] rounded-2xl overflow-hidden" style={{ background: BANDE }}>
                    <img src={p.image} alt={p.nom} loading="lazy" className="w-full aspect-square object-cover" />
                    <p className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.3px] leading-snug line-clamp-2" style={{ color: NOIR }}>{p.nom}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[1px] text-muted-foreground">Pourquoi Biolystes</p>
            <div className="grid md:grid-cols-3 gap-3">
              {POURQUOI.map((b) => (
                <div key={b.titre} className="rounded-2xl p-5 space-y-2" style={{ background: BANDE }}>
                  <h4 className="text-sm font-semibold" style={{ color: NOIR }}>{b.titre}</h4>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{b.texte}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 max-w-3xl">
            <h3 className="text-2xl" style={{ color: NOIR }}>Un événement. Une marque. Chaque point de contact maîtrisé.</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">Vos invités viennent pour l'expérience, mais ce sont les détails qu'ils emportent avec eux. La boîte dans laquelle arrive leur invitation. Le gobelet qu'ils tiennent pendant la première pause-café. Le tote bag qu'ils rapportent à la maison. Chacun de ces éléments est une occasion de rendre votre marque plus visible, plus mémorable et plus cohérente. Biolystes réunit au même endroit packaging personnalisé, goodies et accessoires à vos couleurs, pour que tout votre événement parle le même langage visuel.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-2xl" style={{ color: NOIR }}>FAQ</h3>
            {FAQ.map((f, i) => (
              <div key={f.q} className="rounded-xl" style={{ background: BANDE }}>
                <button type="button" onClick={() => setFaq(faq === i ? null : i)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium" style={{ color: NOIR }}>
                  {f.q} <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${faq === i ? "rotate-180" : ""}`} />
                </button>
                {faq === i && <p className="px-4 pb-4 text-[13px] leading-relaxed text-muted-foreground">{f.r}</p>}
              </div>
            ))}
          </section>

          <section className="rounded-2xl p-6 md:p-8 text-center space-y-3" style={{ background: BANDE }}>
            <h3 className="text-2xl" style={{ color: NOIR }}>Vous ne savez pas par où commencer ?</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">Décrivez-nous votre projet et notre équipe s'occupe du reste. De la sélection des bons goodies à la coordination de toute la commande, nous vous aidons à créer une expérience inoubliable pour vos invités.</p>
            <a href={LIEN_WHATSAPP_EXPERTE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-medium" style={{ background: NOIR, color: "#fff" }}>
              <MessageCircle className="w-4 h-4" /> Parler à une experte
            </a>
          </section>
        </div>
      </div>
    </>,
    document.body,
  );
}

export default function CarteEvenements() {
  const [ouvert, setOuvert] = useState(false);
  return (
    <>
      <button type="button" data-carte-evenements onClick={() => setOuvert(true)} className="relative rounded-[20px] overflow-hidden text-left min-h-[300px]" style={{ background: NOIR }}>
        <img src={photo.url} alt="Goodies personnalisés pour vos événements" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))" }}>
          <span className="text-[11px] font-bold uppercase tracking-[0.3px]" style={{ color: "#fff" }}>Goodies pour vos events</span>
          <span className="self-start inline-flex items-center h-8 px-3 rounded-lg text-[11px] font-semibold" style={{ background: "#fff", color: NOIR }}>En savoir plus</span>
        </div>
      </button>
      {ouvert && <Popup onFermer={() => setOuvert(false)} />}
    </>
  );
}
