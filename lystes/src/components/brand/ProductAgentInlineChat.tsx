import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2, Mic, Sparkles } from "lucide-react";
import { supabase } from "@lystes/integrations/supabase/client";
import { deMarque } from "@lystes/lib/elision";
import { titreEnFrancais } from "@lystes/lib/titre-produit";
import { toast } from "sonner";

/* Lot 13 (12/10/2026) : le même chat sert la page d'avis de la MARQUE.
   Sans `productId`, il passe `accountId` à `lystes-product-chat`, qui répond
   avec le catalogue de la marque. */
interface Props {
  productId?: string;
  /** Page d'avis de la marque : le compte, à la place de la fiche. */
  accountId?: string;
  productName?: string;
  brandName: string;
}

/** La langue du navigateur du visiteur : le chat lui répond dans la sienne. */
function langueDuVisiteur(): string | undefined {
  if (typeof navigator === "undefined") return undefined;
  return navigator.languages?.[0] || navigator.language || undefined;
}

/** Le texte du lien : le site et la page, sans les paramètres de suivi. */
function lienLisible(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "")}`;
  } catch {
    return url;
  }
}

/** Les adresses d'une réponse deviennent des liens cliquables (lien d'achat). */
function avecLiens(texte: string) {
  const morceaux = texte.split(/(https?:\/\/[^\s<>()"']+)/g);
  return morceaux.map((m, i) => {
    if (!/^https?:\/\//.test(m)) return m;
    const propre = m.replace(/[.,;:!?)\]]+$/, "");
    const reste = m.slice(propre.length);
    return (
      <span key={i}>
        <a href={propre} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 break-all">
          {lienLisible(propre)}
        </a>
        {reste}
      </span>
    );
  });
}

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface AgentMeta {
  id: string;
  name: string;
  expert_name: string;
  initial_message?: string | null;
  logo_url?: string | null;
}

export function ProductAgentInlineChat({ productId, accountId, productName, brandName }: Props) {
  const cible = productId ? { product_id: productId } : { account_id: accountId };
  const pageMarque = !productId;
  const [agent, setAgent] = useState<AgentMeta | null>(null);
  const [agentLoading, setAgentLoading] = useState(true);
  const [agentUnavailable, setAgentUnavailable] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Resolve linked agent
  useEffect(() => {
    let cancelled = false;
    setAgentLoading(true);
    setAgentUnavailable(false);
    setMessages([]);

    supabase.functions
      .invoke("lystes-product-chat", { body: { ...cible, mode: "init" } })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data?.agent) {
          setAgentUnavailable(true);
        } else {
          setAgent(data.agent);
          if (data.agent.initial_message) {
            setMessages([{ role: "assistant", content: data.agent.initial_message }]);
          } else {
            setMessages([
              {
                role: "assistant",
                content: pageMarque
                  ? `Bonjour, je suis ${data.agent.expert_name}. Je connais les produits ${deMarque(brandName)} et les avis de leurs clients. Que cherchez-vous\u00a0?`
                  : `Bonjour, je suis ${data.agent.expert_name}. Je peux répondre à toutes vos questions sur ${productName} : usage, ingrédients, retours clients… Que souhaitez-vous savoir ?`,
              },
            ]);
          }
        }
      })
      .finally(() => !cancelled && setAgentLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, accountId, productName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading || !agent) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("lystes-product-chat", {
        body: {
          ...cible,
          message: text,
          history: next.slice(0, -1),
          langue_visiteur: langueDuVisiteur(),
        },
      });
      if (error) throw error;
      const reply = data?.reply || "Je n'ai pas pu formuler de réponse, pouvez-vous reformuler ?";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      toast.error("L'agent est momentanément indisponible.");
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Je rencontre un souci technique. Réessayez dans un instant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (agentLoading) {
    return (
      <div className="bg-stone-50 p-8 flex items-center justify-center text-stone-400">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (agentUnavailable || !agent) return null;

  const suggestions = pageMarque
    ? ["Quel produit pour moi\u00a0?", "Que disent les avis\u00a0?", "Par quoi commencer\u00a0?"]
    : [
        "Pour quel type de peau ?",
        "Que disent les avis ?",
        "Comment l'utiliser ?",
      ];

  return (
    <section className="bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-2 pb-12">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500">
            <Sparkles className="w-3.5 h-3.5" />
            Échangez avec l'expert{agent.expert_name?.endsWith("e") ? "e" : ""} {pageMarque ? brandName : "produit"}
          </div>
          <h2 className="mt-2 font-editorial text-3xl md:text-4xl font-normal tracking-[-0.02em] [text-wrap:balance]">
            Posez vos questions à {agent.expert_name}
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            {pageMarque
              ? <>{agent.expert_name} connaît tous les produits {deMarque(brandName)} et les avis de leurs clients.</>
              : <>{agent.expert_name} connaît {titreEnFrancais(productName ?? "")} {deMarque(brandName)} et tous les avis clients vérifiés.</>}
          </p>
        </div>

        <div className="bg-white rounded-[25px]">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-stone-100 rounded-t-[25px]">
            {agent.logo_url ? (
              <img src={agent.logo_url} alt={agent.expert_name} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                {agent.expert_name?.[0] ?? "A"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{agent.expert_name}</div>
              <div className="text-[11px] text-stone-500">Expert{agent.expert_name?.endsWith("e") ? "e" : ""} produit · {brandName}</div>
            </div>
            {/* Une seule couleur dans la maison (CHARTE.md) : le point « en
                ligne » est noir comme le reste du chat, plus émeraude. */}
            <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
              <span className="w-1.5 h-1.5 rounded-full bg-black" /> En ligne
            </span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="max-h-[440px] min-h-[280px] overflow-y-auto px-5 py-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] bg-black text-white px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                      : "max-w-[80%] bg-stone-100 text-stone-900 px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                  }
                >
                  {m.role === "assistant" ? avecLiens(m.content) : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-stone-100 px-4 py-2.5 text-sm text-stone-500 inline-flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {agent.expert_name} rédige…
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                  }}
                  className="text-xs bg-stone-100 hover:bg-stone-200 px-3.5 py-1.5 rounded-full text-stone-700 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="px-5 py-4 bg-stone-100 rounded-b-[25px]"
          >
            <div className="flex items-center gap-1 bg-white rounded-full pl-5 pr-1.5 py-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={pageMarque ? `Une question sur ${brandName}\u00a0?` : `Une question sur ${titreEnFrancais(productName ?? "")} ?`}
                className="flex-1 bg-transparent h-9 text-sm outline-none placeholder:text-stone-400"
                disabled={loading}
              />
              <button
                type="button"
                className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full text-stone-400 hover:text-stone-600 transition"
                aria-label="Dicter"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black text-white disabled:opacity-30 hover:opacity-90 transition"
                aria-label="Envoyer"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
