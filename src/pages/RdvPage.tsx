import { useEffect } from "react";

/* /rdv affichait une page blanche : le module iClosed ne se chargeait plus
   (audit du parcours cliente, 14/10/2026). Même règle que les boutons
   Rendez-vous du site : tout rendez-vous se prend sur biolystes.pro/rdv. */
const RDV_URL = "https://biolystes.pro/rdv";

export default function RdvPage() {
  useEffect(() => {
    window.location.replace(RDV_URL);
  }, []);

  return (
    <div className="py-16 px-4 text-center" style={{ background: "#ffffff", minHeight: "60vh" }}>
      <p className="text-sm text-muted-foreground">
        Redirection vers la prise de rendez-vous…{" "}
        <a href={RDV_URL} className="underline">Ouvrir la page</a>
      </p>
    </div>
  );
}
