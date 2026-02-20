import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Minimize2, Maximize2,
  Bot, User, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

// ─── WooCommerce config ──────────────────────────────────
const WC_BASE = "https://biolystes.com/wp-json/wc/v3";
const CK = "ck_375b1fedd12fc4161c16f06a8358f4d362711239";
const CS = "cs_56ece5ac68b7c2c8ffafecbddb449504bac26657";

// ─── Images produits (hardcodées + WC dynamique) ─────────
// Map slug WC → image URL (hardcodée pour garantir l'affichage)
const SLUG_TO_IMAGE: Record<string, string> = {
  // Images connues du system prompt
  "lait-nettoyant-doux": "https://biolystes.com/wp-content/uploads/2025/04/I5J9D9fsoSw0EvGMdJfD0XEWX2ypDjfB-scaled.jpg",
  "creme-de-jour-anti-age": "https://biolystes.com/wp-content/uploads/2025/04/Creme-de-jour-anti-age-scaled.jpg",
  "creme-de-jour-anti-age-3": "https://biolystes.com/wp-content/uploads/2025/04/Creme-de-jour-anti-age-scaled.jpg",
  "creme-de-nuit-hydratante-au-ceramide": "https://biolystes.com/wp-content/uploads/2025/04/Creme-de-nuit-hydratante-au-ceramide-scaled.jpg",
  "creme-contour-des-yeux": "https://biolystes.com/wp-content/uploads/2025/04/Creme-contour-des-yeux-scaled.jpg",
  "creme-contour-des-yeux-3-en-1": "https://biolystes.com/wp-content/uploads/2025/04/Creme-contour-des-yeux-scaled.jpg",
  "creme-riche-nourrissante": "https://biolystes.com/wp-content/uploads/2025/04/Creme-riche-nourrissante-scaled.jpg",
  "gommage-profond-pour-cuir-chevelu-romarin-menthe": "https://biolystes.com/wp-content/uploads/2025/04/Gommage-profond-scaled.jpg",
  "gommage-cuir-chevelu-profond": "https://biolystes.com/wp-content/uploads/2025/04/Gommage-profond-scaled.jpg",
};

// Mots-clés → image (fallback quand le slug ne matche pas)
const KEYWORD_TO_IMAGE: Array<{ keys: string[]; url: string }> = [
  { keys: ["lait", "nettoyant"], url: "https://biolystes.com/wp-content/uploads/2025/04/I5J9D9fsoSw0EvGMdJfD0XEWX2ypDjfB-scaled.jpg" },
  { keys: ["creme", "jour", "anti", "age"], url: "https://biolystes.com/wp-content/uploads/2025/04/Creme-de-jour-anti-age-scaled.jpg" },
  { keys: ["creme", "nuit", "ceramide"], url: "https://biolystes.com/wp-content/uploads/2025/04/Creme-de-nuit-hydratante-au-ceramide-scaled.jpg" },
  { keys: ["creme", "nuit", "hydratante"], url: "https://biolystes.com/wp-content/uploads/2025/04/Creme-de-nuit-hydratante-au-ceramide-scaled.jpg" },
  { keys: ["contour", "yeux"], url: "https://biolystes.com/wp-content/uploads/2025/04/Creme-contour-des-yeux-scaled.jpg" },
  { keys: ["creme", "riche", "nourrissante"], url: "https://biolystes.com/wp-content/uploads/2025/04/Creme-riche-nourrissante-scaled.jpg" },
  { keys: ["gommage", "cuir", "chevelu"], url: "https://biolystes.com/wp-content/uploads/2025/04/Gommage-profond-scaled.jpg" },
  { keys: ["gommage", "profond"], url: "https://biolystes.com/wp-content/uploads/2025/04/Gommage-profond-scaled.jpg" },
];

// Cache WC dynamique (complète les hardcodées)
const wcImageCache: Record<string, string> = { ...SLUG_TO_IMAGE };
let wcCatalogLoaded = false;
let wcCatalogLoading: Promise<void> | null = null;

