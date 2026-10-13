import { Check } from "lucide-react";
import produitEndommage from "@lystes/assets/bio/produit-endommage.jpg";

export const PROTECTION_ITEMS = [
  { title: "Conformité des formulations", desc: "Garantie par le laboratoire fabricant" },
  { title: "DIP : Dossier d’Information Produit", desc: "Établi et conservé par le laboratoire" },
  { title: "Notification CPNP", desc: "Enregistrement au portail européen inclus" },
  { title: "Cosmétovigilance & allégations", desc: "Surveillance et vérification gérées par le labo" },
  { title: "Certifications COSMOS / ECOCERT / FDA", desc: "Maintenues et renouvelées par le fabricant" },
];

/* 13/10/2026 (JP) : les sections « Conformité & Responsabilité » et
   « Litige » de /bio passent dans l'onglet Assurance des étapes de création
   (vision/etapesBio.ts). Leurs textes et la carte « Protection réglementaire »
   sont repris ici tels quels, pour l'onglet. */
export { produitEndommage as PHOTO_PRODUIT_ENDOMMAGE };
export const TEXTE_RISQUE =
  "En marque blanche, c’est le laboratoire fabricant qui est la Personne Responsable au sens du Règlement européen CE n°1223/2009. Vous distribuez, vous ne fabriquez pas. Le risque produit ne repose jamais sur vous. Contrairement aux produits faits sur mesure avec votre formulation.";
export const TEXTE_LITIGE =
  "Votre client vous contacte, vous nous transmettez la réclamation avec photo. Remplacement pris en charge sous 30 jours après livraison. Bien entendu, dans le cas où c’est notre laboratoire qui gère la livraison.";

/* La carte « Protection réglementaire 100 % » et ses cinq lignes cochées,
   telle qu'elle était dans la section. */
export function CarteProtection() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-3 h-3 rounded-full bg-[#34d399]" />
        <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-muted-foreground">Protection réglementaire</span>
        <span className="ml-auto text-[26px] font-black text-foreground">100<span className="text-[13px] text-[#10b981]">%</span></span>
      </div>

      <div className="space-y-2">
        {PROTECTION_ITEMS.map((item, i) => (
          <div key={i} className="p-4 rounded-2xl flex items-start gap-3 border border-foreground">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#e6f6ef]">
              <Check className="w-3.5 h-3.5 text-[#22c55e]" strokeWidth={3} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[12px] font-bold text-foreground">{item.title}</p>
              <p className="text-[13px] font-medium text-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
