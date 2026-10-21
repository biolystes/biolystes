/* /pourquoi-cette-offre, dans le style de l’accueil (JP, 14/10/2026).
   Cadre, en-tête et pied de page : src/pages/pied/CadrePied.tsx.

   Retirés avec la nouvelle mise en page : l’organigramme interactif des
   équipes IA (curseur et onglets) et la maquette de fiche produit « Kaniwa »
   (faux avis 4,8/5, logos de paiement, photo déjà présente en haut de page).
   Chaque obstacle garde son texte et reçoit une seule image, jamais deux
   fois la même sur la page. */
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Camera, Clock, Headphones, Megaphone, MessageCircle, Shield, Sparkles, Target, type LucideIcon } from "lucide-react";
import SafeVideo from "@lystes/components/bio/SafeVideo";
import { Bande, BoutonRdv, Entete, Texte, TitreCarte } from "./pied/elements";

import eclose2 from "@/assets/eclose-2.jpg";
import valthea1 from "@/assets/valthea-1.jpg";
import pmyrris1 from "@/assets/pmyrris-1.jpg";
import pmyrrisUgc3 from "@/assets/pmyrris-ugc-3.jpg";
import pmyrrisUgc4 from "@/assets/pmyrris-ugc-4.jpg";
import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta3 from "@/assets/insta-3.jpg";
import insta4 from "@/assets/insta-4.jpg";
import aiHeroMockup from "@/assets/ai-hero-mockup.png";
import agenceReseaux from "@/assets/agence-reseaux.jpg";

type Media = { type: "image" | "video"; src: string };

function Visuel({ media, className = "" }: { media: Media; className?: string }) {
  return media.type === "image"
    ? <img src={media.src} alt="" className={"w-full h-full object-cover " + className} loading="lazy" />
    : <SafeVideo src={media.src} className={"w-full h-full object-cover " + className} />;
}

const OBSTACLES: {
  icone: LucideIcon; titre: string; probleme: string; offres: string; reponse: string; media: Media[];
}[] = [
  {
    icone: Camera,
    titre: "Le coût des photographes",
    probleme: "Faire appel à un photographe professionnel pour chaque produit représente un budget considérable. Beaucoup de créateurs se retrouvent avec des visuels médiocres faits au smartphone, ce qui tue la crédibilité de leur marque face à des concurrents qui investissent massivement dans leur image.",
    offres: "Pack Agence & Pack IA",
    reponse: "Nos offres intègrent la photographie IA hyperréaliste et le contenu UGC IA, vous offrant des visuels de qualité studio sans le coût d’un photographe.",
    media: [{ type: "image", src: eclose2 }, { type: "image", src: valthea1 }, { type: "image", src: pmyrris1 }],
  },
  {
    icone: Clock,
    titre: "Le manque de temps",
    probleme: "Gérer une marque cosmétique demande un investissement temps considérable : création de contenu, gestion des réseaux sociaux, réponse aux clients, suivi des commandes, optimisation du site. La plupart des créateurs ont un emploi à côté et ne peuvent tout simplement pas tout faire.",
    offres: "Pack Agence & Offre Communication",
    reponse: "L’offre Agence prend en charge la gestion complète de votre communication, et l’offre IA automatise les tâches chronophages comme le diagnostic client et les recommandations produits.",
    media: [{ type: "image", src: agenceReseaux }],
  },
  {
    icone: Brain,
    titre: "Le manque de compétences techniques",
    probleme: "Savoir formuler un produit ne signifie pas savoir le vendre. La majorité des créateurs ne maîtrisent ni le marketing digital, ni le SEO, ni la publicité en ligne, ni la création de contenu engageant. Et apprendre tout cela prend des années.",
    offres: "Pack Agence, Pack IA & Abonnements",
    reponse: "Nous prenons en charge l’intégralité de la partie technique et marketing : du site e‑commerce optimisé à la stratégie SEO, en passant par la gestion des campagnes publicitaires.",
    media: [{ type: "image", src: aiHeroMockup }],
  },
  {
    icone: MessageCircle,
    titre: "L’incapacité à conseiller les clients",
    probleme: "Les clients posent des questions techniques sur les produits : quel soin pour ma peau, quelle routine adopter, quels ingrédients éviter. Sans expertise dermocosmétique ou sans temps pour répondre, les créateurs perdent des ventes et de la crédibilité.",
    offres: "Pack IA & Biolystes AI",
    reponse: "Notre technologie IA déploie des agents conversationnels sur chaque fiche produit, capables de conseiller les clients 24h/24 dans plus de 100 langues, avec une connaissance approfondie de vos produits.",
    media: [{ type: "image", src: pmyrrisUgc4 }],
  },
  {
    icone: Megaphone,
    titre: "La gestion des réseaux sociaux",
    probleme: "Publier régulièrement du contenu de qualité sur Instagram, TikTok, Facebook et Pinterest demande une constance et une créativité que peu de créateurs isolés peuvent maintenir. Résultat : des comptes fantômes qui nuisent à l’image de la marque.",
    offres: "Offre Communication & Abonnements",
    reponse: "Nos offres communication et nos abonnements Community Manager prennent en charge la création de contenu, le calendrier éditorial et la gestion quotidienne de vos réseaux sociaux.",
    media: [{ type: "image", src: insta1 }, { type: "image", src: insta2 }, { type: "image", src: insta3 }],
  },
  {
    icone: Target,
    titre: "Le diagnostic client",
    probleme: "Proposer un diagnostic de peau ou de cheveux personnalisé est un levier de conversion puissant, mais techniquement complexe à mettre en place. La plupart des marques ne proposent rien de tel, perdant ainsi une opportunité majeure de différenciation.",
    offres: "Pack IA & Biolystes AI",
    reponse: "Notre diagnostic intelligent par IA analyse le profil du client et recommande les produits adaptés, augmentant considérablement le taux de conversion.",
    media: [{ type: "video", src: "/videos/lystesai-demo.mov" }],
  },
];

