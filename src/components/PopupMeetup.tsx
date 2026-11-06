/* Pop-up « En savoir plus » de la carte Backstage (/meetup) : déroulé d'un micro-événement,
   d'après le document « Micro-événement de marque ». Illustré par les vidéos du carrousel de l'accueil. */
import { X } from "lucide-react";
import { LIEN_WHATSAPP_EXPERTE } from "@/lib/whatsapp";

const NOIR = "#1d1d1f";
const BANDE = "#f4f4f2";
const vid = (n: number) => ({ src: `/videos/bio-exp/exp-${n}.mp4`, affiche: `/videos/bio-exp/exp-${n}.webp` });
const VIDEOS = [1, 2, 3, 9, 11, 12].map(vid);

const CHIFFRES = [["10 à 15", "invitées : clientes, créatrices de contenu"], ["1 h", "d'événement, tout installé avant"], ["3", "résultats suivis : avis, contenus publiés, ventes"]];
const DEROULE = [
  ["Accueil", "L'hôtesse reçoit chaque invitée, une boisson, sa place nominative avec son plateau.", "0 à 10 min"],
  ["Présentation", "La fondatrice raconte la marque et l'histoire d'un soin, sans diapositives.", "10 à 20 min"],
  ["Atelier", "Routine guidée, un soin à la fois : à quoi il sert, comment l'appliquer, quelle quantité. Chacune le fait devant son miroir.", "20 à 40 min"],
  ["Contenu", "Coin photo aux couleurs de la marque : photos des soins, stories, vidéos courtes.", "40 à 50 min"],
  ["Clôture", "Remise des cadeaux et du code réservé aux invitées, avis recueillis à chaud.", "50 à 60 min"],
];
const ATELIER = [["La découverte", "Chaque invitée ouvre elle-même ses soins, posés sur son plateau."], ["La routine guidée", "La présentatrice connaît chaque soin : texture, actifs, type de peau. Elle avance dans l'ordre de la routine (nettoyer, traiter, hydrater) et toutes appliquent en même temps."], ["Les échanges", "Questions libres : chacune dit ce qu'elle ressent sur sa peau. C'est là que naissent les avis."]];
const ACCESSOIRES = [["Miroir de table", "appliquer les soins comme chez soi"], ["Plateau individuel", "les soins en format découverte, ou en grand format à partager"], ["Disques, lingettes, bandeau", "démaquiller, tenir les cheveux"], ["Serviette ou mouchoirs, eau", "le confort pendant l'atelier"], ["Fiche routine", "les soins dans l'ordre, avec un QR code vers la boutique"]];
const CADEAUX = [["Pochette ou tote bag à la marque", "la marque reste visible après l'événement"], ["Un ou deux soins en mini-format, ou un soin offert", "continuer la routine chez soi"], ["Carte avec un code réservé aux invitées", "mesurer les ventes nées de l'événement"], ["Pour les créatrices : carte avec le compte Instagram à identifier", "chaque publication renvoie vers la marque"]];
const BILAN = [["Le nombre d'avis recueillis, et les avis eux-mêmes", "J+2"], ["Les contenus publiés par les créatrices, avec leurs liens", "J+2"], ["Les commandes passées avec le code réservé aux invitées", "J+7"], ["Les images et vidéos de l'événement (avec le takeover)", "J+2"]];

const Video = ({ n }: { n: number }) => (
  <div className="aspect-[9/16] rounded-2xl overflow-hidden" style={{ background: BANDE }}>
    <video src={VIDEOS[n].src} poster={VIDEOS[n].affiche} autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
  </div>
);
const Titre = ({ num, t, s }: { num: string; t: string; s: string }) => (
  <div className="space-y-1"><p className="text-xs tracking-[2px] text-muted-foreground">{num}</p><h3 className="text-2xl md:text-[28px] leading-tight" style={{ color: NOIR }}>{t}</h3><p className="text-sm text-muted-foreground">{s}</p></div>
);
const Tableau = ({ l, a, b }: { l: string[][]; a: string; b: string }) => (
  <div className="rounded-2xl overflow-hidden text-sm" style={{ background: BANDE }}>
    <div className="grid grid-cols-2 gap-4 px-4 py-2 text-[11px] tracking-[1px] uppercase text-muted-foreground"><span>{a}</span><span>{b}</span></div>
    {l.map(([x, y]) => <div key={x} className="grid grid-cols-2 gap-4 px-4 py-3 border-t" style={{ borderColor: "rgba(0,0,0,0.06)", color: NOIR }}><span className="font-medium">{x}</span><span className="text-muted-foreground">{y}</span></div>)}
  </div>
);

