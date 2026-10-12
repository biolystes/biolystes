import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Mic, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@lystes/lib/utils";
import { useMouvementReduit } from "@lystes/hooks/useMouvementReduit";

/* Les messages de la démonstration, dans l'ordre où ils s'affichent. */
const TOUS_LES_MESSAGES = ["msg-1", "msg-2", "msg-3", "msg-3b", "msg-3c", "msg-4", "msg-5", "msg-6", "msg-7"];

export function AnimatedChat({
  compact = false,
  actionLabel,
}: {
  compact?: boolean;
  /**
   * Libelle du bouton noir de la demonstration. Omis, c'est celui de toujours
   * (« Faire un diagnostic ») : le comportement des appelants existants ne
   * change pas d'un caractere. `/business` passe le sien, une entreprise de
   * services n'ayant pas de diagnostic a proposer.
   */
  actionLabel?: string;
}) {
  const { t } = useTranslation();
  const placeholder = t("productAgentPage.s400");
  const [visibleMsgs, setVisibleMsgs] = useState<string[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputText, setInputText] = useState(placeholder);
  const [isTypingInput, setIsTypingInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  /* « Réduire les animations » : la conversation s'affiche entière, sans
     frappe simulée ni boucle (audit du 27/09/2026). */
  const mouvementReduit = useMouvementReduit();

  const scrollToBottom = useCallback(() => {
    setTimeout(() => containerRef.current?.scrollTo({ top: containerRef.current?.scrollHeight ?? 0, behavior: "smooth" }), 50);
  }, []);

  const showMsg = useCallback((id: string) => {
    setVisibleMsgs(prev => [...prev, id]);
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    if (mouvementReduit) {
      setVisibleMsgs(TOUS_LES_MESSAGES);
      setShowTyping(false);
      setShowSuggestions(false);
      setIsTypingInput(false);
      setInputText(placeholder);
      return;
    }
    if (!isVisible) return;
    let cancelled = false;
    const d = (ms: number) => new Promise<void>(r => { const t = setTimeout(() => { if (!cancelled) r(); }, ms); });

    const typeAndSend = async (text: string, msgId: string) => {
      setIsTypingInput(true); setInputText("");
      for (let i = 0; i < text.length; i++) {
        if (cancelled) return;
        setInputText(text.slice(0, i + 1));
        await new Promise(r => setTimeout(r, 20));
      }
      await d(400); if (cancelled) return;
      setIsTypingInput(false); setInputText(placeholder);
      setShowSuggestions(false); showMsg(msgId);
    };

    (async () => {
      try {
        await d(1400); if (cancelled) return;
        setShowTyping(true); await d(1200); if (cancelled) return;
        setShowTyping(false); showMsg("msg-1"); await d(500); if (cancelled) return;
        setShowSuggestions(true); await d(1800); if (cancelled) return;
        await typeAndSend(t("productAgentPage.s406"), "msg-2");
        await d(500); if (cancelled) return;
        setShowTyping(true); scrollToBottom(); await d(2000); if (cancelled) return;
        setShowTyping(false); showMsg("msg-3"); await d(2500); if (cancelled) return;
        await typeAndSend(t("productAgentPage.s407"), "msg-3b");
        await d(600); if (cancelled) return;
        setShowTyping(true); scrollToBottom(); await d(1500); if (cancelled) return;
        setShowTyping(false); showMsg("msg-3c"); await d(2500); if (cancelled) return;
        await typeAndSend(t("productAgentPage.s408"), "msg-4");
        await d(600); if (cancelled) return;
        setShowTyping(true); scrollToBottom(); await d(1800); if (cancelled) return;
        setShowTyping(false); showMsg("msg-5"); await d(2000); if (cancelled) return;
        await typeAndSend(t("productAgentPage.s409"), "msg-6");
        await d(500); if (cancelled) return;
        setShowTyping(true); scrollToBottom(); await d(1500); if (cancelled) return;
        setShowTyping(false); showMsg("msg-7");
        await d(6000); if (cancelled) return;
        setVisibleMsgs([]); setShowSuggestions(false); setShowTyping(false); setAnimKey(k => k + 1);
      } catch { /* */ }
    })();
    return () => { cancelled = true; };
  }, [isVisible, animKey, showMsg, scrollToBottom, t, placeholder, mouvementReduit]);

  const isShown = (id: string) => visibleMsgs.includes(id);
  const pop = mouvementReduit
    ? { initial: false as const }
    : { initial: { opacity: 0, y: 10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] } };

  const chatWhiteBg = { background: '#fff' } as const;

  return (
    <motion.div className={cn("bg-background border border-border rounded-[20px] overflow-hidden shadow-sm flex flex-col", compact ? "mb-4" : "mb-6")}
      style={chatWhiteBg}
      onViewportEnter={() => setIsVisible(true)} viewport={{ once: false, margin: "-50px" }}>
      <div ref={containerRef} className={cn(
        "flex flex-col bg-muted/30 transition-all duration-500",
        compact
          ? "h-[150px] overflow-y-auto gap-3 p-3 pt-4"
          : `${visibleMsgs.length === 0 && !showTyping ? "min-h-0 p-0" : "min-h-[291px] md:h-[291px] md:overflow-y-auto p-4 pt-5"} gap-4`
      )} style={{ scrollBehavior: "smooth", scrollbarWidth: "none", background: '#fff' }}>
        {isShown("msg-1") && (
          <motion.div {...pop} className="flex flex-col gap-1 w-full shrink-0" style={chatWhiteBg}>
            <div className="bg-background border border-border shadow-sm text-foreground text-[10px] p-3 rounded-2xl rounded-tl-sm leading-relaxed w-[92%]" style={chatWhiteBg}>
              {t("productAgentPage.s401")}
            </div>
            <span className="text-[9px] text-muted-foreground ml-1 font-medium">{t("productAgentPage.s402")}</span>
          </motion.div>
        )}
        {showSuggestions && (
          <div className="flex flex-wrap gap-1.5 ml-1">
            {[t("productAgentPage.s403"), t("productAgentPage.s404"), t("productAgentPage.s405")].map(s => (
              <span key={s} className="text-[9px] px-2.5 py-1 border border-border bg-background rounded-full text-muted-foreground shadow-sm">{s}</span>
            ))}
          </div>
        )}
        {isShown("msg-2") && <motion.div {...pop} className="flex flex-col gap-1 w-full items-end shrink-0"><div className="bg-foreground text-primary-foreground text-[10px] py-3 px-4 rounded-2xl rounded-tr-sm w-fit max-w-[85%] leading-relaxed">{t("productAgentPage.s406")}</div><span className="text-[9px] text-muted-foreground mr-1 font-medium">09:42</span></motion.div>}
        {isShown("msg-3") && <motion.div {...pop} className="flex flex-col gap-2 w-full shrink-0"><div className="bg-background border border-border shadow-sm text-foreground text-[10px] p-4 rounded-2xl rounded-tl-sm flex flex-col gap-3 w-[92%]" style={chatWhiteBg}><span className="leading-relaxed">{t("productAgentPage.s410")}</span><div className="flex flex-col gap-2"><div className="flex items-center gap-2 p-1.5 bg-muted/50 rounded-xl border border-border" style={chatWhiteBg}><img src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/before-after/d7bb6871-6142-4c3b-8daf-b754fb38f4eb/1766996391238.png" alt="" className="w-[58px] h-[42px] object-cover rounded-lg border border-border shadow-sm shrink-0" /><div className="flex flex-col min-w-0 flex-1"><span className="text-[10px] font-bold leading-tight truncate">{t("productAgentPage.s411")}</span><span className="text-[9px] text-muted-foreground mt-0.5 truncate">{t("productAgentPage.s412")}</span></div></div><div className="flex items-center gap-2 p-1.5 bg-muted/50 rounded-xl border border-border" style={chatWhiteBg}><img src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/before-after/d7bb6871-6142-4c3b-8daf-b754fb38f4eb/1766996432144.png" alt="" className="w-[58px] h-[42px] object-cover rounded-lg border border-border shadow-sm shrink-0" /><div className="flex flex-col min-w-0 flex-1"><span className="text-[10px] font-bold leading-tight truncate">{t("productAgentPage.s413")}</span><span className="text-[9px] text-muted-foreground mt-0.5 truncate">{t("productAgentPage.s414")}</span></div></div></div><span className="leading-relaxed">{t("productAgentPage.s415")}</span></div><span className="text-[9px] text-muted-foreground ml-1 font-medium">09:42</span></motion.div>}
        {isShown("msg-3b") && <motion.div {...pop} className="flex flex-col gap-1 w-full items-end shrink-0"><div className="bg-foreground text-primary-foreground text-[10px] py-3 px-4 rounded-2xl rounded-tr-sm w-fit max-w-[85%] leading-relaxed">{t("productAgentPage.s407")}</div><span className="text-[9px] text-muted-foreground mr-1 font-medium">09:43</span></motion.div>}
        {isShown("msg-3c") && <motion.div {...pop} className="flex flex-col gap-2 w-full shrink-0"><div className="bg-background border border-border shadow-sm text-foreground text-[10px] p-3 rounded-2xl rounded-tl-sm w-[92%] leading-relaxed" style={chatWhiteBg}>{t("productAgentPage.s416")}</div><div className="relative bg-background border border-border rounded-2xl p-4 shadow-sm w-[92%] flex flex-col gap-3" style={chatWhiteBg}><div className="flex gap-0.5 mt-1">{[...Array(5)].map((_, i) => <div key={i} className="bg-[#194cff] text-white flex items-center justify-center w-[18px] h-[18px] rounded-[3px]"><Star className="w-[11px] h-[11px] fill-current" /></div>)}</div><p className="text-[10px] text-foreground italic leading-relaxed font-medium">{t("productAgentPage.s417")}</p><p className="text-[10px] text-muted-foreground">{t("productAgentPage.s418")}</p><div className="flex items-center justify-end gap-3 mt-1"><div className="w-7 h-7 border border-border rounded-full flex items-center justify-center text-muted-foreground opacity-50 bg-muted"><ChevronLeft className="w-3 h-3" /></div><span className="text-[10px] text-muted-foreground font-medium">1 / 2</span><div className="w-7 h-7 border border-border rounded-full flex items-center justify-center text-foreground bg-background shadow-sm"><ChevronRight className="w-3 h-3" /></div></div></div><span className="text-[9px] text-muted-foreground ml-1 font-medium">09:43</span></motion.div>}
        {isShown("msg-4") && <motion.div {...pop} className="flex flex-col gap-1 w-full items-end shrink-0"><div className="bg-foreground text-primary-foreground text-[10px] py-3 px-4 rounded-2xl rounded-tr-sm w-fit max-w-[85%] leading-relaxed">{t("productAgentPage.s408")}</div><span className="text-[9px] text-muted-foreground mr-1 font-medium">09:44</span></motion.div>}
        {isShown("msg-5") && <motion.div {...pop} className="flex flex-col gap-1 w-full shrink-0"><div className="flex flex-col gap-2 w-[95%] overflow-hidden"><div className="bg-background border border-border shadow-sm text-foreground text-[10px] p-3 rounded-2xl rounded-tl-sm w-fit" style={chatWhiteBg}>{t("productAgentPage.s419")}</div><div className="flex gap-2 overflow-x-auto pb-2 pl-1" style={{ scrollbarWidth: "none", background: '#fff' }}>{[{ img: "/hero-produit-1.jpg", name: t("productAgentPage.s420"), price: "35,00 €" },{ img: "/hero-produit-2.jpg", name: t("productAgentPage.s421"), price: "34,00 €" },{ img: "/hero-produit-1.jpg", name: t("productAgentPage.s422"), price: "29,00 €" }].map((p, i) => <div key={i} className="min-w-[90px] bg-background border border-border rounded-xl p-2 flex flex-col gap-1 items-center text-center relative shadow-sm shrink-0" style={chatWhiteBg}><img src={p.img} alt={p.name} className="w-12 h-14 rounded object-cover shadow-sm mb-1" /><p className="text-[9px] font-bold leading-tight h-6">{p.name}</p><p className="text-[9px] text-muted-foreground font-medium">{p.price}</p><button className="absolute -bottom-2 right-2 bg-foreground text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-md">+</button></div>)}</div></div></motion.div>}
        {isShown("msg-6") && <motion.div {...pop} className="flex flex-col gap-1 w-full items-end shrink-0 mt-2"><div className="bg-foreground text-primary-foreground text-[10px] py-2.5 px-3.5 rounded-2xl rounded-tr-sm w-fit">{t("productAgentPage.s409")}</div></motion.div>}
        {isShown("msg-7") && <motion.div {...pop} className="flex flex-col gap-1 w-full shrink-0"><div className="bg-background border border-border shadow-sm text-foreground text-[10px] p-3 rounded-2xl rounded-tl-sm leading-relaxed w-[92%]" style={chatWhiteBg}>{t("productAgentPage.s423")}</div></motion.div>}
        {showTyping && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 w-full shrink-0"><div className="bg-background border border-border shadow-sm py-3 px-3.5 rounded-2xl rounded-tl-sm w-fit flex gap-1.5 items-center h-[34px]"><div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDuration: "1.4s", animationDelay: "-0.32s" }} /><div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDuration: "1.4s", animationDelay: "-0.16s" }} /><div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDuration: "1.4s" }} /></div></motion.div>}
      </div>
      <div className={cn("bg-background border-t border-border shrink-0", compact ? "p-2" : "p-2")} style={{ background: '#fff' }}>
        <div className="relative rounded-[18px] p-[1.5px] bg-gradient-to-r from-pink-300 via-purple-200 to-green-200 shadow-sm">
          <div className={cn("bg-background rounded-[16px] flex flex-col", compact ? "p-2 gap-1.5" : "p-2.5 gap-2")}>
            <div className={cn("text-[10px] pl-1 tracking-wide", compact ? "min-h-[30px] leading-[1.25]" : "min-h-[16px]")}>
              {isTypingInput ? <span className="text-foreground">{inputText}<span className="animate-pulse ml-[1px]">|</span></span> : <span className="text-muted-foreground">{inputText}</span>}
            </div>
            <div className="flex items-center justify-between mt-0.5 gap-2">
              <div className="bg-foreground rounded-full py-1 pl-1 pr-3 flex items-center gap-2 shadow-md shrink-0">
                <div className="flex items-center pl-0.5">
                  <div className="relative"><img src="https://lystes.ai/assets/doctor3-C5vTeB-z.jpg" className="w-5 h-5 rounded-md border-[1.5px] border-background object-cover" alt="" /><div className="absolute -top-1 -right-1 bg-gradient-to-br from-pink-100 via-blue-50 to-green-100 text-[5px] font-bold px-[3px] rounded shadow-sm text-foreground border border-background/80">AI</div></div>
                </div>
                <span className="text-primary-foreground text-[8px] font-bold tracking-wide whitespace-nowrap" style={{ fontSize: '8px' }}>{actionLabel ?? t("productAgentPage.s424")}</span>
              </div>
              <div className="flex items-center gap-2 pr-0.5 shrink-0">
                <Mic className="w-3.5 h-3.5 text-muted-foreground" />
                <div className="bg-foreground text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center shadow-md"><ArrowUp className="w-2.5 h-2.5" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
