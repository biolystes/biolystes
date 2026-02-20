import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, BarChart3, ExternalLink, ChevronRight,
  Paperclip, Mic, Send, X, Minimize2, Maximize2,
  Bot, User
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

// ─── Types ───────────────────────────────────────────────
interface ProductReco {
  index: number;
  name: string;
  description: string;
  image: string;
  url: string;
}

interface MarketData {
  region: string;
  value: number;
}

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  text?: string;
  products?: ProductReco[];
  marketText?: string;
  marketData?: MarketData[];
}

// ─── Mock AI response (from note.html) ───────────────────
const MOCK_PRODUCTS: ProductReco[] = [
  {
    index: 1,
    name: "Lait nettoyant doux",
    description: "Ce lait nettoyant doux, enrichi en Beurre de Karité, est idéal pour initier une routine nourrissante. Il nettoie en douceur et élimine les impuretés tout en respectant le film hydrolipidique des peaux sèches et sensibles.",
    image: "https://biolystes.com/wp-content/uploads/2025/04/I5J9D9fsoSw0EvGMdJfD0XEWX2ypDjfB-scaled.jpg",
    url: "https://biolystes.com/product/lait-nettoyant-doux/",
  },
  {
    index: 2,
    name: "Crème de jour anti-âge",
    description: "Cette crème de jour anti-âge, intégrant du Beurre de Karité, de l'Huile de Jojoba et de l'Huile d'Avocat, offre une nutrition intense et une protection quotidienne. Elle répond à la demande des peaux sèches à matures.",
    image: "https://biolystes.com/wp-content/uploads/2025/04/zCCAE65le6fswf3rsfLmdT7TA03LF7eY-scaled.jpg",
    url: "https://biolystes.com/product/creme-de-jour-anti-age-2/",
  },
  {
    index: 3,
    name: "Crème de nuit hydratante au céramide",
    description: "Pour compléter la routine, cette crème de nuit hydratante aux Céramides et Beurre de Karité est essentielle. Elle soutient le processus de réparation nocturne de la peau, renforce la barrière cutanée et hydrate en profondeur.",
    image: "https://biolystes.com/wp-content/uploads/2025/04/pmtMjWPvweg3DpCzAbXYmm-vdXYa_0Po-scaled.jpg",
    url: "https://biolystes.com/product/creme-de-nuit-hydratante-au-ceramide/",
  },
  {
    index: 4,
    name: "Crème contour des yeux apaisante",
    description: "Le contour des yeux est une zone délicate souvent sujette à la sécheresse. Cette crème apaisante, avec Beurre de Karité, Huile de Jojoba et Céramides, hydrate intensément, renforce la barrière cutanée.",
    image: "https://biolystes.com/wp-content/uploads/2025/04/ue_FH5XeEylHyy0rgdhLCUg57pvnZAPu-scaled.jpg",
    url: "https://biolystes.com/product/creme-contour-des-yeux-apaisante/",
  },
  {
    index: 5,
    name: "Crème riche nourrissante",
    description: "Cette crème riche est une excellente option pour les peaux très sèches, matures. Sa concentration élevée en Beurre de Karité, Beurre de Cacao et Huiles d'Argan/Olive en fait un produit réparateur et protecteur.",
    image: "https://biolystes.com/wp-content/uploads/2025/04/ksItyT4KEAPPRjfz1z1uKfUej_sZeZMR-scaled.jpg",
    url: "https://biolystes.com/product/creme-riche-nourrissante/",
  },
  {
    index: 6,
    name: "Gommage profond pour cuir chevelu texturé, Romarin & Menthe",
    description: "Pour étendre la gamme au-delà du visage et capitaliser sur les vertus nourrissantes du Beurre de Karité pour le cuir chevelu et les cheveux, ce gommage permet une détox et une nutrition profonde.",
    image: "https://biolystes.com/wp-content/uploads/2025/06/aW1hZ2U9L2dhbGxlcnktcGhvdG9zLzczRjhPM2pmUklTc2JYcVhYMGFYckJmRHlXYkEyM1ZRLmpwZWcmd2lkdGg9ODk2.jpg",
    url: "https://biolystes.com/product/gommage-profond-pour-cuir-chevelu-romarin-menthe/",
  },
];

const MOCK_MARKET_DATA: MarketData[] = [
  { region: "France", value: 85 },
  { region: "Belgique", value: 72 },
  { region: "Canada", value: 68 },
  { region: "Suisse", value: 65 },
  { region: "Maroc", value: 58 },
  { region: "Sénégal", value: 52 },
];

const MOCK_MARKET_TEXT = "Le marché des cosmétiques bio et naturels, en particulier ceux formulés avec des ingrédients reconnus comme le beurre de Karité, est en croissance constante à l'échelle mondiale. Un positionnement clair sur les propriétés nourrissantes et protectrices du beurre de Karité, couplé aux certifications ECOCERT/COSMOS des produits Biolystes, offre une opportunité significative pour une nouvelle marque.";

