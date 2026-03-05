import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Save, CheckCircle } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", background: "#fff", border: "1px solid #e5e5e7",
  borderRadius: 12, fontSize: 14, color: "#1d1d1f", outline: "none", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: "#1d1d1f", marginBottom: 6, display: "block",
  textTransform: "uppercase", letterSpacing: "0.5px",
};

export default function ClientBriefTab() {
  const { user } = useAuth();
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    brand_name: "", brand_description: "", target_market: "", target_audience: "",
    positioning: "", key_ingredients: "", packaging_preferences: "",
    budget_range: "", timeline: "", inspiration_brands: "", additional_notes: "",
  });

  useEffect(() => {
    if (!user) return;
    supabase.from("briefs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).then(({ data }) => {
      if (data && data.length > 0) {
        setBrief(data[0]);
        setForm({
          brand_name: data[0].brand_name || "",
          brand_description: data[0].brand_description || "",
          target_market: data[0].target_market || "",
          target_audience: data[0].target_audience || "",
          positioning: data[0].positioning || "",
          key_ingredients: data[0].key_ingredients || "",
          packaging_preferences: data[0].packaging_preferences || "",
          budget_range: data[0].budget_range || "",
          timeline: data[0].timeline || "",
          inspiration_brands: data[0].inspiration_brands || "",
          additional_notes: data[0].additional_notes || "",
        });
      }
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    if (brief) {
      await supabase.from("briefs").update({ ...form, status: "submitted" }).eq("id", brief.id);
    } else {
      await supabase.from("briefs").insert({ ...form, user_id: user.id, status: "submitted" });
    }
    toast.success("Brief enregistré !");
    setSaving(false);
  };

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#86868b" }}>Chargement...</div>;

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f" }}>Cahier des charges</h2>
          <p style={{ fontSize: 13, color: "#86868b", marginTop: 4 }}>Décrivez votre projet pour que nous puissions vous accompagner au mieux.</p>
        </div>
        {brief?.status === "submitted" && (
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#34c759", background: "#f0fdf4", padding: "6px 14px", borderRadius: 20 }}>
            <CheckCircle size={14} /> Envoyé
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <label style={labelStyle}>Nom de la marque</label>
          <input style={inputStyle} value={form.brand_name} onChange={e => update("brand_name", e.target.value)} placeholder="Ex: NaturaSkin" />
        </div>
        <div>
          <label style={labelStyle}>Marché cible</label>
          <input style={inputStyle} value={form.target_market} onChange={e => update("target_market", e.target.value)} placeholder="Ex: France, Europe, Afrique" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Description de la marque</label>
          <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={form.brand_description} onChange={e => update("brand_description", e.target.value)} placeholder="Décrivez votre vision de marque..." />
        </div>
        <div>
          <label style={labelStyle}>Public cible</label>
          <input style={inputStyle} value={form.target_audience} onChange={e => update("target_audience", e.target.value)} placeholder="Ex: Femmes 25-45 ans" />
        </div>
        <div>
          <label style={labelStyle}>Positionnement</label>
          <input style={inputStyle} value={form.positioning} onChange={e => update("positioning", e.target.value)} placeholder="Ex: Premium bio & vegan" />
        </div>
        <div>
          <label style={labelStyle}>Ingrédients clés souhaités</label>
          <input style={inputStyle} value={form.key_ingredients} onChange={e => update("key_ingredients", e.target.value)} placeholder="Ex: Beurre de karité, Aloe vera" />
        </div>
        <div>
          <label style={labelStyle}>Préférences packaging</label>
          <input style={inputStyle} value={form.packaging_preferences} onChange={e => update("packaging_preferences", e.target.value)} placeholder="Ex: Verre, minimaliste, noir" />
        </div>
        <div>
          <label style={labelStyle}>Budget estimé</label>
          <input style={inputStyle} value={form.budget_range} onChange={e => update("budget_range", e.target.value)} placeholder="Ex: 2000-5000€" />
        </div>
        <div>
          <label style={labelStyle}>Délai souhaité</label>
          <input style={inputStyle} value={form.timeline} onChange={e => update("timeline", e.target.value)} placeholder="Ex: 3 mois" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Marques d'inspiration</label>
          <input style={inputStyle} value={form.inspiration_brands} onChange={e => update("inspiration_brands", e.target.value)} placeholder="Ex: Typology, Drunk Elephant, Fenty Skin" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Notes complémentaires</label>
          <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={form.additional_notes} onChange={e => update("additional_notes", e.target.value)} placeholder="Toute information utile..." />
        </div>
      </div>

      <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} disabled={saving}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 28px", borderRadius: 12, border: "none",
            background: "#1d1d1f", color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1,
          }}>
          <Save size={16} /> {saving ? "Enregistrement..." : "Enregistrer mon brief"}
        </button>
      </div>
    </div>
  );
}
