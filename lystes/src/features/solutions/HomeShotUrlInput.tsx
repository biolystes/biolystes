import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function HomeShotUrlInput() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const raw = url.trim();
    if (!raw) return;
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    setSubmitting(true);
    navigate(`/shot?url=${encodeURIComponent(withProto)}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-6 mb-2 w-full max-w-[560px] px-3"
      style={{ opacity: 1, transform: "none" }}
    >
      <div className="flex flex-col sm:flex-row items-stretch gap-2 rounded-full sm:pl-5 sm:pr-1.5 sm:py-1.5 sm:bg-white sm:border sm:border-[#e5e5e7]">
        <input
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="Colle l'URL d'un de tes produits"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 min-w-0 bg-white sm:bg-transparent border-[#e5e5e7] sm:border-0 rounded-full sm:rounded-none px-5 py-3 sm:py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          style={{ fontFamily: "Jost, sans-serif" }}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 pl-[22px] pr-1.5 py-2.5 rounded-full bg-black text-white text-[13px] font-medium leading-none hover:opacity-90 transition-all disabled:opacity-60"
        >
          <span className="whitespace-nowrap">Tester la génération d'image produit&nbsp;</span>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-black shrink-0">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-neutral-500" style={{ fontFamily: "Jost, sans-serif" }}>
        Teste sur <strong className="text-neutral-700">tes</strong> produits — Lystes n'est pas affilié aux marques tierces scannées.
      </p>
    </form>
  );
}

