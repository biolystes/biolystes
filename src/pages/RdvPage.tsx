import { useEffect } from "react";

export default function RdvPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.iclosed.io/assets/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="py-8 px-4" style={{ background: "#f5f4df", minHeight: "100vh" }}>
      <div
        className="iclosed-widget mx-auto"
        data-url="https://app.iclosed.io/e/biolystes/start"
        title="Crée ta marque cosmétique bio & végane clé en main"
        style={{ width: "100%", maxWidth: 900, height: 620 }}
      />
    </div>
  );
}