const REPONSES = [
  { probleme: "Pas de photographe", effet: "Pas de beaux visuels", offre: "Pack Agence", reponse: "Photographie IA hyperréaliste incluse" },
  { probleme: "Pas de temps", effet: "Site inactif", offre: "Pack Agence + Abonnement", reponse: "Gestion 360° déléguée" },
  { probleme: "Pas de compétences marketing", effet: "0 vente", offre: "Offre Communication", reponse: "Stratégie marketing complète" },
  { probleme: "Pas de conseil client", effet: "Perte de crédibilité", offre: "Pack IA / Biolystes AI", reponse: "Agents IA sur chaque fiche produit" },
  { probleme: "Pas de réseaux sociaux", effet: "Marque invisible", offre: "Abonnement Community Manager", reponse: "Gestion quotidienne des réseaux" },
  { probleme: "Pas de diagnostic", effet: "Faible conversion", offre: "Pack IA / Biolystes AI", reponse: "Diagnostic intelligent par IA" },
  { probleme: "Tout déléguer", effet: "Besoin d’un partenaire", offre: "Pack IA complet", reponse: "Solution clés en main de A à Z" },
];

const OFFRES = [
  { icone: Shield, titre: "L’offre Agence", lien: "/", desc: "Pour ceux qui veulent une gestion 360° sans se soucier de la technique. Logo, packaging, site, SEO, livraison : tout est pris en charge." },
  { icone: Sparkles, titre: "L’offre IA", lien: "/ai", desc: "Pour ceux qui veulent aller plus loin avec l’intelligence artificielle : UGC IA, diagnostic client, agents conversationnels, recommandations produits." },
  { icone: Megaphone, titre: "L’offre Communication", lien: "/agence", desc: "Pour ceux qui ne peuvent pas faire appel à des photographes ou des marketeurs. Réseaux sociaux, contenu, publicité : on s’occupe de tout." },
  { icone: Headphones, titre: "Les abonnements", lien: "/rdv", desc: "Pour ceux qui veulent tout déléguer : marketing, CRO, community management. Un accompagnement continu pour faire grandir votre marque." },
];

