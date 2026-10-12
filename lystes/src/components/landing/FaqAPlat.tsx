import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

/**
 * Questions fréquentes à plat, sans repliable (règle de JP, 11/10/2026) :
 * une carte par question, icône, question, réponse. Mise en page de /bio,
 * partagée avec /crea (12/10/2026). Chaque page écrit ses propres questions.
 */
export type QuestionAPlat = { icone: LucideIcon; q: string; r: string };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

export default function FaqAPlat({
  questions,
  surtitre = "Questions fréquentes",
  titre,
}: {
  questions: QuestionAPlat[];
  surtitre?: string;
  titre: string;
}) {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="space-y-4 mb-12 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-foreground">{surtitre}</p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground leading-relaxed text-balance">
          {titre}
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {questions.map((item, i) => (
          <motion.div key={item.q} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
            className="bg-secondary p-6 rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0">
              <item.icone className="h-5 w-5 text-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1.5 text-balance">{item.q}</h3>
              <p className="text-sm text-foreground leading-relaxed text-pretty">{item.r}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
