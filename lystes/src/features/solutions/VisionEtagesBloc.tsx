import { useEffect, useRef, useState } from "react";
import VisionEtages from "./VisionEtages";
import scopeCss from "@lystes/features/shot/biolystes-scope.css?raw";

/**
 * La section des étages de l'accueil (VisionEtages), montable sur une autre
 * page (12/10/2026, JP : /bio). L'accueil la monte dans les emplacements de
 * son gabarit HTML (agents-vision-page.tmpl.html) ; ce bloc reproduit ces
 * mêmes emplacements, avec les mêmes identifiants, et monte le même
 * composant : textes, onglets, visites et styles restent à un seul endroit,
 * VisionEtages.tsx. Les styles du cadre (.biolystes-ai-scope) viennent de la
 * même feuille que /shot.
 */
type Slots = {
  tete: HTMLElement;
  scene: HTMLElement;
  texte: HTMLElement;
  legende: HTMLElement;
  visuel: HTMLElement;
  pastilles: HTMLElement;
  apres: HTMLElement;
  demo: HTMLElement;
};

export default function VisionEtagesBloc() {
  const tete = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const texte = useRef<HTMLDivElement>(null);
  const legende = useRef<HTMLDivElement>(null);
  const visuel = useRef<HTMLDivElement>(null);
  const pastilles = useRef<HTMLDivElement>(null);
  const apres = useRef<HTMLDivElement>(null);
  const demo = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState<Slots | null>(null);

  useEffect(() => {
    const r = [tete, scene, texte, legende, visuel, pastilles, apres, demo].map((x) => x.current);
    if (r.every(Boolean)) {
      const [t, s, tx, l, v, p, a, d] = r as HTMLElement[];
      setSlots({ tete: t, scene: s, texte: tx, legende: l, visuel: v, pastilles: p, apres: a, demo: d });
    }
  }, []);

  return (
    <div className="biolystes-ai-scope">
      <style>{scopeCss}</style>
      <div className="wrap" style={{ margin: "44px auto" }}>
        <div className="lyv-large">
          <div id="vision-tete-slot" ref={tete} />
          <div id="vision-scene" className="lyv-scene" ref={scene}>
            <div id="vision-texte-slot" className="lyv-s-texte" ref={texte} />
            <div className="lyv-s-visuel">
              <div id="vision-demo" className="lyv-demo" ref={demo} style={{ position: "relative", width: "100%", borderRadius: 22, background: "#f3f4f5" }}>
                <iframe
                  className="lyv-demo-ecran"
                  src="/demo-eclose/index.html"
                  title="Fiche produit Éclose Paris : les dix agents IA au travail"
                  loading="lazy"
                  style={{ display: "block", width: "100%", border: 0 }}
                />
                <div id="vision-pastilles-slot" ref={pastilles} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }} />
              </div>
              <div id="vision-visuel-slot" ref={visuel} />
            </div>
            <div id="vision-legende-slot" className="lyv-s-legende" ref={legende} />
          </div>
          <div id="vision-panneaux-slot" ref={apres} />
        </div>
      </div>
      {slots && <VisionEtages {...slots} />}
    </div>
  );
}
