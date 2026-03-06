import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedCgv, setAcceptedCgv] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedCgv) {
      toast.error("Veuillez accepter les CGV pour continuer.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Compte créé ! Vérifiez votre email pour confirmer.");
      navigate("/login");
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    background: "#F5F5F7",
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
          Créer un compte
        </h1>
        <p style={{ fontSize: 15, color: "#86868B", marginBottom: 32, textAlign: "center" }}>
          Lancez votre marque cosmétique bio
        </p>

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input
              type="text"
              placeholder="Prénom"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Nom"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

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
              placeholder="Mot de passe (min. 6 caractères)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
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

          {/* CGV */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 4 }}>
            <input
              type="checkbox"
              checked={acceptedCgv}
              onChange={e => setAcceptedCgv(e.target.checked)}
              style={{ marginTop: 2, accentColor: "#1D1D1F" }}
            />
            <span style={{ fontSize: 13, color: "#86868B", lineHeight: 1.5 }}>
              J'accepte les{" "}
              <a href="/cgv"
                style={{ color: "#1D1D1F", textDecoration: "none", fontWeight: 500 }}>
                Conditions Générales de Vente
              </a>
            </span>
          </label>

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
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <span style={{ fontSize: 14, color: "#86868B" }}>
            Déjà un compte ?{" "}
            <Link to="/login" style={{ color: "#1D1D1F", fontWeight: 600, textDecoration: "none" }}>
              Se connecter
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
