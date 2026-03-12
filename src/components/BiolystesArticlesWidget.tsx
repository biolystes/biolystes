import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import articleFeaturedImg from "@/assets/article-featured.jpg";

const articles = [
  {
    id: 1,
    title: "92% des porteurs de projets cosmétiques sur mesure n'ont toujours pas lancé leur marque 7 mois après",
    description: "Étude interne Biolystes — Échantillon de 30 porteurs de projets — Suivi sur 7 mois. Découvrez pourquoi la formulation sur mesure bloque la majorité des projets.",
    image: articleFeaturedImg,
    date: "12 mars 2026",
    featured: true,
    url: "/pourquoi-biolystes",
  },
  {
    id: 2,
    title: "Pack Découverte : testez avant de vous engager",
    description: "4 produits cosmétiques bio & végan personnalisés à votre marque dès 49€/mois en 3x. Le montant est déduit si vous passez à une offre supérieure.",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=320&h=240&fit=crop",
    date: "8 mars 2026",
    featured: false,
    url: "/tarifs",
  },
  {
    id: 3,
    title: "Lystes.ai : votre marketing piloté par l'intelligence artificielle",
    description: "Agents IA dédiés, diagnostic de peau, recommandation produits, création de contenu — tout ce dont votre marque a besoin pour vendre.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=320&h=240&fit=crop",
    date: "1 mars 2026",
    featured: false,
    url: "/ai",
  },
  {
    id: 4,
    title: "Comment lancer sa marque cosmétique bio en 15 jours",
    description: "Zéro stock, zéro logistique, certifié COSMOS & ECOCERT. Le guide complet pour les entrepreneurs.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=320&h=240&fit=crop",
    date: "22 février 2026",
    featured: false,
    url: "/",
  },
  {
    id: 5,
    title: "Le biais de l'actif : pourquoi l'ingrédient ne fait pas le produit",
    description: "Pour le client final, le plus important c'est que le produit fonctionne. Pas la liste des actifs sur l'étiquette.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=320&h=240&fit=crop",
    date: "15 février 2026",
    featured: false,
    url: "/pourquoi-biolystes",
  },
];