// ─── Product card (matches note.html exactly) ─────────────
function ProductCard({ reco }: { reco: ProductReco }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
          {reco.index}
        </div>
        <div>
          <strong className="font-semibold block text-sm">Produit recommandé</strong>
          <p className="text-muted-foreground text-sm leading-relaxed">{reco.description}</p>
        </div>
      </div>
      <div className="ml-9 p-3 border border-border rounded-lg flex items-start gap-3 bg-muted/50">
        <img
          src={reco.image}
          alt={reco.name}
          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <div className="flex-1 min-w-0">
          <h5 className="font-semibold text-sm">{reco.name}</h5>
          <p className="text-xs text-muted-foreground italic mt-1 line-clamp-2">"{reco.description}"</p>
          <a
            href={reco.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs mt-2 text-foreground hover:underline font-medium"
          >
            Voir le produit <ChevronRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── AI Message bubble ────────────────────────────────────
function AIBubble({ msg }: { msg: AIMessage }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="flex items-end gap-2 max-w-[80%]">
          <div
            style={{ background: "#1d1d1f", color: "#fff", borderRadius: "18px 18px 4px 18px" }}
            className="px-4 py-2.5 text-sm"
          >
            {msg.text}
          </div>
          <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
            <User size={12} color="#fff" />
          </div>
        </div>
      </div>
    );
  }

  // Assistant with rich content
  return (
    <div className="flex gap-2 items-start">
      <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center flex-shrink-0 bg-white mt-1">
        <Bot size={12} />
      </div>
      <div className="flex-1 space-y-4 max-w-full">
        {/* Product recommendations card */}
        {msg.products && msg.products.length > 0 && (
          <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-border">
              <div className="p-2 bg-muted rounded-lg" style={{ transform: "rotate(2deg)" }}>
                <Lightbulb size={18} className="text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold">Produits conseillés pour votre lancement</h3>
            </div>
            <div className="space-y-5">
              {msg.products.map(reco => (
                <ProductCard key={reco.index} reco={reco} />
              ))}
            </div>
          </div>
        )}

        {/* Market study card */}
        {msg.marketText && (
          <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-border">
              <div className="p-2 bg-muted rounded-lg" style={{ transform: "rotate(2deg)" }}>
                <BarChart3 size={18} className="text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold">Étude du marché visé</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{msg.marketText}</p>
          </div>
        )}

        {/* Market chart */}
        {msg.marketData && (
          <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
            <h3 className="text-sm font-semibold mb-4">Potentiel par région</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={msg.marketData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, "Opportunité"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #f0f0f0", fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {msg.marketData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#1d1d1f" : "#d1d1d6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center flex-shrink-0 bg-white">
        <Bot size={12} />
      </div>
      <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: 6, height: 6, borderRadius: "50%", background: "#d1d1d6",
              display: "block",
              animation: `bounce 1.2s ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Prompt suggestions ───────────────────────────────────
const PROMPTS = [
  { text: "Comment lancer ses propres produits bio sans acheter de stock ?", icon: "📦" },
  { text: "La création d'un e-shop et les photos produits sont inclus ?", icon: "✨" },
  { text: "Peut-on avoir des échantillons pour vérifier la qualité ?", icon: "🔬" },
  { text: "Y a-t-il d'autres frais ou un engagement minimum ?", icon: "→" },
];

// ─── Main AIChat component ────────────────────────────────
export default function AIChat({
  initialInput = "",
  onInputChange,
  onConversationStart,
}: {
  initialInput?: string;
  onInputChange?: (v: string) => void;
  onConversationStart?: () => void;
}) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState(initialInput);
  const [typing, setTyping] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setInput(initialInput); }, [initialInput]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    // Notifier le parent que la conversation démarre (1er message)
    if (messages.length === 0) {
      onConversationStart?.();
    }

    const userMsg: AIMessage = { id: Date.now().toString(), role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    onInputChange?.("");
    setTyping(true);

    // Réponse IA simulée après 1.8s
    setTimeout(() => {
      setTyping(false);
      const aiMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        products: MOCK_PRODUCTS,
        marketText: MOCK_MARKET_TEXT,
        marketData: MOCK_MARKET_DATA,
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1800);
  };


  const isEmpty = messages.length === 0 && !typing;

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: .4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

        {/* ── Empty state: prompt cards + input ─────────────── */}
        {isEmpty && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
              {PROMPTS.map((card, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(card.text)}
                  style={{
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    padding: 16, borderRadius: 16, background: "#f5f5f7", border: "none",
                    textAlign: "left", cursor: "pointer", minHeight: 96, transition: "background .15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#ebebed")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#f5f5f7")}
                >
                  <p style={{ fontSize: 12, fontWeight: 500, color: "#424245", lineHeight: 1.45 }}>{card.text}</p>
                  <div style={{ alignSelf: "flex-end", marginTop: 8, color: "#d1d1d6", fontSize: 14 }}>{card.icon}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Chat messages ──────────────────────────────────── */}
        {!isEmpty && (
          <div style={{
            maxHeight: expanded ? "none" : 600,
            overflowY: expanded ? "visible" : "auto",
            marginBottom: 12,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 8 }}>
              {messages.map(msg => (
                <AIBubble key={msg.id} msg={msg} />
              ))}
              {typing && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          </div>
        )}

        {/* ── Input bar ──────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          borderRadius: 16, background: "#f5f5f7",
          padding: "10px 16px",
        }}>
          <Paperclip size={15} color="#d1d1d6" />
          <Mic size={15} color="#d1d1d6" />
          <input
            value={input}
            onChange={e => { setInput(e.target.value); onInputChange?.(e.target.value); }}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Posez vos questions..."
            style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, color: "#1d1d1f", outline: "none" }}
          />
          <span style={{ fontSize: 10, color: "#d1d1d6" }}>{input.length}/1000</span>
          {!isEmpty && (
            <button
              onClick={() => setExpanded(e => !e)}
              style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: "#ebebed", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              title={expanded ? "Réduire" : "Agrandir"}
            >
              {expanded ? <Minimize2 size={12} color="#86868b" /> : <Maximize2 size={12} color="#86868b" />}
            </button>
          )}
          <button
            onClick={() => sendMessage(input)}
            style={{
              width: 30, height: 30, borderRadius: 15, border: "none",
              background: input.trim() ? "#1d1d1f" : "#e5e5e7",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: input.trim() ? "pointer" : "default", transition: "background .15s",
              color: input.trim() ? "#fff" : "#86868b",
            }}
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </>
  );
}
