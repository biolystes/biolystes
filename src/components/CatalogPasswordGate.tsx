import { useState, ReactNode } from "react";

const KEY = "catalog_access_ok";
const PASSWORD = "biolystes";

export default function CatalogPasswordGate({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(() => typeof window !== "undefined" && sessionStorage.getItem(KEY) === "1");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  if (ok) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSWORD) {
      sessionStorage.setItem(KEY, "1");
      setOk(true);
    } else setError(true);
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#f5f4df" }}>
      <form onSubmit={submit} style={{ background: "#121212", color: "#f5f4df", padding: 40, borderRadius: "2rem", width: "100%", maxWidth: 400, textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 8, color: "#f5f4df" }}>Catalogue privé</h1>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 24, color: "#f5f4df" }}>Entrez le mot de passe pour accéder au catalogue.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          placeholder="Mot de passe"
          autoFocus
          aria-label="Mot de passe"
          style={{ width: "100%", padding: "12px 16px", borderRadius: 999, border: "1px solid #2f5955", background: "#f5f4df", color: "#121212", marginBottom: 12 }}
        />
        {error && <p style={{ color: "#ff8a80", fontSize: 13, marginBottom: 12 }}>Mot de passe incorrect</p>}
        <button type="submit" style={{ width: "100%", padding: "12px 16px", borderRadius: 999, background: "#2f5955", color: "#f5f4df", fontWeight: 600 }}>
          Accéder
        </button>
      </form>
    </div>
  );
}
