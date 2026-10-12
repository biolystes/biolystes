import { useState } from "react";
import { ChevronDown, Leaf, Shirt } from "lucide-react";
import { EntryRow, useMenuText, type MenuEntry } from "./SolutionsDropdown";

/**
 * Le menu « Lab » de l'en-tête (12/10/2026, JP) : la partie recherche de
 * Lystes, où l'IA fait le travail d'une marque, dans le bio et dans le
 * vêtement. Deux liens, même style que « Équipes IA ▾ » (SolutionsDropdown :
 * même bouton, même panneau, mêmes lignes EntryRow). Le menu du téléphone
 * (Header.tsx) lit la même liste, à plat sous un titre « Lab ».
 */
export const LAB_ENTREES: MenuEntry[] = [
  {
    id: "lab-bio",
    title: "Lancer sa marque bio, full IA",
    tagline: "Soins bio et véganes à votre nom, sans stock.",
    href: "/bio",
    Icon: Leaf,
  },
  {
    id: "lab-crea",
    title: "Lancer sa marque de vêtements, full IA",
    tagline: "Boutique, feed Instagram et équipes IA pour la mode.",
    href: "/crea",
    Icon: Shirt,
  },
];

export function LabDropdown({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const tr = useMenuText();

  return (
    <div
      className="group relative z-[9999999]"
      style={{ fontFamily: "'Jost', sans-serif" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        className={`inline-flex items-center rounded-full px-3 xl:px-4 h-9 text-sm font-medium whitespace-nowrap transition-colors ${
          overlay
            ? "text-white/85 hover:bg-white/10 hover:text-white"
            : "text-foreground/70 hover:bg-stone-100 hover:text-foreground"
        }`}
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {tr("Lab")}
        <ChevronDown className="ml-1 h-4 w-4 opacity-60" />
      </button>

      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full z-[9999999] pt-2 ${open ? "block" : "hidden"} group-hover:block group-focus-within:block`}
      >
        <div
          role="menu"
          className={`w-[360px] p-3 rounded-2xl ${
            overlay
              ? "border border-white/10 bg-[#1a1817]/95 backdrop-blur-xl shadow-none"
              : "border border-[#e5e5e7] bg-white shadow-lg"
          }`}
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          <ul className="flex flex-col">
            {LAB_ENTREES.map((e) => (
              <li key={e.id}>
                <EntryRow entry={e} onClick={close} overlay={overlay} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
