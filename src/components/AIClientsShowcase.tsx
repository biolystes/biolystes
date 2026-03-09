import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import sevmylook1 from "@/assets/sevmylook-1.jpg";
import sevmylook2 from "@/assets/sevmylook-2.jpg";
import sevmylook3 from "@/assets/sevmylook-3.jpg";
import sevmylook4 from "@/assets/sevmylook-4.jpg";
import sevmylook5 from "@/assets/sevmylook-5.jpg";
import sevmylook6 from "@/assets/sevmylook-6.jpg";
import sevmylook7 from "@/assets/sevmylook-7.jpg";
import sevmylook8 from "@/assets/sevmylook-8.jpg";
import sevmylook9 from "@/assets/sevmylook-9.jpg";

import kaniwa1 from "@/assets/kaniwa-1.jpg";
import kaniwa2 from "@/assets/kaniwa-2.jpg";
import kaniwa3 from "@/assets/kaniwa-3.jpg";
import kaniwa4 from "@/assets/kaniwa-4.jpg";
import kaniwa5 from "@/assets/kaniwa-5.jpg";
import kaniwa6 from "@/assets/kaniwa-6.jpg";
import kaniwa7 from "@/assets/kaniwa-7.jpg";
import kaniwa8 from "@/assets/kaniwa-8.jpg";

import fralene1 from "@/assets/fralene-1.jpg";
import fralene2 from "@/assets/fralene-2.jpg";
import fralene3 from "@/assets/fralene-3.jpg";
import fralene4 from "@/assets/fralene-4.jpg";
import fralene5 from "@/assets/fralene-5.jpg";
import fralene6 from "@/assets/fralene-6.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const row1 = [sevmylook4, sevmylook1, sevmylook2, sevmylook7, sevmylook3, sevmylook9, sevmylook5, sevmylook8, sevmylook6];
const row2 = [kaniwa1, kaniwa2, kaniwa3, kaniwa4, kaniwa5, kaniwa6, kaniwa7, kaniwa8];
const row3 = [fralene1, fralene2, fralene3, fralene4, fralene5, fralene6];

function InfiniteRow({ images, speed = 30, reverse = false }: { images: string[]; speed?: number; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pos = reverse ? -(el.scrollWidth / 2) : 0;
    let raf: number;
    const step = () => {
      pos += reverse ? 1.5 : -1.5;
      const half = el.scrollWidth / 2;
      if (!reverse && pos <= -half) pos = 0;
      if (reverse && pos >= 0) pos = -half;
      el.style.transform = `translate3d(${pos}px, 0, 0)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reverse]);

  const doubled = [...images, ...images];

  return (
    <div className="overflow-hidden">
      <div ref={ref} className="flex gap-3 will-change-transform" style={{ width: "max-content" }}>
        {doubled.map((src, i) => (
          <img key={i} src={src} alt={`Client project ${i + 1}`} loading="lazy"
            className="h-[200px] md:h-[260px] w-auto rounded-xl object-cover shrink-0" />
        ))}
      </div>
    </div>
  );
}

export default function AIClientsShowcase() {
  return (
    <section className="py-[80px] md:py-[100px] bg-background overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[clamp(20px,5vw,80px)] mb-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-4">Nos clients</p>
          <h2 className="text-[24px] md:text-[clamp(32px,4vw,44px)] font-medium tracking-[-0.03em] mb-3 leading-[1.15]">
            Ces boutiques ont recruté leurs équipes AI.{" "}
            <span className="font-['Instrument_Serif'] italic text-muted-foreground">Regardez le résultat.</span>
          </h2>
          <p className="text-[15px] text-muted-foreground max-w-[520px] mx-auto mb-6 leading-[1.7]">
            Vos équipes créatives IA génèrent automatiquement vos photos produits, visuels marketing et contenus authentiques. Vous n'avez rien à faire.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="https://kaniwabotanique.com" target="_blank" rel="noopener noreferrer"
              className="text-[13px] text-muted-foreground hover:text-foreground border border-border rounded-full px-4 py-1.5 transition-colors">
              kaniwabotanique.com
            </a>
            <a href="https://fraleneparis.com" target="_blank" rel="noopener noreferrer"
              className="text-[13px] text-muted-foreground hover:text-foreground border border-border rounded-full px-4 py-1.5 transition-colors">
              fraleneparis.com
            </a>
          </div>
        </motion.div>
      </div>

      <div className="space-y-3">
        <InfiniteRow images={row1} />
        <InfiniteRow images={row2} reverse />
        <InfiniteRow images={row3} />
      </div>
    </section>
  );
}