const HAUT: Media[] = [
  { type: "video", src: "/videos/trustpilot-ugc.mp4" },
  { type: "image", src: pmyrrisUgc3 },
  { type: "video", src: "/videos/diagnostic-peau.mov" },
  { type: "image", src: insta4 },
];

const VIDEOS_EVOLUTION = ["/videos/exp-42.mov", "/videos/exp-5.mov", "/videos/exp-50.mov", "/videos/event-beauty.mp4"];

export default function PourquoiCetteOffrePage() {
  return (
    <>
      {/* ═══ HAUT DE PAGE ═══ */}
      <section className="bg-background pt-12 md:pt-20 pb-12 md:pb-16 px-6">
        <Entete niveau={1} surtitre="Notre engagement"
          noir="Pourquoi une offre" gris={"aussi complète ?"}
          texte="Créer un site ne suffit pas : trop de marques restent inactives après leur lancement. Voici pourquoi nous avons fait évoluer notre offre." />
        <div className="max-w-5xl mx-auto mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          {HAUT.map((m) => (
            <div key={m.src} className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary">
              <Visuel media={m} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ LE CONSTAT ═══ */}
      <Bande gris>
        <div className="max-w-4xl mx-auto px-6">
          <Entete className="mb-10" surtitre="Le constat qui a tout changé"
            noir="Des sites livrés." gris="Zéro activité."
            texte="Malgré tous nos efforts pour créer des sites e‑commerce de qualité, nous avons constaté un problème récurrent." />
          <div className="max-w-[720px] mx-auto bg-background rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[48px] md:text-[56px] leading-none tracking-tight text-foreground"
              style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif", fontWeight: 300 }}>4 mois</p>
            <Texte className="mt-4 max-w-lg mx-auto">
              Après la mise en ligne : aucune publication sur les réseaux sociaux, aucun contenu ajouté, aucune stratégie mise en place. Des projets qui avaient tout pour réussir, mais qui restaient figés.
            </Texte>
          </div>
        </div>
      </Bande>

      {/* ═══ LES SIX OBSTACLES ═══ */}
      <Bande>
        <div className="max-w-5xl mx-auto px-6">
          <Entete className="mb-10 md:mb-12" surtitre="Six obstacles"
            noir="Pourquoi ces sites" gris={"restent inactifs ?"}
            texte="En nous rapprochant de ces créateurs pour comprendre leur inactivité, les raisons étaient toujours les mêmes : un manque de moyens, de temps ou de compétences, jamais de motivation." />
          <div className="space-y-4">
            {OBSTACLES.map((o) => (
              <div key={o.titre} className="bg-secondary rounded-2xl p-4 md:p-5 grid md:grid-cols-2 gap-5 md:gap-8">
                <div className="p-2 md:p-4 flex flex-col">
                  <TitreCarte icone={o.icone}>{o.titre}</TitreCarte>
                  <p className="mt-5 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Le problème</p>
                  <Texte className="mt-2">{o.probleme}</Texte>
                  <div className="mt-5 bg-background rounded-xl p-4 md:p-5">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Notre réponse</p>
                    <p className="mt-2 text-[0.9375rem] md:text-base text-foreground leading-[1.75] text-pretty">{o.reponse}</p>
                    <p className="mt-3"><span className="inline-block rounded bg-[#e1f3c5] px-2 py-0.5 text-[0.8125rem] text-foreground">{o.offres}</span></p>
                  </div>
                </div>
                <div className={"min-h-[260px] md:min-h-0 rounded-xl overflow-hidden grid gap-2 " + (o.media.length === 3 ? "grid-cols-3" : "grid-cols-1")}>
                  {o.media.map((m) => (
                    <div key={m.src} className="relative rounded-xl overflow-hidden bg-background">
                      <Visuel media={m} className="absolute inset-0" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Bande>

      {/* ═══ CE QUE L’OFFRE RÉPOND ═══ */}
      <Bande gris>
        <div className="max-w-4xl mx-auto px-6">
          <Entete className="mb-10" surtitre="En résumé"
            noir="Comment notre offre répond" gris={"à chaque problème."} />
          <div className="rounded-2xl bg-background overflow-hidden">
            <div className="hidden lg:grid grid-cols-[1.25fr_1fr_1fr] gap-6 px-6 pt-5 pb-3 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              <span>Problème constaté</span><span>Offre</span><span>Réponse</span>
            </div>
            <ul className="divide-y divide-border">
              {REPONSES.map((r) => (
                <li key={r.probleme} className="grid lg:grid-cols-[1.25fr_1fr_1fr] gap-x-6 gap-y-2 px-6 py-4 lg:items-center">
                  <span className="text-[0.9375rem] text-foreground">
                    <span className="block font-medium">{r.probleme}</span>
                    <span className="block text-muted-foreground">{r.effet}</span>
                  </span>
                  <span><span className="inline-block bg-secondary rounded-full px-3 py-1 text-[12px] text-foreground">{r.offre}</span></span>
                  <span className="text-[0.9375rem] text-muted-foreground text-pretty">{r.reponse}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Bande>

      {/* ═══ UNE OFFRE QUI A ÉVOLUÉ ═══ */}
      <Bande>
        <div className="max-w-4xl mx-auto px-6">
          <Entete className="mb-10" surtitre="Notre histoire"
            noir="Une offre qui a évolué" gris={"avec nos constatations."} />
          <div className="max-w-[720px] mx-auto space-y-4">
            <Texte>Notre offre n’a pas toujours été aussi complète. Au départ, nous nous concentrions uniquement sur la création de la marque et du site e‑commerce. Mais au fil des mois, nous avons constaté que cela ne suffisait pas.</Texte>
            <Texte>Des créateurs motivés, avec de bons produits et un beau site, n’arrivaient pas à faire décoller leur projet. Non pas parce que le produit était mauvais, mais parce qu’ils étaient seuls face à des défis qu’ils ne pouvaient pas relever : la photographie, le marketing, les réseaux sociaux, le conseil client, la publicité.</Texte>
            <Texte>C’est pour répondre à ces besoins, <strong className="text-foreground">en fonction des moyens de chacun</strong>, que nous avons progressivement enrichi notre offre :</Texte>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {VIDEOS_EVOLUTION.map((src) => (
              <div key={src} className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary">
                <SafeVideo src={src} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {OFFRES.map((o) => (
              <Link key={o.titre} to={o.lien} className="group bg-secondary rounded-2xl p-6 md:p-8 no-underline hover:bg-[#ececee] transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <TitreCarte icone={o.icone}>{o.titre}</TitreCarte>
                  <ArrowRight className="w-4 h-4 shrink-0 text-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <Texte className="mt-4">{o.desc}</Texte>
              </Link>
            ))}
          </div>
        </div>
      </Bande>

      {/* ═══ NOTRE OBJECTIF ═══ */}
      <Bande gris>
        <div className="max-w-4xl mx-auto px-6">
          <Entete className="mb-10" surtitre="Notre objectif"
            noir="Que votre projet" gris={"aboutisse réellement."} />
          <div className="max-w-[720px] mx-auto space-y-4">
            <Texte>C’est pour cela que nous avons une offre aussi complète, qui a évolué au fur et à mesure de nos constatations. Chaque ajout (l’IA, la communication, les abonnements) est né d’un problème réel que nous avons observé chez nos clients.</Texte>
            <Texte>Parce qu’un site sans contenu est un site mort. Une marque sans visibilité est une marque invisible. Et un entrepreneur sans accompagnement est un entrepreneur seul face à des défis qui dépassent souvent ses compétences ou son temps disponible.</Texte>
          </div>
          <div className="mt-12 text-center">
            <p className="text-[1.125rem] md:text-[1.25rem] text-foreground max-w-lg mx-auto leading-relaxed text-pretty"
              style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif", fontWeight: 300 }}>
              Nous voulons que le maximum d’entre vous puisse réussir avec&nbsp;nous.
            </p>
            <BoutonRdv className="mt-8" />
          </div>
        </div>
      </Bande>
    </>
  );
}
