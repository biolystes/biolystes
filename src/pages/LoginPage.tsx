import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message === "Invalid login credentials"
        ? "Email ou mot de passe incorrect."
        : error.message);
    } else {
      navigate("/espace-client");
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
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#1D1D1F", letterSpacing: "-0.5px" }}>
            Biolystes
          </span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1D1D1F", marginBottom: 8, textAlign: "center" }}>
          Connectez-vous
        </h1>
        <p style={{ fontSize: 15, color: "#86868B", marginBottom: 32, textAlign: "center" }}>
          Accédez à votre espace de création
        </p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: 48 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#86868B",
                display: "flex", alignItems: "center",
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div style={{ textAlign: "right", marginTop: -4 }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: "#86868B", textDecoration: "none" }}>
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "14px 0", background: loading ? "#D1D1D6" : "#1D1D1F",
              color: "#FFFFFF", border: "none", borderRadius: 9999,
              fontSize: 15, fontWeight: 600, cursor: loading ? "default" : "pointer",
              marginTop: 8, fontFamily: "Inter, sans-serif",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <span style={{ fontSize: 14, color: "#86868B" }}>
            Pas de compte ?{" "}
            <Link to="/signup" style={{ color: "#1D1D1F", fontWeight: 600, textDecoration: "none" }}>
              Créer un compte
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