function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function loadWcCatalog(): Promise<void> {
  if (wcCatalogLoaded) return;
  if (wcCatalogLoading) return wcCatalogLoading;
  wcCatalogLoading = (async () => {
    try {
      const url = new URL(`${WC_BASE}/products`);
      url.searchParams.set("consumer_key", CK);
      url.searchParams.set("consumer_secret", CS);
      url.searchParams.set("per_page", "100");
      url.searchParams.set("status", "publish");
      url.searchParams.set("_fields", "slug,name,images");
      const res = await fetch(url.toString());
      if (!res.ok) return;
      const products: { slug: string; name: string; images: { src: string }[] }[] = await res.json();
      products.forEach(p => {
        if (p.images?.[0]?.src) {
          wcImageCache[p.slug] = p.images[0].src;
          wcImageCache[normalizeName(p.name)] = p.images[0].src;
        }
      });
      wcCatalogLoaded = true;
    } catch { /* silencieux */ }
  })();
  return wcCatalogLoading;
}

function findProductImage(name: string, slug?: string | null): string | undefined {
  // 1. Slug exact (hardcodé ou WC)
  if (slug && wcImageCache[slug]) return wcImageCache[slug];

  const norm = normalizeName(name);

  // 2. Nom normalisé exact
  if (wcImageCache[norm]) return wcImageCache[norm];

  // 3. Matching par mots-clés hardcodés
  for (const entry of KEYWORD_TO_IMAGE) {
    if (entry.keys.every(k => norm.includes(k))) return entry.url;
  }

  // 4. Matching partiel sur mots significatifs (≥4 lettres) dans le cache WC
  const words = norm.split(" ").filter(w => w.length >= 4);
  if (words.length === 0) return undefined;

  let bestKey: string | undefined;
  let bestScore = 0;
  for (const key of Object.keys(wcImageCache)) {
    const hits = words.filter(w => key.includes(w)).length;
    const score = hits / words.length;
    if (score > bestScore && hits >= Math.min(2, words.length)) {
      bestScore = score;
      bestKey = key;
    }
  }
  return bestKey ? wcImageCache[bestKey] : undefined;
}

function slugFromUrl(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/\/product\/([^/]+)\//);
  return m ? m[1] : null;
}




// ─── Types ───────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ─── Streaming helper ─────────────────────────────────────
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/biolystes-chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: { role: string; content: string }[];
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok || !resp.body) {
    let errMsg = "Une erreur est survenue avec l'IA.";
    try {
      const j = await resp.json();
      if (j.error) errMsg = j.error;
    } catch {}
    onError(errMsg);
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { streamDone = true; break; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Flush remaining
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw || !raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {}
    }
  }

  onDone();
}

// ─── Thinking indicator (before first chunk) ──────────────
function ThinkingIndicator() {
  const steps = ["Analyse de votre projet…", "Recherche dans le catalogue…", "Préparation des recommandations…"];
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through steps
    const stepTimer = setInterval(() => {
      setStep(s => (s + 1) % steps.length);
    }, 1800);
    // Animate progress bar
    const progressTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 90) return 90; // Never reach 100 until done
        return p + Math.random() * 6;
      });
    }, 200);
    return () => { clearInterval(stepTimer); clearInterval(progressTimer); };
  }, []);

  return (
    <div className="flex gap-2 items-start">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-muted">
        <span style={{ fontSize: 14 }}>✦</span>
      </div>
      <div style={{
        flex: 1, background: "#f5f5f7", borderRadius: 12, padding: "12px 16px",
        maxWidth: 320,
      }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: "#e5e5e7", borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
          <div style={{
            height: "100%", background: "#1d1d1f",
            borderRadius: 2, width: `${progress}%`,
            transition: "width 0.2s ease-out",
          }} />
        </div>
        {/* Animated step label */}
        <p style={{ margin: 0, fontSize: 12, color: "#6e6e73", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 3, background: "#1d1d1f", flexShrink: 0, animation: "biolPulse 1s ease-in-out infinite" }} />
          {steps[step]}
        </p>
      </div>
    </div>
  );
}

