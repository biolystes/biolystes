import type { ReactNode } from "react";

/**
 * La reproduction d'une recherche Google avec les étoiles des avis, née sur
 * /solutions/avis (bloc « Référencement Google »). Sortie telle quelle de
 * AvisRawPage le 12/10/2026 pour servir aussi à la visite « Vos outils » de
 * l'accueil (JP : « on avait fait dans la page /solutions/avis une
 * reproduction des recherches Google avec les notes »). Le dessin ne change
 * pas : seules les données viennent de la page qui l'affiche.
 */
export type ResultatAvis = {
  /* Le fil d'adresse gris au-dessus du titre. */
  fil: string;
  lien: string;
  titre: string;
  note: string;
  votes: string;
  description?: ReactNode;
};

function Etoiles() {
  return (
    <div className="flex text-foreground">
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      ))}
    </div>
  );
}

export function ResultatGoogleAvis({ recherche, marque, produit }: { recherche: string; marque: ResultatAvis; produit: ResultatAvis }) {
  return (
    <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden bg-white">
      <div className="relative flex items-center px-6 py-5 bg-neutral-50">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="px-6 py-2 rounded-full bg-white text-[12px] text-stone-500 tracking-wide">google.com</div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-10 md:py-12">
        <div className="px-7 py-4 rounded-full bg-neutral-50 mb-10">
          <span className="text-[15px] text-stone-500">{recherche}</span>
        </div>

        <div className="mb-10" data-resultat="marque">
          <p className="text-[13px] text-stone-400 mb-2">{marque.fil}</p>
          <a href={marque.lien} target="_blank" rel="noopener noreferrer" className="block text-[22px] md:text-[24px] text-[#1a0dab] hover:underline font-medium leading-snug mb-3">
            {marque.titre}
          </a>
          <div className="flex items-center gap-2 text-[15px] mb-3">
            <Etoiles />
            <span className="font-semibold text-foreground ml-1">{marque.note}</span>
            <span className="text-stone-400">{marque.votes}</span>
          </div>
          {marque.description && (
            <p className="text-[15px] text-stone-500 leading-[1.6]">
              {marque.description}
            </p>
          )}
        </div>

        <div data-resultat="produit">
          <p className="text-[13px] text-stone-400 mb-2">{produit.fil}</p>
          <a href={produit.lien} target="_blank" rel="noopener noreferrer" className="block text-[22px] md:text-[24px] text-[#1a0dab] hover:underline font-medium leading-snug mb-3">
            {produit.titre}
          </a>
          <div className="flex items-center gap-2 text-[15px]">
            <Etoiles />
            <span className="font-semibold text-foreground ml-1">{produit.note}</span>
            <span className="text-stone-400">{produit.votes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
