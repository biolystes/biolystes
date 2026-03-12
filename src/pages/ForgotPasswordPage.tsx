import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    background: "#f5f4df",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    color: "#1D1D1F",
    outline: "none",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#FFFFFF", fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#1D1D1F", letterSpacing: "-0.5px" }}>
            Lystes.ai
          </span>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, background: "#F5F5F7", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px", fontSize: 24,
            }}>
              ✓
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1D1D1F", marginBottom: 12 }}>
              Email envoyé
            </h1>
            <p style={{ fontSize: 15, color: "#86868B", lineHeight: 1.6 }}>
              Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
            </p>
            <Link to="/login" style={{
              display: "inline-block", marginTop: 32, color: "#1D1D1F",
              fontWeight: 600, textDecoration: "none", fontSize: 14,
            }}>
              ← Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1D1D1F", marginBottom: 8, textAlign: "center" }}>
              Mot de passe oublié
            </h1>
            <p style={{ fontSize: 15, color: "#86868B", marginBottom: 32, textAlign: "center" }}>
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "14px 0", background: loading ? "#D1D1D6" : "#1D1D1F",
                  color: "#FFFFFF", border: "none", borderRadius: 9999,
                  fontSize: 15, fontWeight: 600, cursor: loading ? "default" : "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {loading ? "Envoi..." : "Envoyer le lien"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Link to="/login" style={{ fontSize: 14, color: "#86868B", textDecoration: "none" }}>
                ← Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