export default function BiolystesArticlesWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) setHasNew(false);
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleArticleClick = (url: string) => {
    setIsOpen(false);
    navigate(url);
  };

  return (
    <div className="biolystes-widget">
      <style>{`
        .biolystes-widget * {
          box-sizing: border-box;
        }

        .biolystes-fab {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #000;
          color: #f5f4df;
          border: none;
          border-radius: 50px;
          padding: 14px 24px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.01em;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
        }

        .biolystes-fab:hover {
          background: #1a1a1a;
          transform: translateX(-50%) translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.15);
        }

        .biolystes-fab:active {
          transform: translateX(-50%) translateY(0);
        }

        .biolystes-fab svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .biolystes-fab-dot {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 12px;
          height: 12px;
          background: #ef4444;
          border-radius: 50%;
          border: 2.5px solid #000;
          animation: biolystes-pulse 2s infinite;
        }

        @keyframes biolystes-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .biolystes-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(2px);
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.2s ease;
          pointer-events: none;
        }

        .biolystes-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .biolystes-panel {
          position: fixed;
          bottom: 90px;
          left: 50%;
          transform: translateX(-50%) translateY(12px) scale(0.97);
          z-index: 10001;
          width: 420px;
          max-width: calc(100vw - 32px);
          max-height: calc(100vh - 140px);
          background: hsl(57 52% 92% / 0.97);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid #1d1d1f;
          box-shadow: 0 24px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08);
          overflow: hidden;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        .biolystes-panel.open {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
          pointer-events: all;
        }

        .biolystes-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px 14px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .biolystes-panel-title {
          font-size: 15px;
          font-weight: 700;
          color: #000;
          letter-spacing: -0.02em;
        }

        .biolystes-panel-close {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #666;
          transition: all 0.15s;
        }

        .biolystes-panel-close:hover {
          background: rgba(0,0,0,0.06);
          color: #000;
        }

        .biolystes-panel-scroll {
          overflow-y: auto;
          max-height: calc(100vh - 230px);
          padding: 8px;
        }

        .biolystes-panel-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .biolystes-panel-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .biolystes-panel-scroll::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.12);
          border-radius: 4px;
        }

        .biolystes-article {
          padding: 14px;
          border-radius: 16px;
          cursor: pointer;
          transition: background 0.15s;
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .biolystes-article:hover {
          background: rgba(0,0,0,0.04);
        }

        .biolystes-article-featured-img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 14px;
        }

        .biolystes-article-featured-title {
          font-size: 16px;
          font-weight: 700;
          color: #000;
          line-height: 1.35;
          letter-spacing: -0.02em;
        }

        .biolystes-article-featured-desc {
          font-size: 13px;
          color: #555;
          line-height: 1.5;
          margin-top: 8px;
        }

        .biolystes-article-featured-date {
          font-size: 12px;
          color: #888;
          margin-top: 10px;
        }

        .biolystes-article-row {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .biolystes-article-row-content {
          flex: 1;
          min-width: 0;
        }

        .biolystes-article-row-title {
          font-size: 14px;
          font-weight: 700;
          color: #000;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        .biolystes-article-row-desc {
          font-size: 12.5px;
          color: #555;
          line-height: 1.45;
          margin-top: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .biolystes-article-row-img {
          width: 110px;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .biolystes-article-row-date {
          font-size: 11.5px;
          color: #888;
          margin-top: 6px;
        }

        .biolystes-divider {
          height: 1px;
          background: rgba(0,0,0,0.06);
          margin: 4px 14px;
        }

        @media (max-width: 480px) {
          .biolystes-panel {
            width: calc(100vw - 24px);
            bottom: 80px;
            border-radius: 16px;
          }

          .biolystes-fab {
            padding: 12px 20px;
            font-size: 13px;
            bottom: 20px;
          }
        }
      `}</style>

      {/* Overlay */}
      <div
        className={`biolystes-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div className={`biolystes-panel ${isOpen ? "open" : ""}`}>
        <div className="biolystes-panel-header">
          <span className="biolystes-panel-title">Pourquoi Biolystes ?</span>
          <button className="biolystes-panel-close" onClick={() => setIsOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="biolystes-panel-scroll">
          {articles.map((article, index) => (
            <div key={article.id}>
              <div
                className="biolystes-article"
                onClick={() => handleArticleClick(article.url)}
              >
                {article.featured ? (
                  <>
                    <img src={article.image} alt={article.title} className="biolystes-article-featured-img" loading="lazy" />
                    <div className="biolystes-article-featured-title">{article.title}</div>
                    <div className="biolystes-article-featured-desc">{article.description}</div>
                    <div className="biolystes-article-featured-date">{article.date}</div>
                  </>
                ) : (
                  <div className="biolystes-article-row">
                    <div className="biolystes-article-row-content">
                      <div className="biolystes-article-row-title">{article.title}</div>
                      <div className="biolystes-article-row-desc">{article.description}</div>
                      <div className="biolystes-article-row-date">{article.date}</div>
                    </div>
                    <img src={article.image} alt={article.title} className="biolystes-article-row-img" loading="lazy" />
                  </div>
                )}
              </div>
              {index < articles.length - 1 && <div className="biolystes-divider" />}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Button */}
      <button className="biolystes-fab" onClick={() => setIsOpen(!isOpen)} style={{ fontSize: 12 }}>
        {hasNew && <span className="biolystes-fab-dot" />}
        <video
          src="https://storage.googleapis.com/eleven-public-cdn/video/image-and-video-generation/try-lipsync-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: 31, height: 31, borderRadius: 89, marginLeft: -12, objectFit: 'cover', flexShrink: 0, pointerEvents: 'none' }}
        />
        Pourquoi Biolystes ?
      </button>
    </div>
  );
}
