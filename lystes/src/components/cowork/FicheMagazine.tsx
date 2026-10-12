/**
 * Fiche détaillée d'un magazine du catalogue presse (JP, 02/09/2026).
 *
 * Ouverte par « En savoir plus » depuis l'annuaire. Elle n'affiche que des
 * valeurs présentes dans l'export éditeurs : aucun chiffre n'est estimé, un
 * champ absent se lit « Non renseigné ». Le bouton « Ajouter au panier »
 * ouvre le paiement Stripe de l'article.
 */
import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@lystes/integrations/supabase/client';
import type { Magazine } from '@lystes/data/magazines-presse';

const euros = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const nombre = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

interface Props {
  darkMode: boolean;
  magazine: Magazine;
  logo: string;
  onRetour: () => void;
}

export function FicheMagazine({ darkMode, magazine, logo, onRetour }: Props) {
  const [encours, setEncours] = useState(false);
  // Avant le panier : le marchand dit quel article il veut réellement
  // (JP, 02/09/2026). La consigne part dans le paiement Stripe.
  const [article, setArticle] = useState('');

  const payer = async () => {
    setEncours(true);
    try {
      const { data, error } = await supabase.functions.invoke('magazine-article-checkout', {
        body: { editeur: magazine.editeur, consigne: article.trim() },
      });
      if (error) throw error;
      if (!data?.url) throw new Error("Le lien de paiement n'a pas été créé");
      window.open(data.url, '_blank');
    } catch (e) {
      toast.error((e as Error).message || 'Paiement indisponible pour le moment');
    } finally {
      setEncours(false);
    }
  };

  const texteFaible = darkMode ? 'text-white/50' : 'text-[#8E8E93]';
  const texteFort = darkMode ? 'text-white' : 'text-[#1D1D1F]';
  const fond = darkMode ? 'bg-white/[0.04]' : 'bg-[#f3f4f5]';

  const performances: Array<{ label: string; valeur: string }> = [
    { label: 'Trust Flow (TF)', valeur: String(magazine.tf) },
    { label: 'Domain Rating (DR)', valeur: String(magazine.dr) },
    { label: 'Domaines référents (RD)', valeur: nombre(magazine.rd) },
    { label: 'Visites mensuelles', valeur: nombre(magazine.visites) },
  ];

  return (
    <div className="min-h-0 flex-1 overflow-y-auto pr-1 annuaire-repertoire">
      <button
        onClick={onRetour}
        className={`mb-3 inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] ${texteFaible}`}
      >
        <ArrowLeft className="h-3 w-3" /> Retour aux magazines
      </button>

      {/* En-tête : logo, nom, lien */}
      <div className={`rounded-2xl ${fond} p-4`}>
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt={`Logo ${magazine.editeur}`}
            className="h-12 w-12 rounded-full object-contain bg-white"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className={`truncate text-[13px] font-medium ${texteFort}`}>{magazine.editeur}</p>
            <a
              href={`https://${magazine.editeur}`}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1 text-[9px] ${texteFaible}`}
            >
              https://{magazine.editeur} <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>

        <p className={`mt-3 text-[9px] leading-[15px] ${texteFaible}`}>
          {magazine.thematiques.length > 0
            ? magazine.thematiques.join(' · ')
            : 'Thématiques non renseignées'}
        </p>
      </div>

      {/* Tarif */}
      <div className="mt-3 rounded-2xl bg-[#e1f3c5] p-4">
        <p className="text-[7px] uppercase tracking-[0.16em] text-[#3d4a2a]">Tarif</p>
        <p className="mt-1 text-[22px] font-medium text-[#1D1D1F]">{euros(magazine.prix)}</p>
        <p className="text-[9px] text-[#3d4a2a]">Pour un article de 300 mots, publié avec un lien vers votre boutique.</p>
      </div>

      {/* Performances */}
      <div className={`mt-3 rounded-2xl ${fond} p-4`}>
        <p className={`text-[7px] uppercase tracking-[0.16em] ${texteFaible}`}>Performances</p>
        <div className="mt-2">
          {performances.map((p) => (
            <div key={p.label} className="flex items-center justify-between py-1.5">
              <span className={`text-[9px] ${texteFaible}`}>{p.label}</span>
              <span className={`text-[11px] font-medium ${texteFort}`}>{p.valeur}</span>
            </div>
          ))}
        </div>
        <p className={`mt-2 text-[8px] ${texteFaible}`}>
          Source : export du catalogue éditeurs. Trafic, backlinks et mots-clés détaillés sont
          confirmés par la rédaction à la commande.
        </p>
      </div>

      {/* Étapes après le paiement */}
      <div className={`mt-3 rounded-2xl ${fond} p-4`}>
        <p className={`text-[7px] uppercase tracking-[0.16em] ${texteFaible}`}>Ce qui se passe ensuite</p>
        <ol className={`mt-2 space-y-1.5 text-[9px] leading-[15px] ${texteFaible}`}>
          <li>1. Vous ajoutez l'article au panier et réglez par carte.</li>
          <li>2. Nous rédigeons un angle éditorial à partir de votre catalogue et de vos conversations.</li>
          <li>3. Vous relisez et validez le texte avant tout envoi à la rédaction.</li>
          <li>4. La rédaction publie l'article et nous vous transmettons l'URL en ligne.</li>
        </ol>
      </div>

      {/* Ce que le marchand veut comme article, avant d'ajouter au panier */}
      <div className={`mt-3 rounded-2xl ${fond} p-4`}>
        <p className={`text-[7px] uppercase tracking-[0.16em] ${texteFaible}`}>Votre article</p>
        <textarea
          value={article}
          onChange={(ev) => setArticle(ev.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Ex. : un portrait de notre marque et de notre best-seller, ton éditorial, avec un lien vers la boutique…"
          className={`mt-2 w-full resize-none rounded-xl bg-white/80 p-3 text-[10px] leading-[15px] outline-none placeholder:text-[#8E8E93]/70 ${texteFort}`}
        />
        <p className={`mt-1 text-[8px] ${texteFaible}`}>
          Cette demande est transmise avec votre commande : la rédaction part de votre idée.
        </p>
      </div>

      <button
        onClick={payer}
        disabled={encours || !article.trim()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#1D1D1F] py-3 text-[12px] font-medium text-white disabled:opacity-60"
      >
        {encours && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Ajouter au panier — {euros(magazine.prix)}
      </button>
    </div>
  );
}