// ─── Typing indicator (dots, during streaming) ─────────────
function TypingIndicator() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-muted">
        <Bot size={12} />
      </div>
      <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-1.5">
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
  { text: "Comment lancer sa propre marque bio sans acheter de stock ?", icon: "📦" },
  { text: "La création d'un e-shop et les photos produits sont inclus ?", icon: "✨" },
  { text: "Quels produits pour une gamme peau sèche et mature ?", icon: "🔬" },
  { text: "Y a-t-il des frais supplémentaires ou un engagement minimum ?", icon: "→" },
];

// ─── Product card block ───────────────────────────────────
interface ProductBlock {
  numero?: string;
  titre: string;
  description: string;
  url?: string;
  image?: string;
}

function ProductItem({ block, resolvedImage }: { block: ProductBlock; resolvedImage?: string }) {
  const imgSrc = resolvedImage || block.image;
  return (
    <div className="space-y-3">
      {/* Badge numéroté + titre + description */}
      <div className="flex gap-3">
        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
          {block.numero || "•"}
        </div>
        <div>
          <strong className="font-semibold block">{block.titre}</strong>
          <p className="text-muted-foreground text-sm leading-relaxed">{block.description}</p>
        </div>
      </div>

      {/* Mini-card indentée : image + nom + description italique + lien */}
      <div className="ml-9 p-3 border rounded-lg flex items-start gap-3 bg-muted/50">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={block.titre}
            className="w-16 h-16 object-contain rounded-md flex-shrink-0 bg-white"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-16 h-16 rounded-md flex-shrink-0 bg-muted flex items-center justify-center">
            <span style={{ fontSize: 22 }}>🌿</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h5 className="font-semibold text-sm">{block.titre}</h5>
          <p className="text-xs text-muted-foreground italic mt-1">"{block.description}"</p>
          {block.url && (
            <a
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              Voir le produit
              <svg fill="none" width="16" height="16" viewBox="0 0 12 12" style={{ minWidth: 16, minHeight: 16, display: "inline-block", verticalAlign: "middle", marginLeft: 4 }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M4.6318 2.6318C4.80754 2.45607 5.09246 2.45607 5.2682 2.6318L8.2682 5.6318C8.44393 5.80754 8.44393 6.09246 8.2682 6.2682L5.2682 9.2682C5.09246 9.44393 4.80754 9.44393 4.6318 9.2682C4.45607 9.09246 4.45607 8.80754 4.6318 8.6318L7.3136 5.95L4.6318 3.2682C4.45607 3.09246 4.45607 2.80754 4.6318 2.6318Z" fill="currentColor"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Groupe les produits consécutifs — résout les images WC via catalogue préchargé
function ProductGroupCard({ blocks }: { blocks: ProductBlock[] }) {
  const [wcImages, setWcImages] = useState<Record<string, string>>({});

  useEffect(() => {
    loadWcCatalog().then(() => {
      const resolved: Record<string, string> = {};
      blocks.forEach(b => {
        const slug = slugFromUrl(b.url);
        const img = findProductImage(b.titre, slug);
        if (img) resolved[b.titre] = img;
      });
      setWcImages(resolved);
    });
  }, [blocks]);

  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <ProductItem key={i} block={b} resolvedImage={wcImages[b.titre]} />
      ))}
    </div>
  );
}

// ─── Market card block ─────────────────────────────────────
interface MarketBlock {
  titre: string;
  analyse: string;
  regions: string; // "France:85,Europe:70,..."
}

function MarketCard({ block }: { block: MarketBlock }) {
  const regions = block.regions.split(",").map(r => {
    const [name, score] = r.split(":");
    return { name: name.trim(), score: parseInt(score?.trim() || "0", 10) };
  }).filter(r => !isNaN(r.score));

  return (
    <div style={{
      borderRadius: 12,
      background: "#f5f5f7", padding: "14px 16px", marginTop: 4,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>📊</span>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1d1d1f", letterSpacing: "0.5px" }}>
          {block.titre}
        </p>
      </div>
      <p style={{ margin: "0 0 12px 0", fontSize: 11, color: "#424245", lineHeight: 1.6 }}>{block.analyse}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {regions.map((r, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: "#424245" }}>{r.name}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#1d1d1f" }}>{r.score}/100</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: "#e5e5e7" }}>
              <div style={{
                height: "100%", borderRadius: 3,
                background: r.score >= 75 ? "#1d1d1f" : r.score >= 50 ? "#6e6e73" : "#c7c7cc",
                width: `${r.score}%`, transition: "width 0.6s ease",
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Parse special blocks from AI content ─────────────────
interface ParsedSegment {
  type: "text" | "product" | "market";
  content: string;
  data?: ProductBlock | MarketBlock;
}

function parseSpecialBlocks(raw: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  const blockRegex = /:::(product|market)\n([\s\S]*?):::/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: raw.slice(lastIndex, match.index) });
    }
    const kind = match[1] as "product" | "market";
    const body = match[2];
    const fields: Record<string, string> = {};
    body.split("\n").forEach(line => {
      const colonIdx = line.indexOf(":");
      if (colonIdx === -1) return;
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      if (key) fields[key] = val;
    });
    segments.push({ type: kind, content: match[0], data: fields as any });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < raw.length) {
    segments.push({ type: "text", content: raw.slice(lastIndex) });
  }

  return segments.filter(s => s.type !== "text" || s.content.trim() !== "");
}

// ─── Render markdown-ish text ──────────────────────────────
function MessageContent({ content }: { content: string }) {
  const segments = parseSpecialBlocks(content);

  // Group consecutive product segments into a single ProductGroupCard
  const rendered: React.ReactNode[] = [];
  let i = 0;
  while (i < segments.length) {
    const seg = segments[i];
    if (seg.type === "product") {
      const group: ProductBlock[] = [seg.data as ProductBlock];
      while (i + 1 < segments.length && segments[i + 1].type === "product") {
        i++;
        group.push(segments[i].data as ProductBlock);
      }
      rendered.push(<ProductGroupCard key={i} blocks={group} />);
    } else if (seg.type === "market") {
      rendered.push(<MarketCard key={i} block={seg.data as MarketBlock} />);
    } else {
      // plain text
      const lines = seg.content.split("\n");
      rendered.push(
        <div key={i} className="space-y-1">
          {lines.map((line, li) => {
            if (!line.trim()) return <br key={li} />;
            if (line.startsWith("- ") || line.startsWith("• ")) {
              const text = line.replace(/^[-•]\s+/, "");
              return (
                <div key={li} className="flex gap-2">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
                </div>
              );
            }
            if (/^\d+\.\s/.test(line)) {
              const m = line.match(/^(\d+)\.\s+(.*)/);
              if (m) return (
                <div key={li} className="flex gap-2">
                  <span className="text-muted-foreground font-medium min-w-[1.2rem]">{m[1]}.</span>
                  <span dangerouslySetInnerHTML={{ __html: formatInline(m[2]) }} />
                </div>
              );
            }
            if (line.startsWith("## ")) return <p key={li} className="font-semibold text-foreground mt-2" dangerouslySetInnerHTML={{ __html: formatInline(line.slice(3)) }} />;
            if (line.startsWith("### ")) return <p key={li} className="font-medium text-foreground" dangerouslySetInnerHTML={{ __html: formatInline(line.slice(4)) }} />;
            return <p key={li} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />;
          })}
        </div>
      );
    }
    i++;
  }

  return (
    <div className="text-sm leading-relaxed space-y-3">
      {rendered}
    </div>
  );
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class='bg-muted px-1 rounded text-xs'>$1</code>");
}


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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialInput);
  const [typing, setTyping] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setInput(initialInput); }, [initialInput]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;

    if (messages.length === 0) onConversationStart?.();

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    onInputChange?.("");
    setTyping(true);

    // Préparer le message assistant (streaming)
    const assistantId = (Date.now() + 1).toString();
    let assistantStarted = false;

    try {
      await streamChat({
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        onDelta: (chunk) => {
          if (!assistantStarted) {
            assistantStarted = true;
            setTyping(false);
            setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: chunk }]);
          } else {
            setMessages(prev =>
              prev.map(m => m.id === assistantId ? { ...m, content: m.content + chunk } : m)
            );
          }
        },
        onDone: () => {
          setTyping(false);
          if (!assistantStarted) {
            // Réponse vide
            setMessages(prev => [...prev, {
              id: assistantId, role: "assistant",
              content: "Je n'ai pas pu générer une réponse. Veuillez réessayer."
            }]);
          }
        },
        onError: (errMsg) => {
          setTyping(false);
          toast.error(errMsg);
          setMessages(prev => [...prev, {
            id: assistantId, role: "assistant",
            content: `❌ ${errMsg}`
          }]);
        },
      });
    } catch (e) {
      setTyping(false);
      toast.error("Erreur de connexion à l'IA.");
    }
  };

  const isEmpty = messages.length === 0 && !typing;

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: .4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes biolPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

        {/* ── Empty state: prompt cards ─────────────────────── */}
        {isEmpty && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
            {PROMPTS.map((card, i) => (
              <button
                key={i}
                onClick={() => sendMessage(card.text)}
                style={{
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  padding: 16, borderRadius: 16, background: "#ffffff",
                  textAlign: "left", cursor: "pointer", minHeight: 96, transition: "background .15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f7")}
                onMouseLeave={e => (e.currentTarget.style.background = "#ffffff")}
              >
                <p style={{ fontSize: 12, fontWeight: 500, color: "#424245", lineHeight: 1.45 }}>{card.text}</p>
                <div style={{ alignSelf: "flex-end", marginTop: 8, color: "#c7c7cc", fontSize: 16 }}>{card.icon}</div>
              </button>
            ))}
          </div>
        )}

        {/* ── Chat messages ─────────────────────────────────── */}
        {!isEmpty && (
          <div style={{
            maxHeight: expanded ? "none" : 600,
            overflowY: expanded ? "visible" : "auto",
            marginBottom: 12,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 8 }}>
              {messages.map((msg, idx) => {
                const isLastAssistant =
                  msg.role === "assistant" &&
                  !typing &&
                  idx === messages.length - 1;
                return (
                  <div key={msg.id}>
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="flex items-end gap-2 max-w-[80%]">
                          <div
                            style={{ background: "#1d1d1f", color: "#fff", borderRadius: "18px 18px 4px 18px" }}
                            className="px-4 py-2.5 text-sm"
                          >
                            {msg.content}
                          </div>
                          <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                            <User size={12} color="#fff" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-start">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-muted mt-1">
                          <Bot size={12} />
                        </div>
                        <div className="flex-1 max-w-[90%] flex flex-col gap-2">
                          <div className="bg-muted rounded-xl px-4 py-3">
                            <MessageContent content={msg.content} />
                          </div>
                          {isLastAssistant && (
                            <a
                              href="https://app.iclosed.io/e/paylystes/r2"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                alignSelf: "flex-start",
                                fontSize: 10, fontWeight: 700, letterSpacing: "1.1px",
                                textTransform: "uppercase", textDecoration: "none",
                                color: "#1d1d1f", border: "1.5px solid #1d1d1f",
                                padding: "5px 14px", borderRadius: 20,
                                display: "inline-flex", alignItems: "center", gap: 6,
                                transition: "all .15s",
                                background: "transparent",
                              }}
                              onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.background = "#1d1d1f";
                                (e.currentTarget as HTMLElement).style.color = "#fff";
                              }}
                              onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                                (e.currentTarget as HTMLElement).style.color = "#1d1d1f";
                              }}
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                              </svg>
                              Prendre rendez-vous
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {typing && <ThinkingIndicator />}
              <div ref={bottomRef} />
            </div>
          </div>
        )}

        {/* ── Input bar ─────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          borderRadius: 16, background: "#ffffff",
          padding: "10px 16px",
        }}>
          <input
            value={input}
            onChange={e => { setInput(e.target.value); onInputChange?.(e.target.value); }}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder="Posez vos questions..."
            disabled={typing}
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
            disabled={typing || !input.trim()}
            style={{
              width: 30, height: 30, borderRadius: 15, border: "none",
              background: input.trim() && !typing ? "#1d1d1f" : "#e5e5e7",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: input.trim() && !typing ? "pointer" : "default", transition: "background .15s",
              color: input.trim() && !typing ? "#fff" : "#86868b",
            }}
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </>
  );
}