export default function PopupMeetup({ onFermer }: { onFermer: () => void }) {
  return (
    <>
      <div className="fixed inset-0" style={{ position: "fixed", zIndex: 10000000, background: "rgba(0,0,0,0.3)" }} onClick={onFermer} />
      <div role="dialog" aria-label="Le déroulé d'un micro-événement" className="fixed inset-x-0 top-10 mx-auto overflow-y-auto rounded-[20px] p-5 md:p-8 space-y-10"
        style={{ position: "fixed", zIndex: 10000001, background: "#ffffff", width: "min(960px, 94vw)", maxHeight: "calc(100dvh - 80px)" }}>
        <button onClick={onFermer} aria-label="Fermer" className="absolute right-4 top-4 w-[30px] h-[30px] rounded-lg flex items-center justify-center" style={{ background: BANDE }}><X className="w-4 h-4" /></button>

        <div className="flex gap-6 items-center">
          <div className="space-y-3">
            <p className="text-xs tracking-[2px] uppercase text-muted-foreground">Micro-événement de marque</p>
            <h2 className="text-3xl md:text-[40px] leading-tight" style={{ color: NOIR }}>Un micro-événement <em>pour votre marque</em></h2>
            <p className="text-base" style={{ color: NOIR }}>Une heure pour rencontrer vos clientes et créer du contenu.</p>
            <p className="text-sm text-muted-foreground">Un lieu à Paris, une hôtesse, un atelier autour de vos soins. En option : une créatrice qui prend les commandes de votre Instagram.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 shrink-0" style={{ width: 300, maxWidth: "100%" }}><Video n={0} /><Video n={1} /></div>
        </div>

        <section className="space-y-4">
          <Titre num="01" t="Ce que la marque en retire" s="Un format court, pensé pour des résultats que l'on peut compter." />
          <div className="grid md:grid-cols-3 gap-3">{CHIFFRES.map(([c, t]) => <div key={c} className="rounded-2xl p-5" style={{ background: BANDE }}><p className="text-3xl" style={{ color: NOIR }}>{c}</p><p className="text-sm text-muted-foreground mt-1">{t}</p></div>)}</div>
          <p className="text-sm" style={{ color: NOIR }}>Vos clientes découvrent vos soins en main et repartent avec une routine. Vos créatrices repartent avec des images et des stories prêtes à publier. Vous repartez avec des avis, du contenu et des ventes rattachées à l'événement.</p>
        </section>

        <section className="space-y-4">
          <Titre num="02" t="Le déroulé de l'heure" s="Cinq temps, tenus par une seule personne qui garde le rythme." />
          <div className="flex gap-4 items-start">
            <ol className="space-y-2 flex-1">{DEROULE.map(([t, d, h], k) => <li key={t} className="flex gap-4 rounded-2xl p-4 items-start" style={{ background: BANDE }}><span className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: NOIR, color: "#fff" }}>{k + 1}</span><p className="flex-1 text-sm" style={{ color: NOIR }}><b>{t}.</b> {d}</p><span className="text-xs text-muted-foreground shrink-0">{h}</span></li>)}</ol>
            <div className="shrink-0" style={{ width: 200 }}><Video n={2} /></div>
          </div>
        </section>

        <section className="space-y-4">
          <Titre num="03" t="L'atelier, en pratique" s="Le cœur de l'heure : chaque invitée essaie vos soins elle-même." />
          <div className="grid md:grid-cols-3 gap-3">{ATELIER.map(([t, d]) => <div key={t} className="rounded-2xl p-5" style={{ background: BANDE }}><p className="font-semibold text-sm" style={{ color: NOIR }}>{t}</p><p className="text-sm text-muted-foreground mt-1">{d}</p></div>)}</div>
          <p className="text-sm font-semibold" style={{ color: NOIR }}>Ce qui est prévu pour chaque invitée</p>
          <Tableau l={ACCESSOIRES} a="Accessoire" b="À quoi il sert" />
          <div className="flex gap-4 items-center">
            <div className="shrink-0" style={{ width: 200 }}><Video n={3} /></div>
            <div><p className="text-sm font-semibold" style={{ color: NOIR }}>Dans le lieu</p><p className="text-sm text-muted-foreground mt-1">Un coin photo (fond aux couleurs de la marque, soins sur socles, lumière douce), une table avec la gamme complète, une boisson et quelque chose de léger à partager.</p></div>
          </div>
        </section>

        <section className="space-y-4">
          <Titre num="04" t="Ce que les invitées emportent" s="Un souvenir de la marque, et une raison de commander." />
          <Tableau l={CADEAUX} a="Cadeau" b="Pourquoi" />
        </section>

        <section className="space-y-4">
          <Titre num="05" t="En option : le takeover Instagram" s="Une créatrice prend les commandes de votre compte pendant l'événement." />
          <div className="flex gap-4 items-start">
            <div className="flex-1 space-y-3 text-sm" style={{ color: NOIR }}>
              <p>Pendant l'heure, une créatrice de contenu anime l'événement et publie en direct sur l'Instagram de votre marque : l'arrivée des invitées, l'atelier, les réactions, les soins en main.</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Elle anime l'événement avec l'hôtesse et donne le rythme.</li>
                <li>Elle guide les invitées pour leurs propres contenus : où se placer, quoi montrer, quelle lumière.</li>
                <li>Elle publie des stories en direct sur votre compte, et vous laisse les images et vidéos de l'heure.</li>
              </ol>
              <div className="rounded-2xl p-4" style={{ background: BANDE }}><p className="text-[11px] tracking-[1px] uppercase font-semibold">Accès au compte</p><p className="text-muted-foreground mt-1">Le takeover se fait par un accès temporaire donné par la marque, retiré à la fin de l'événement. Les contenus publiés sont validés avec vous en amont : ton, messages, ce qui ne se montre pas.</p></div>
            </div>
            <div className="shrink-0" style={{ width: 200 }}><Video n={4} /></div>
          </div>
        </section>

        <section className="space-y-4">
          <Titre num="06" t="Ce que vous recevez après" s="Un bilan simple, chiffré, dans les 48 heures." />
          <Tableau l={BILAN} a="Bilan" b="Quand" />
        </section>

        <div className="rounded-2xl p-6 text-center space-y-3" style={{ background: BANDE }}>
          <p className="text-xl" style={{ color: NOIR }}>Envie d'organiser le vôtre ?</p>
          <a href={LIEN_WHATSAPP_EXPERTE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-3 rounded-xl text-sm font-medium hover:opacity-80" style={{ background: NOIR, color: "#ffffff" }}>Parler à une experte</a>
        </div>
      </div>
    </>
  );
}
