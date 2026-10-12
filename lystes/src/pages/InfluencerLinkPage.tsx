import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@lystes/integrations/supabase/client";
import { Copy, Loader2 } from "lucide-react";
import { getTryOnDemoUrl } from "@lystes/utils/agentRouting";
import { toast } from "sonner";
import { QuickTryOnModal } from "@lystes/components/tryon/QuickTryOnModal";

export interface FeaturedProduct {
  id: string;
  name: string;
  image_url: string;
  price: string;
  cta_url?: string;
}

interface CustomLink {
  label: string;
  url: string;
}

interface Review {
  id?: string;
  name: string;
  rating: number;
  text: string;
  source?: string;
}

interface FeaturedSection {
  image_url?: string;
  title?: string;
  description?: string;
  cta_label?: string;
  cta_url?: string;
}

export interface InfluencerData {
  id: string;
  instagram_handle: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  slug: string;
  accent_color: string;
  background_color: string;
  gradient_center: string | null;
  gradient_mid: string | null;
  gradient_edge: string | null;
  featured_products: FeaturedProduct[];
  featured_products_title: string;
  primary_agent_id: string | null;
  primary_cta_label: string | null;
  primary_cta_type: string;
  primary_cta_url: string | null;
  promo_code: string | null;
  promo_discount: string | null;
  custom_links: CustomLink[];
  reviews: Review[];
  featured_section: FeaturedSection | null;
  before_image_url: string | null;
  after_image_url: string | null;
  before_after_title: string | null;
  account_id: string;
}

export interface AgentAvatars {
  widget_avatar_2?: string | null;
  widget_avatar_3?: string | null;
}

/** Returns white or black depending on which contrasts better */
function getContrastColor(hexColor: string): string {
  const hex = (hexColor || "#000000").replace("#", "");
  if (hex.length < 6) return "#ffffff";
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

const getVisitorId = (): string => {
  let vid = sessionStorage.getItem("lystes_vid");
  if (vid) return vid;
  const raw = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset().toString(),
  ].join("|");
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  vid = "v_" + Math.abs(hash).toString(36);
  sessionStorage.setItem("lystes_vid", vid);
  return vid;
};

const logEvent = async (collaborationId: string, eventType: string, eventData?: Record<string, unknown>) => {
  try {
    const { error } = await supabase.from("influencer_events" as any).insert({
      collaboration_id: collaborationId,
      event_type: eventType,
      event_data: { ...eventData, visitor_id: getVisitorId() },
      user_agent: navigator.userAgent,
    } as any);
    if (error) {
      console.error(`[InfluencerLinkPage] logEvent(${eventType}) failed:`, error);
    }
  } catch (err) {
    console.error(`[InfluencerLinkPage] logEvent(${eventType}) threw:`, err);
  }
};

