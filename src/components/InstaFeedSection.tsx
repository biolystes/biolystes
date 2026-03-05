import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta3 from "@/assets/insta-3.jpg";
import insta4 from "@/assets/insta-4.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

const posts = [
  {
    src: insta1,
    alt: "Présentation produit Biolystes 1",
    video: "https://phosphor.utils.elfsightcdn.com/?url=https%3A%2F%2Fscontent-bcn1-1.cdninstagram.com%2Fo1%2Fv%2Ft2%2Ff2%2Fm86%2FAQMJJKvn6-NVNyu6Po82APeTCHefGbMqcS5Tyt6B4WffUFk9bdzSgxNWghpJiG_4EFN_U1rTotBt3Disq3OoN5S6_8Rl1TfZzor6ipI.mp4%3F_nc_cat%3D105%26_nc_sid%3D5e9851%26_nc_ht%3Dscontent-bcn1-1.cdninstagram.com%26_nc_ohc%3DRNzx0u5HJyAQ7kNvwEEgRyJ%26efg%3DeyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6NzE1NjI0MDgxMTU4NzExLCJ2aV91c2VjYXNlX2lkIjoxMDA5OSwiZHVyYXRpb25fcyI6NjY2LCJ1cmxnZW5fc291cmNlIjoid3d3In0%253D%26ccb%3D17-1%26vs%3D6a7ef8a5ebc1b3ad%26_nc_vs%3DHBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC9ENDRGNjYwQzc2NjVBRkQ4RTQ1ODM4MDE2RDRDQkE4Q192aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HSHhNVlI3cWRpV2Fzbm9FQUQxSzI3WFJIclU3YnFfRUFBQUYVAgLIARIAKAAYABsCiAd1c2Vfb2lsATEScHJvZ3Jlc3NpdmVfcmVjaXBlATEVAAAm7siz8ua2xQIVAigCQzMsF0CE0gAAAAAAGBJkYXNoX2Jhc2VsaW5lXzFfdjERAHX-B2XmnQEA%26_nc_gid%3DyG0vhgPcnItHmIXo5BDn1w%26_nc_zt%3D28%26oh%3D00_AfYa2Qvo_BM_wCZoFeoGsbx5AoIU1I-nPqTKou9ojVooWw%26oe%3D68D0108A",
  },
  {
    src: insta2,
    alt: "Présentation produit Biolystes 2",
    video: "https://phosphor.utils.elfsightcdn.com/?url=https%3A%2F%2Fscontent-bcn1-1.cdninstagram.com%2Fo1%2Fv%2Ft2%2Ff2%2Fm86%2FAQMqUfVZEruzqbjMAx0f500nyz_qeBQpa6mVoji72vrQ5LQNjWMFfwdQY5YMOWUeUXnfKQfcEv6ZGPmJ36O2HvthPSJNrb-wGooYmE8.mp4%3F_nc_cat%3D100%26_nc_sid%3D5e9851%26_nc_ht%3Dscontent-bcn1-1.cdninstagram.com%26_nc_ohc%3D5H6ZCNmZwA0Q7kNvwFx12T2%26efg%3DeyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6MTI0NTI0MTY0NjQ0NTE1OCwidmlfdXNlY2FzZV9pZCI6MTAwOTksImR1cmF0aW9uX3MiOjQxNywidXJsZ2VuX3NvdXJjZSI6Ind3dyJ9%26ccb%3D17-1%26vs%3D671ed7dbccc023b4%26_nc_vs%3DHBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC9ERDQxRjRDMjI0MUNBODIyQkJBMEQzNkVFMUE5MTZBQl92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HSmtHSUI3U2NLS0JudFlHQUpFWklHd0lvSTFOYnFfRUFBQUYVAgLIARIAKAAYABsCiAd1c2Vfb2lsATEScHJvZ3Jlc3NpdmVfcmVjaXBlATEVAAAmzMn3n82itgQVAigCQzMsF0B6FVP3ztkXGBJkYXNoX2Jhc2VsaW5lXzFfdjERAHX-B2XmnQEA%26_nc_gid%3DyG0vhgPcnItHmIXo5BDn1w%26_nc_zt%3D28%26oh%3D00_AfbKMJXBd9ulhMkyrBo6KFptabZfi7U3NhECK8Qrv4uzoQ%26oe%3D68D01ED1",
  },
  {
    src: insta3,
    alt: "Présentation produit Biolystes 3",
    video: "https://phosphor.utils.elfsightcdn.com/?url=https%3A%2F%2Fscontent-bcn1-1.cdninstagram.com%2Fo1%2Fv%2Ft2%2Ff2%2Fm86%2FAQNfhqsw3bQQKCs-ON3TIM_-hpBw1ziZ60zPP9EmSL61nZEdviNo4i7SPUrh23TMhdseeOpXDEfr9j3yLYvJRrEROMVrhlxazZsbxWY.mp4%3F_nc_cat%3D101%26_nc_sid%3D5e9851%26_nc_ht%3Dscontent-bcn1-1.cdninstagram.com%26_nc_ohc%3DL7Ffu8fiAAIQ7kNvwHiZJa7%26efg%3DeyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6NzI2NTIyMzIzMzkxOTgwLCJ2aV91c2VjYXNlX2lkIjoxMDA5OSwiZHVyYXRpb25fcyI6MzY1LCJ1cmxnZW5fc291cmNlIjoid3d3In0%253D%26ccb%3D17-1%26vs%3D5080b4169fa235ec%26_nc_vs%3DHBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC85NTQ5MUI0RDQxQ0VDODk4REE0RjMwMzQ3Qzk2RTk5OV92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HRTlCSng3d2VSRUtSQzhHQUc3YnVITDFFZlIxYnFfRUFBQUYVAgLIARIAKAAYABsCiAd1c2Vfb2lsATEScHJvZ3Jlc3NpdmVfcmVjaXBlATEVAAAm2NeOkJWxygIVAigCQzMsF0B221P3ztkXGBJkYXNoX2Jhc2VsaW5lXzFfdjERAHX-B2XmnQEA%26_nc_gid%3DyG0vhgPcnItHmIXo5BDn1w%26_nc_zt%3D28%26oh%3D00_AfaYVqEVcEUDSaHGQjXu_x1H6fdPgZaaTUkvD1GyvL3LLg%26oe%3D68D01D6A",
  },
  {
    src: insta4,
    alt: "Présentation produit Biolystes 4",
    video: "https://phosphor.utils.elfsightcdn.com/?url=https%3A%2F%2Fscontent-bcn1-1.cdninstagram.com%2Fo1%2Fv%2Ft2%2Ff2%2Fm86%2FAQM0gMD96H5QVHYe46_UqiBxsogwyr_yqT_8tS197Dbk0rQcMh4cofweyC7p-McqIzkyw30lUpWG4ucMT7kLSFoiUjtOePlh1jHFLlg.mp4%3F_nc_cat%3D102%26_nc_sid%3D5e9851%26_nc_ht%3Dscontent-bcn1-1.cdninstagram.com%26_nc_ohc%3D5f3HWhyZLfMQ7kNvwFa-ktY%26efg%3DeyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6MTQxOTcxODE0MjU0MzEwMiwidmlfdXNlY2FzZV9pZCI6MTAwOTksImR1cmF0aW9uX3MiOjc3OSwidXJsZ2VuX3NvdXJjZSI6Ind3dyJ9%26ccb%3D17-1%26vs%3D7170aade18fd0e39%26_nc_vs%3DHBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC9ENjQ4OUYzMjJCMjdCRTc3MEE4NzE0QTQ4REEyMkI5QV92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HUHdzRXg0ODJ3Y292bUVQQUlKZGRpVGRTZG9KYnFfRUFBQUYVAgLIARIAKAAYABsCiAd1c2Vfb2lsATEScHJvZ3Jlc3NpdmVfcmVjaXBlATEVAAAm_JOKubzOhQUVAigCQzMsF0CIX-uFHrhSGBJkYXNoX2Jhc2VsaW5lXzFfdjERAHX-B2XmnQEA%26_nc_gid%3DyG0vhgPcnItHmIXo5BDn1w%26_nc_zt%3D28%26oh%3D00_AfYhj23comGDTXxMAyYfpPn19Y50lSbv1E-xMNfqmsix4g%26oe%3D68CFF90B",
  },
];

export default function InstaFeedSection() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

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
          <motion.button
            key={i}
            onClick={() => setActiveVideo(i)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
            className="relative flex-shrink-0 w-[260px] md:w-[280px] aspect-[9/16] rounded-2xl overflow-hidden group snap-start cursor-pointer border-0 p-0 bg-transparent"
          >
            <img
              src={post.src}
              alt={post.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Play className="h-5 w-5 text-foreground ml-0.5" fill="currentColor" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={posts[activeVideo].video}
                autoPlay
                loop
                playsInline
                controls
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
