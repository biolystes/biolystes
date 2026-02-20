import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip, Mic, Send, Minimize2, Maximize2,
  Bot, User, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

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
  { text: "Comment lancer sa propre marque bio sans acheter de stock ?", icon: "📦" },
  { text: "La création d'un e-shop et les photos produits sont inclus ?", icon: "✨" },
  { text: "Quels produits pour une gamme peau sèche et mature ?", icon: "🔬" },
  { text: "Y a-t-il des frais supplémentaires ou un engagement minimum ?", icon: "→" },
];

// ─── Render markdown-ish text ──────────────────────────────
function MessageContent({ content }: { content: string }) {
  // Simple rendering: bold, bullets, line breaks
  const lines = content.split("\n");
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        // bullet
        if (line.startsWith("- ") || line.startsWith("• ")) {
          const text = line.replace(/^[-•]\s+/, "");
          return (
            <div key={i} className="flex gap-2">
              <span className="text-muted-foreground mt-0.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
            </div>
          );
        }
        // numbered
        if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s+(.*)/);
          if (match) return (
            <div key={i} className="flex gap-2">
              <span className="text-muted-foreground font-medium min-w-[1.2rem]">{match[1]}.</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(match[2]) }} />
            </div>
          );
        }
        // heading ##
        if (line.startsWith("## ")) return <p key={i} className="font-semibold text-foreground mt-2" dangerouslySetInnerHTML={{ __html: formatInline(line.slice(3)) }} />;
        if (line.startsWith("### ")) return <p key={i} className="font-medium text-foreground" dangerouslySetInnerHTML={{ __html: formatInline(line.slice(4)) }} />;
        return <p key={i} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />;
      })}
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
                  border: "1px solid #e5e5e7",
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
                        <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center flex-shrink-0 bg-white mt-1">
                          <Bot size={12} />
                        </div>
                        <div className="flex-1 max-w-[90%] flex flex-col gap-2">
                          <div className="bg-card border border-border rounded-xl px-4 py-3">
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
              {typing && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          </div>
        )}

        {/* ── Input bar ─────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          borderRadius: 16, background: "#ffffff",
          border: "1px solid #e5e5e7",
          padding: "10px 16px",
        }}>
          <Paperclip size={15} color="#c7c7cc" style={{ cursor: "pointer", flexShrink: 0 }} />
          <Mic size={15} color="#c7c7cc" style={{ flexShrink: 0 }} />
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
