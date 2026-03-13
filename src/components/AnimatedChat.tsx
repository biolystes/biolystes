import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Mic, ArrowUp } from "lucide-react";

export function AnimatedChat() {
  const [visibleMsgs, setVisibleMsgs] = useState<string[]>(["msg-1"]);
  const [showTyping, setShowTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [inputText, setInputText] = useState("Posez votre question sur ce produit ...");
  const [isTypingInput, setIsTypingInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => containerRef.current?.scrollTo({ top: containerRef.current?.scrollHeight ?? 0, behavior: "smooth" }), 50);
  }, []);

  const showMsg = useCallback((id: string) => {
    setVisibleMsgs(prev => [...prev, id]);
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
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
      setIsTypingInput(false); setInputText("Posez votre question sur ce produit ...");
      setShowSuggestions(false); showMsg(msgId);
    };

    (async () => {
      try {
        await d(800); if (cancelled) return;
        await typeAndSend("Bonjour, j'aimerais savoir si cette crème est adaptée aux peaux mixtes et métisses ?", "msg-2");
        await d(500); if (cancelled) return;
        setShowTyping(true); scrollToBottom(); await d(2000); if (cancelled) return;
        setShowTyping(false); showMsg("msg-3"); await d(2500); if (cancelled) return;
        await typeAndSend("C'est impressionnant ! Avez-vous des avis de clientes qui l'ont testée ?", "msg-3b");
        await d(600); if (cancelled) return;
        setShowTyping(true); scrollToBottom(); await d(1500); if (cancelled) return;
        setShowTyping(false); showMsg("msg-3c"); await d(2500); if (cancelled) return;
        await typeAndSend("Top ! Et avez-vous d'autres produits pour ma routine ?", "msg-4");
        await d(600); if (cancelled) return;
        setShowTyping(true); scrollToBottom(); await d(1800); if (cancelled) return;
        setShowTyping(false); showMsg("msg-5"); await d(2000); if (cancelled) return;
        await typeAndSend("Merci :)", "msg-6");
        await d(500); if (cancelled) return;
        setShowTyping(true); scrollToBottom(); await d(1500); if (cancelled) return;
        setShowTyping(false); showMsg("msg-7");
        await d(6000); if (cancelled) return;
        setVisibleMsgs(["msg-1"]); setShowSuggestions(true); setShowTyping(false); setAnimKey(k => k + 1);
      } catch { /* */ }
    })();
    return () => { cancelled = true; };
  }, [isVisible, animKey, showMsg, scrollToBottom]);

  const isShown = (id: string) => visibleMsgs.includes(id);
  const pop = { initial: { opacity: 0, y: 10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] } };

  const chatWhiteBg = { background: '#fff' } as const;

  return (
    <motion.div className="mb-6 bg-background border border-border rounded-[20px] overflow-hidden shadow-sm flex flex-col"
      style={chatWhiteBg}
      onViewportEnter={() => setIsVisible(true)} viewport={{ once: false, margin: "-50px" }}>
      <div ref={containerRef} className="h-[291px] overflow-y-auto p-4 pt-5 flex flex-col gap-4 bg-muted/30" style={{ scrollBehavior: "smooth", scrollbarWidth: "none", background: '#fff' }}>
        <div className="flex flex-col gap-1 w-full shrink-0" style={chatWhiteBg}>
          <div className="bg-background border border-border shadow-sm text-foreground text-[12px] p-3 rounded-2xl rounded-tl-sm leading-relaxed w-[92%]" style={chatWhiteBg}>
            Parfait ! J'ai analysé votre diagnostic. Peau de type Mixte. Préoccupations : Vitiligo, Pores dilatés, Légères rougeurs. Comment puis-je vous aider avec la Crème de jour anti-âge ?
          </div>
          <span className="text-[9px] text-muted-foreground ml-1 font-medium">Maintenant</span>
        </div>
        {showSuggestions && (
          <div className="flex flex-wrap gap-1.5 ml-1">
            {["Quels sont les ingrédients clés ?", "Est-elle en stock ?", "Délai de livraison ?"].map(s => (
              <span key={s} className="text-[9px] px-2.5 py-1 border border-border bg-background rounded-full text-muted-foreground shadow-sm">{s}</span>
            ))}
          </div>
        )}
        {isShown("msg-2") && <motion.div {...pop} className="flex flex-col gap-1 w-full items-end shrink-0"><div className="bg-foreground text-primary-foreground text-[13px] py-3 px-4 rounded-2xl rounded-tr-sm w-fit max-w-[85%] leading-relaxed">Bonjour, j'aimerais savoir si cette crème est adaptée au peau mixte et métisse ?</div><span className="text-[9px] text-muted-foreground mr-1 font-medium">09:42</span></motion.div>}
        {isShown("msg-3") && <motion.div {...pop} className="flex flex-col gap-2 w-full shrink-0"><div className="bg-background border border-border shadow-sm text-foreground text-[13px] p-4 rounded-2xl rounded-tl-sm flex flex-col gap-3 w-[92%]" style={chatWhiteBg}><span className="leading-relaxed">Absolument ! Notre formule contient des extraits marins et de l'acide hyaluronique. Voici des résultats :</span><div className="flex flex-col gap-2"><div className="flex items-center gap-3 p-2 bg-muted/50 rounded-xl border border-border" style={chatWhiteBg}><img src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/before-after/d7bb6871-6142-4c3b-8daf-b754fb38f4eb/1766996391238.png" alt="" className="w-[76px] h-[52px] object-cover rounded-lg border border-border shadow-sm" /><div className="flex flex-col"><span className="text-[13px] font-bold leading-tight">Anti-vieillissement</span><span className="text-[11px] text-muted-foreground mt-0.5">5 semaines</span></div></div><div className="flex items-center gap-3 p-2 bg-muted/50 rounded-xl border border-border" style={chatWhiteBg}><img src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/before-after/d7bb6871-6142-4c3b-8daf-b754fb38f4eb/1766996432144.png" alt="" className="w-[76px] h-[52px] object-cover rounded-lg border border-border shadow-sm" /><div className="flex flex-col"><span className="text-[13px] font-bold leading-tight">Anti-âge front</span><span className="text-[11px] text-muted-foreground mt-0.5">3 semaines</span></div></div></div><span className="leading-relaxed">Ces résultats vous parlent ?</span></div><span className="text-[9px] text-muted-foreground ml-1 font-medium">09:42</span></motion.div>}
        {isShown("msg-3b") && <motion.div {...pop} className="flex flex-col gap-1 w-full items-end shrink-0"><div className="bg-foreground text-primary-foreground text-[13px] py-3 px-4 rounded-2xl rounded-tr-sm w-fit max-w-[85%] leading-relaxed">C'est impressionnant ! Avez-vous des avis de clientes ?</div><span className="text-[9px] text-muted-foreground mr-1 font-medium">09:43</span></motion.div>}
        {isShown("msg-3c") && <motion.div {...pop} className="flex flex-col gap-2 w-full shrink-0"><div className="bg-background border border-border shadow-sm text-foreground text-[13px] p-3 rounded-2xl rounded-tl-sm w-[92%] leading-relaxed" style={chatWhiteBg}>Bien sûr ! Voici quelques retours vérifiés :</div><div className="relative bg-background border border-border rounded-2xl p-4 shadow-sm w-[92%] flex flex-col gap-3" style={chatWhiteBg}><div className="flex gap-0.5 mt-1">{[...Array(5)].map((_, i) => <div key={i} className="bg-[#00B67A] text-white flex items-center justify-center w-[18px] h-[18px] rounded-[3px]"><Star className="w-[11px] h-[11px] fill-current" /></div>)}</div><p className="text-[13px] text-foreground italic leading-relaxed font-medium">"Ma peau paraît nettement plus jeune et lumineuse. Confort, éclat et peau revitalisée."</p><p className="text-[12px] text-muted-foreground">Alice - via Trustpilot</p><div className="flex items-center justify-end gap-3 mt-1"><div className="w-7 h-7 border border-border rounded-full flex items-center justify-center text-muted-foreground opacity-50 bg-muted"><ChevronLeft className="w-3 h-3" /></div><span className="text-[11px] text-muted-foreground font-medium">1 / 2</span><div className="w-7 h-7 border border-border rounded-full flex items-center justify-center text-foreground bg-background shadow-sm"><ChevronRight className="w-3 h-3" /></div></div></div><span className="text-[9px] text-muted-foreground ml-1 font-medium">09:43</span></motion.div>}
        {isShown("msg-4") && <motion.div {...pop} className="flex flex-col gap-1 w-full items-end shrink-0"><div className="bg-foreground text-primary-foreground text-[13px] py-3 px-4 rounded-2xl rounded-tr-sm w-fit max-w-[85%] leading-relaxed">Top ! D'autres produits pour ma routine ?</div><span className="text-[9px] text-muted-foreground mr-1 font-medium">09:44</span></motion.div>}
        {isShown("msg-5") && <motion.div {...pop} className="flex flex-col gap-1 w-full shrink-0"><div className="flex flex-col gap-2 w-[95%] overflow-hidden"><div className="bg-background border border-border shadow-sm text-foreground text-[13px] p-3 rounded-2xl rounded-tl-sm w-fit" style={chatWhiteBg}>Voici ce qui pourrait compléter votre routine :</div><div className="flex gap-2 overflow-x-auto pb-2 pl-1" style={{ scrollbarWidth: "none", background: '#fff' }}>{[{ img: "https://i0.wp.com/kaniwabotanique.com/wp-content/uploads/2025/08/O236SDw9GkuAtxkcoHnMrhJ_9lJP7tPq-scaled.jpg?w=1930&ssl=1", name: "Sérum vitamine C", price: "35,00 €" },{ img: "https://i0.wp.com/kaniwabotanique.com/wp-content/uploads/2026/01/FRONT_high_res-12-scaled.jpg?w=1930&ssl=1", name: "Sérum anti-âge", price: "34,00 €" },{ img: "", name: "Gel Hydratation", price: "29,00 €" }].map((p, i) => <div key={i} className="min-w-[90px] bg-background border border-border rounded-xl p-2 flex flex-col gap-1 items-center text-center relative shadow-sm shrink-0" style={chatWhiteBg}>{p.img ? <img src={p.img} alt={p.name} className="w-12 h-14 rounded object-cover shadow-sm mb-1" /> : <div className="w-12 h-14 bg-[#c8e6c9] rounded mb-1" />}<p className="text-[9px] font-bold leading-tight h-6">{p.name}</p><p className="text-[9px] text-muted-foreground font-medium">{p.price}</p><button className="absolute -bottom-2 right-2 bg-foreground text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[12px] shadow-md">+</button></div>)}</div></div></motion.div>}
        {isShown("msg-6") && <motion.div {...pop} className="flex flex-col gap-1 w-full items-end shrink-0 mt-2"><div className="bg-foreground text-primary-foreground text-[12px] py-2.5 px-3.5 rounded-2xl rounded-tr-sm w-fit">Merci :)</div></motion.div>}
        {isShown("msg-7") && <motion.div {...pop} className="flex flex-col gap-1 w-full shrink-0"><div className="bg-background border border-border shadow-sm text-foreground text-[12px] p-3 rounded-2xl rounded-tl-sm leading-relaxed w-[92%]" style={chatWhiteBg}>De rien ! Crème ajoutée au panier. N'hésitez pas pour d'autres questions.</div></motion.div>}
        {showTyping && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 w-full shrink-0"><div className="bg-background border border-border shadow-sm py-3 px-3.5 rounded-2xl rounded-tl-sm w-fit flex gap-1.5 items-center h-[34px]"><div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDuration: "1.4s", animationDelay: "-0.32s" }} /><div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDuration: "1.4s", animationDelay: "-0.16s" }} /><div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDuration: "1.4s" }} /></div></motion.div>}
      </div>
      <div className="p-3 bg-background border-t border-border shrink-0" style={{ background: '#fff' }}>
        <div className="relative rounded-[22px] p-[1.5px] bg-gradient-to-r from-pink-300 via-purple-200 to-green-200 shadow-sm">
          <div className="bg-background rounded-[20px] p-3 flex flex-col gap-3">
            <div className="text-[13px] pl-1 tracking-wide min-h-[20px]">
              {isTypingInput ? <span className="text-foreground">{inputText}<span className="animate-pulse ml-[1px]">|</span></span> : <span className="text-muted-foreground">{inputText}</span>}
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="bg-foreground rounded-full py-1.5 pl-1.5 pr-4 flex items-center gap-2.5 shadow-md">
                <div className="flex items-center pl-0.5">
                  <img src="https://i.pravatar.cc/100?img=5" className="w-6 h-6 rounded-md border-[1.5px] border-background relative z-10 object-cover" alt="" />
                  <img src="https://i.pravatar.cc/100?img=11" className="w-6 h-6 rounded-md border-[1.5px] border-background relative z-20 -ml-2 object-cover" alt="" />
                  <div className="relative z-30 -ml-2"><img src="https://i.pravatar.cc/100?img=9" className="w-6 h-6 rounded-md border-[1.5px] border-background object-cover" alt="" /><div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-pink-100 via-blue-50 to-green-100 text-[6px] font-bold px-1 rounded shadow-sm text-foreground border border-background/80">AI</div></div>
                </div>
                <span className="text-primary-foreground text-[10px] font-bold tracking-wide">Faire un diagnostic</span>
              </div>
              <div className="flex items-center gap-3 pr-1">
                <Mic className="w-5 h-5 text-muted-foreground" />
                <div className="bg-foreground text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center shadow-md"><ArrowUp className="w-3 h-3" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