const addUtmParams = (url: string, handle: string, slug: string) => {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}utm_source=lystes&utm_medium=influencer&utm_campaign=${encodeURIComponent(handle)}&utm_content=${encodeURIComponent(slug)}`;
};

export default function InfluencerLinkPage() {
  const params = useParams<{ handle?: string; slug?: string }>();
  const rawHandle = params.handle || params.slug || "";
  const [data, setData] = useState<InfluencerData | null>(null);
  const [agentAvatars, setAgentAvatars] = useState<AgentAvatars | null>(null);
  const [agentType, setAgentType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [agentUrl, setAgentUrl] = useState<string>("");
  const [tryOnProduct, setTryOnProduct] = useState<FeaturedProduct | null>(null);

  useEffect(() => {
    if (!rawHandle) { setNotFound(true); setLoading(false); return; }

    const cleanHandle = rawHandle.replace(/^@/, "");
    const slug = `@${cleanHandle}`;

    const fetchData = async () => {
      const { data: collab, error } = await supabase
        .from("influencer_collaborations" as any)
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error || !collab) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const d = collab as unknown as InfluencerData;
      setData(d);

      // Track view with visitor fingerprint
      const { error: viewError } = await supabase.rpc("increment_influencer_view" as any, { p_slug: slug });
      if (viewError) console.error("[InfluencerLinkPage] increment_influencer_view failed:", viewError);
      await logEvent(d.id, "view", { referrer: document.referrer || null });

      // Fetch agent avatars
      if (d.primary_agent_id) {
        const { data: agent } = await supabase
          .from("agents")
          .select("widget_avatar_2, widget_avatar_3, agent_type")
          .eq("id", d.primary_agent_id)
          .single();
        if (agent) {
          setAgentAvatars(agent);
          setAgentType((agent as any).agent_type || null);
        }
      }

      setLoading(false);
    };
    fetchData();
  }, [rawHandle]);

  const handleProductClick = (product?: FeaturedProduct) => {
    if (!data || !product?.cta_url) return;
    supabase.rpc("increment_influencer_click" as any, { p_slug: data.slug }).then(({ error }) => {
      if (error) console.error("[InfluencerLinkPage] increment_influencer_click (product) failed:", error);
    });
    logEvent(data.id, "product_click", {
      url: product.cta_url,
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
    });
    window.open(addUtmParams(product.cta_url, data.instagram_handle, data.slug), "_blank");
  };

  const handleProductTryOn = (product: FeaturedProduct) => {
    if (!data) return;
    supabase.rpc("increment_influencer_interaction" as any, {
      p_slug: data.slug,
      p_type: "tryon",
    } as any).then(({ error }) => {
      if (error) console.error("[InfluencerLinkPage] increment_influencer_interaction (tryon) failed:", error);
    });
    logEvent(data.id, "product_tryon", {
      product_id: product.id,
      product_name: product.name,
      agent_id: data.primary_agent_id,
    });
    setTryOnProduct(product);
  };

  // Check if primary agent is a try-on type
  const isTryOnAgent = agentType && [
    "wig_tryon", "glasses_tryon", "makeup_tryon", "clothing_tryon",
    "jewelry_tryon", "shoes_tryon", "watch_tryon", "decor_tryon", "virtual_tryon",
  ].includes(agentType);

  const handleLinkClick = (url?: string) => {
    if (!data || !url) return;
    supabase.rpc("increment_influencer_click" as any, { p_slug: data.slug }).then(({ error }) => {
      if (error) console.error("[InfluencerLinkPage] increment_influencer_click (link) failed:", error);
    });
    logEvent(data.id, "click", { url });
    window.open(addUtmParams(url, data.instagram_handle, data.slug), "_blank");
  };

  const handleAgentOpen = () => {
    if (!data) return;
    supabase.rpc("increment_influencer_interaction" as any, {
      p_slug: data.slug,
      p_type: data.primary_cta_type === "tryon" ? "tryon" : "diagnostic",
    } as any).then(({ error }) => {
      if (error) console.error("[InfluencerLinkPage] increment_influencer_interaction (agent_open) failed:", error);
    });
    logEvent(data.id, "agent_open", { agent_id: data.primary_agent_id, cta_type: data.primary_cta_type });
    if (data.primary_agent_id) {
      // For try-on agents, route directly to demo page to avoid iframe redirect issues
      const tryOnUrl = getTryOnDemoUrl(agentType, data.primary_agent_id);
      const url = tryOnUrl
        ? `${window.location.origin}${tryOnUrl}&ref=${encodeURIComponent(data.slug)}`
        : `${window.location.origin}/agent/${data.primary_agent_id}?ref=${encodeURIComponent(data.slug)}`;
      setAgentUrl(url);
      setShowAgentModal(true);
    }
  };

  const copyPromo = () => {
    if (!data?.promo_code) return;
    navigator.clipboard.writeText(data.promo_code);
    supabase.rpc("increment_influencer_promo" as any, { p_slug: data.slug }).then(({ error }) => {
      if (error) console.error("[InfluencerLinkPage] increment_influencer_promo failed:", error);
    });
    logEvent(data.id, "promo_copy", { code: data.promo_code });
    toast.success("Code copié !");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F5F5" }}>
        <Loader2 style={{ width: 24, height: 24, color: "#999" }} className="animate-spin" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F5F5" }}>
        <p style={{ color: "#666", fontSize: 14 }}>Ce lien n'existe pas ou a été désactivé.</p>
      </div>
    );
  }

  return (
    <>
    <VueLienInfluenceur
      data={data}
      agentAvatars={agentAvatars}
      essayage={!!(isTryOnAgent && data.primary_agent_id)}
      actions={{
        produit: handleProductClick,
        essayer: handleProductTryOn,
        agent: handleAgentOpen,
        lien: handleLinkClick,
        promo: copyPromo,
      }}
      fenetreAgent={showAgentModal && agentUrl ? (
        <iframe
          src={agentUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
          allow="camera;microphone"
          title="Agent IA"
        />
      ) : null}
      fermerAgent={() => setShowAgentModal(false)}
    />

    {/* Quick Try-On Modal for products */}
    {tryOnProduct && data?.primary_agent_id && (
      <QuickTryOnModal
        open={!!tryOnProduct}
        onOpenChange={(open) => { if (!open) setTryOnProduct(null); }}
        product={{
          name: tryOnProduct.name,
          imageUrl: tryOnProduct.image_url,
          price: tryOnProduct.price,
          productId: tryOnProduct.id,
        }}
        agentId={data.primary_agent_id}
        agentType={agentType || undefined}
      />
    )}

    </>
  );
}

export type ActionsLienInfluenceur = {
  produit: (p: FeaturedProduct) => void;
  essayer: (p: FeaturedProduct) => void;
  agent: () => void;
  lien: (url?: string) => void;
  promo: () => void;
};

/**
 * La page publique du lien influenceur, sans lecture en base : la page
 * (InfluencerLinkPage) lui passe la collaboration lue et ses actions,
 * l'accueil (onglet « Vos outils ») les données de démonstration. Même
 * rendu des deux côtés, aucune copie à tenir à jour.
 * `fenetreAgent` : le contenu de la fenêtre de l'agent (l'iframe sur la
 * page, le parcours du diagnostic dans la démonstration), ou null fermée.
 */
export function VueLienInfluenceur({
  data,
  agentAvatars,
  essayage,
  actions,
  fenetreAgent,
  fermerAgent,
  hauteurFenetre = "85vh",
  largeurFenetre = 440,
}: {
  data: InfluencerData;
  agentAvatars: AgentAvatars | null;
  essayage: boolean;
  actions: ActionsLienInfluenceur;
  fenetreAgent: ReactNode | null;
  fermerAgent: () => void;
  hauteurFenetre?: string;
  largeurFenetre?: number;
}) {
  const [ctaHovered, setCtaHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);

  // Background — same logic as BrandLinkPage
  const bgStyle: React.CSSProperties = data.gradient_center && data.gradient_mid && data.gradient_edge
    ? { background: `radial-gradient(ellipse at 10% 40%, ${data.gradient_center} 0%, ${data.gradient_mid} 60%, ${data.gradient_edge} 100%)` }
    : { background: `radial-gradient(ellipse at 10% 40%, ${data.background_color} 0%, ${data.background_color}dd 60%, ${data.background_color}bb 100%)` };

  const accentColor = data.accent_color || "#000000";
  const contrastColor = getContrastColor(accentColor);
  const hasAgentAvatars = agentAvatars && (agentAvatars.widget_avatar_2 || agentAvatars.widget_avatar_3);
  const ctaVisible = data.primary_cta_label || hasAgentAvatars;
  const displayCta = data.primary_cta_label || "Découvrir";

  return (
    <>
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", ...bgStyle }}>
      <div style={{ width: "100%", maxWidth: 352, margin: "0 auto", paddingTop: 80 }}>

        {/* Main white card — blp-main-card */}
        <div
          className="blp-main-card"
          style={{
            background: "#fff",
            position: "relative",
            borderRadius: 60,
            padding: "0 24px 60px",
            minHeight: 500,
            maxWidth: 309,
            width: "100%",
            margin: "0 auto",
          }}
        >
          {/* Avatar ring — blp-profile-wrapper */}
          <div
            className="blp-profile-wrapper"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: -46,
              width: 92,
              height: 92,
              padding: 3,
              background: "linear-gradient(to bottom, #d946ef, #ec4899, #f43f5e)",
              borderRadius: "9999px",
              zIndex: 10,
              boxSizing: "border-box",
            }}
          >
            {data.avatar_url ? (
              <>
                <style>{`.blp-profile-img { width: 86px !important; height: 86px !important; min-width: 86px !important; min-height: 86px !important; max-width: none !important; box-sizing: border-box !important; }`}</style>
                <img
                  src={data.avatar_url}
                  alt={data.display_name}
                  className="blp-profile-img"
                  style={{
                    borderRadius: "9999px",
                    objectFit: "cover",
                    objectPosition: "top center",
                    border: "3px solid #fff",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: 20,
                  backgroundColor: accentColor,
                  color: contrastColor,
                  border: "3px solid #fff",
                }}
              >
                {data.display_name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Card content */}
          <div className="ilp-contenu" style={{ paddingTop: 50 }}>

            {/* Display name */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <p className="ilp-nom" style={{ fontWeight: 700, letterSpacing: "-0.02em", textTransform: "uppercase", fontSize: 14, color: "#111" }}>
                {data.display_name}
              </p>
              {data.bio && (
                <p style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{data.bio}</p>
              )}
            </div>

            {/* Products grid — 3 cols, ACHETER button with neo-brutalist shadow */}
            {data.featured_products && data.featured_products.length > 0 && (
              <div
                className="ilp-produits"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                  marginBottom: 40,
                }}
              >
                {data.featured_products.slice(0, 3).map((product, idx) => (
                  <div
                    key={product.id || idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid #e5e7eb",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    {/* Product image — h-[111px] */}
                    <div
                      style={{ height: 111, backgroundColor: "#f3f4f6", cursor: product.cta_url ? "pointer" : "default" }}
                      onClick={() => actions.produit(product)}
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 10 }}>
                          Photo
                        </div>
                      )}
                    </div>
                    {/* Price + buttons */}
                    <div style={{ backgroundColor: "#fff", textAlign: "center", padding: 8 }}>
                      {product.price && (
                        <span style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8, color: "#111" }}>
                          {product.price}
                        </span>
                      )}
                      {/* ESSAYER button (if try-on agent available) */}
                      {essayage && (
                        <div
                          onClick={() => actions.essayer(product)}
                          style={{
                            width: "100%",
                            textAlign: "center",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            backgroundColor: accentColor,
                            border: `1px solid ${accentColor}`,
                            fontSize: 9,
                            padding: "8px 0",
                            boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
                            letterSpacing: "-0.02em",
                            color: contrastColor,
                            cursor: "pointer",
                            marginBottom: 6,
                          }}
                        >
                          ESSAYER
                        </div>
                      )}
                      {/* ACHETER button */}
                      <div
                        onClick={() => actions.produit(product)}
                        style={{
                          width: "100%",
                          textAlign: "center",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          backgroundColor: "#fff",
                          border: "1px solid #000",
                          fontSize: 9,
                          padding: "8px 0",
                          boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
                          letterSpacing: "-0.02em",
                          color: "#000",
                          cursor: product.cta_url ? "pointer" : "default",
                        }}
                      >
                        ACHETER
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Promo code — accent color bg */}
            {data.promo_code && (
              <div
                className="ilp-promo"
                onClick={actions.promo}
                style={{
                  borderRadius: 8,
                  textAlign: "center",
                  backgroundColor: accentColor,
                  padding: "12px 16px",
                  marginBottom: 16,
                  cursor: "pointer",
                }}
              >
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7, color: contrastColor }}>
                  Mon code promo
                </p>
                <p style={{ fontSize: 24, fontWeight: 700, marginTop: 4, color: contrastColor }}>
                  {data.promo_code}
                </p>
                {data.promo_discount && (
                  <p style={{ fontSize: 13, opacity: 0.8, marginTop: 2, color: contrastColor }}>
                    {data.promo_discount}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center", marginTop: 8, opacity: 0.7, color: contrastColor }}>
                  <Copy style={{ width: 12, height: 12 }} />
                  <span style={{ fontSize: 11, textDecoration: "underline" }}>Copier le code</span>
                </div>
              </div>
            )}

            {/* CTA button — always WHITE bg + black border (brutalist), never accent-colored */}
            {ctaVisible && (
              <div
                className="ilp-cta"
                onClick={actions.agent}
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  border: `1.5px solid ${ctaHovered ? accentColor : "#000"}`,
                  borderRadius: 8,
                  padding: "19px 13px",
                  marginBottom: 16,
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
              >
                {hasAgentAvatars && (
                  <div style={{ position: "relative", flexShrink: 0, width: 36, marginRight: 8 }}>
                    {agentAvatars?.widget_avatar_3 && (
                      <img
                        src={agentAvatars.widget_avatar_3}
                        alt=""
                        style={{
                          width: 28, height: 28,
                          borderRadius: "9999px",
                          objectFit: "cover",
                          border: "2px solid #fff",
                          position: "absolute",
                          left: 10,
                          zIndex: 1,
                        }}
                      />
                    )}
                    {agentAvatars?.widget_avatar_2 && (
                      <img
                        src={agentAvatars.widget_avatar_2}
                        alt=""
                        style={{
                          width: 28, height: 28,
                          borderRadius: "9999px",
                          objectFit: "cover",
                          border: "2px solid #fff",
                          position: "relative",
                          zIndex: 2,
                        }}
                      />
                    )}
                    <span
                      style={{
                        position: "absolute",
                        fontSize: 5,
                        fontWeight: 700,
                        backgroundColor: "#000",
                        color: "#fff",
                        borderRadius: "9999px",
                        padding: "1px 2px",
                        bottom: -1,
                        right: -1,
                        zIndex: 3,
                      }}
                    >
                      AI
                    </span>
                  </div>
                )}
                <span
                  style={{
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textAlign: "center",
                    flex: 1,
                    fontSize: 9,
                    color: "#000",
                    position: "relative",
                    left: -16,
                  }}
                >
                  {displayCta}
                </span>
                <svg
                  style={{ position: "absolute", width: 20, height: 20, right: 19, flexShrink: 0 }}
                  fill="none" stroke="#000" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            )}

            {/* Custom links — same brutalist style */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {(data.custom_links || []).filter(l => l.label && l.url).map((link, i) => (
                <div
                  key={i}
                  onClick={() => actions.lien(link.url)}
                  onMouseEnter={() => setHoveredLink(i)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    border: `1.5px solid ${hoveredLink === i ? accentColor : "#000"}`,
                    borderRadius: 8,
                    padding: "21px 13px",
                    cursor: "pointer",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      textAlign: "center",
                      width: "100%",
                      fontSize: 9,
                      color: "#000",
                    }}
                  >
                    {link.label}
                  </span>
                  <svg
                    style={{ position: "absolute", width: 20, height: 20, right: 19, flexShrink: 0 }}
                    fill="none" stroke="#000" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Featured section */}
            {data.featured_section && (data.featured_section.image_url || data.featured_section.title) && (
              <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                {data.featured_section.image_url && (
                  <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                    <img src={data.featured_section.image_url} alt={data.featured_section.title || ""} style={{ width: "100%" }} />
                  </div>
                )}
                {data.featured_section.title && (
                  <p style={{ fontWeight: 600, color: "#111", fontSize: 16 }}>{data.featured_section.title}</p>
                )}
                {data.featured_section.description && (
                  <p style={{ color: "#666", fontSize: 14, lineHeight: 1.5 }}>{data.featured_section.description}</p>
                )}
                {data.featured_section.cta_label && (
                  <button
                    onClick={() => actions.lien(data.featured_section?.cta_url)}
                    style={{
                      width: "100%",
                      padding: "12px 0",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: accentColor,
                      color: contrastColor,
                    }}
                  >
                    {data.featured_section.cta_label}
                  </button>
                )}
              </div>
            )}

            {/* Before / After */}
            {(data.before_image_url || data.after_image_url) && (
              <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 280, margin: "32px auto 0" }}>
                {/* AVANT */}
                <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 16, overflow: "hidden", border: "1px solid #f1f1f1" }}>
                  <div style={{ padding: "8px 0", textAlign: "center", background: "rgba(255,255,255,0.8)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#000", textTransform: "uppercase", letterSpacing: "0.05em" }}>Avant</span>
                  </div>
                  <div style={{ aspectRatio: "3/4", overflow: "hidden" }}>
                    {data.before_image_url ? (
                      <img src={data.before_image_url} alt="Avant transformation" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 11, background: "#f3f4f6" }}>AVANT</div>
                    )}
                  </div>
                </div>
                {/* APRÈS */}
                <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 16, overflow: "hidden", border: "1px solid #f1f1f1" }}>
                  <div style={{ padding: "8px 0", textAlign: "center", background: "rgba(255,255,255,0.8)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#000", textTransform: "uppercase", letterSpacing: "0.05em" }}>Après</span>
                  </div>
                  <div style={{ aspectRatio: "3/4", overflow: "hidden", position: "relative" }}>
                    {data.after_image_url ? (
                      <img src={data.after_image_url} alt="Après transformation" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 11, background: "#f3f4f6" }}>APRÈS</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews — horizontal scroll carousel */}
            {data.reviews && data.reviews.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <div
                  style={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 16,
                    scrollbarWidth: "none",
                    paddingBottom: 8,
                  }}
                >
                  {data.reviews.slice(0, 3).map((r, i) => (
                    <div
                      key={i}
                      style={{
                        flexShrink: 0,
                        width: 300,
                        backgroundColor: "#f9f9f9",
                        borderRadius: 16,
                        padding: 16,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ display: "flex" }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <svg key={s} width={12} height={12} viewBox="0 0 24 24" fill={s <= r.rating ? "#000" : "#e5e5e5"}>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                          <span style={{ fontWeight: 600, color: "#111", fontSize: 14 }}>{r.name}</span>
                        </div>
                        {r.source && <span style={{ color: "#999", fontSize: 12 }}>via {r.source}</span>}
                      </div>
                      <p style={{ color: "#555", fontSize: 13, lineHeight: 1.55 }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", paddingTop: 24, paddingBottom: 16 }}>
            <style>{`@keyframes lystes-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#ccc", fontSize: 10, marginBottom: 0 }}>
              Propulsé par{" "}
              <a
                href="https://lystes.ai"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#999", textDecoration: "underline", cursor: "pointer", fontWeight: 500 }}
              >
                Lystes AI
              </a>
            </p>
            <img
              src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/logo/lystes.PNG"
              alt="Lystes"
              style={{
                display: "block",
                margin: "12px auto 8px",
                width: 41,
                height: 41,
                objectFit: "contain",
                animation: "lystes-spin 5s linear infinite",
              }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Agent Popup Modal */}
    {fenetreAgent && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
        onClick={fermerAgent}
      >
        <div
          className="ilp-fenetre"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: largeurFenetre,
            height: hauteurFenetre,
            margin: "0 16px",
            backgroundColor: "#fff",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={fermerAgent}
            aria-label="Fermer"
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 10,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.9)",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
              color: "#444",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {fenetreAgent}
        </div>
      </div>
    )}
    </>
  );
}
