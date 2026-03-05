import { motion } from "framer-motion";
import { Play } from "lucide-react";
import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta3 from "@/assets/insta-3.jpg";
import insta4 from "@/assets/insta-4.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

const posts = [
  { src: insta1, alt: "Présentation produit Biolystes 1" },
  { src: insta2, alt: "Présentation produit Biolystes 2" },
  { src: insta3, alt: "Présentation produit Biolystes 3" },
  { src: insta4, alt: "Présentation produit Biolystes 4" },
];

export default function InstaFeedSection() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-12 text-center">
        <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Nos produits en action
        </motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground">
          Découvrez quelques-uns de nos produits
        </motion.h2>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
        {posts.map((post, i) => (
          <motion.a
            key={i}
            href="https://www.instagram.com/biolystes/"
            target="_blank"
            rel="noopener noreferrer"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
            className="relative flex-shrink-0 w-[260px] md:w-[280px] aspect-[9/16] rounded-2xl overflow-hidden group snap-start"
          >
            <img
              src={post.src}
              alt={post.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Play className="h-5 w-5 text-foreground ml-0.5" fill="currentColor" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
