/**
 * Les trois annuaires du Cowork : agences (freelances), magazines, créateurs
 * UGC (JP, 02/09/2026). Tous les trois s'ouvrent en pop-up et partagent le
 * même panneau compact `PanneauRepertoire` : une recherche, des menus
 * déroulants de filtre, puis des lignes « profil » (avatar rond, nom, bio,
 * stats) — pas de wizard, pas de pastilles.
 *
 * Un clic sur un profil envoie le brief correspondant dans le chat.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@lystes/integrations/supabase/client';
import { PanneauRepertoire, type LigneRepertoire, type Categorie } from '@lystes/components/cowork/PanneauRepertoire';
import { FREELANCES, CATEGORIES_FREELANCES } from '@lystes/data/repertoire-freelances';
import { AucunFreelanceInscrit } from '@lystes/components/cowork/AucunFreelanceInscrit';
import { MAGAZINES, THEMATIQUES_MAGAZINES } from '@lystes/data/magazines-presse';
import { FicheMagazine } from '@lystes/components/cowork/FicheMagazine';

import logoVogue from '@lystes/assets/logo-vogue-france.png.asset.json';
import logoPublic from '@lystes/assets/logo-public.png.asset.json';
import logoChallenges from '@lystes/assets/logo-challenges.png.asset.json';
import logoForbes from '@lystes/assets/logo-forbes.png.asset.json';
import logoGq from '@lystes/assets/logo-gq.jpeg.asset.json';
import logoLesEchos from '@lystes/assets/logo-les-echos-solutions.jpeg.asset.json';

/** Logos éditoriaux fournis par JP, prioritaires sur les favicons. */
const LOGOS_MAGAZINES: Record<string, string> = {
  'vogue.fr': logoVogue.url,
  'public.fr': logoPublic.url,
  'challenges.fr': logoChallenges.url,
  'forbes.fr': logoForbes.url,
  'gqmagazine.fr': logoGq.url,
  'solutions.lesechos.fr': logoLesEchos.url,
};

const euros = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

const nombre = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

interface PanneauProps {
  darkMode: boolean;
  onSendMessage?: (text: string) => void;
  /** Pages plein écran : filtres dans une colonne latérale (JP, 04/09/2026). */
  filtresDansSidebar?: boolean;
}

/* ------------------------------------------------------------------ Agences */

export function PanneauAgences({ darkMode, filtresDansSidebar }: PanneauProps) {
  // Clic sur la carte : ouvre la fiche détaillée du freelance (JP, 04/09/2026).
  const navigate = useNavigate();

  /* 30/09/2026 : les neuf fiches inventées sont retirées, aucun freelance
     n'est encore inscrit. L'ancien « Prendre rendez-vous » créait un
     rendez-vous dans l'agenda de la marchande elle-même sans prévenir
     personne : il est parti avec les fiches. */
  if (FREELANCES.length === 0) {
    return <AucunFreelanceInscrit darkMode={darkMode} />;
  }

  const lignes: LigneRepertoire[] = FREELANCES.map((f) => ({
    id: f.email,
    cats: [f.cat],
    titre: f.nom,
    sousTitre: `${f.titre} | ${f.studio}`,
    image: f.photo ?? null,
    initiales: f.initiales,
    prix: f.jour,
    tags: f.tags,
    bio: f.bio,
    lieu: f.ville,
    lien: f.site,
    chiffres: [
      { label: 'Note', valeur: f.note.toFixed(1) },
      { label: 'Avis', valeur: String(f.avis) },
      { label: 'TJM', valeur: euros(f.jour) },
    ],
    onOpen: () => navigate(`/dashboard/agences/${encodeURIComponent(f.email)}`),
  }));

  return (
    <PanneauRepertoire
      darkMode={darkMode}
      filtresDansSidebar={filtresDansSidebar}
      lignes={lignes}
      categories={CATEGORIES_FREELANCES}
      placeholder="Rechercher des freelances…"
      paliersBudget={[
        { libelle: 'Tous les prix', max: null },
        { libelle: 'Moins de 400 € / jour', max: 400 },
        { libelle: 'Moins de 500 € / jour', max: 500 },
      ]}
    />
  );
}

/* --------------------------------------------------------------- Magazines */

export function PanneauMagazines({ darkMode, filtresDansSidebar }: PanneauProps) {
  const [fiche, setFiche] = useState<(typeof MAGAZINES)[number] | null>(null);
  const categories: Categorie[] = THEMATIQUES_MAGAZINES.map((t) => ({ id: t, mot: t }));

  const logoDe = (editeur: string) =>
    LOGOS_MAGAZINES[editeur] ?? `https://www.google.com/s2/favicons?domain=${editeur}&sz=128`;

  if (fiche) {
    return (
      <FicheMagazine
        darkMode={darkMode}
        magazine={fiche}
        logo={logoDe(fiche.editeur)}
        onRetour={() => setFiche(null)}
      />
    );
  }

  const lignes: LigneRepertoire[] = MAGAZINES.map((m) => ({
    id: m.editeur,
    cats: m.thematiques,
    titre: m.editeur,
    sousTitre:
      m.thematiques.length > 0 ? m.thematiques.join(' · ') : 'Thématiques non renseignées',
    image: logoDe(m.editeur),
    prix: m.prix,
    prixLibelle: euros(m.prix),
    lien: m.editeur,
    chiffres: [
      { label: 'TF', valeur: String(m.tf) },
      { label: 'DR', valeur: String(m.dr) },
      { label: 'vis/mois', valeur: nombre(m.visites) },
    ],
    actionLibelle: 'En savoir plus',
    onAction: () => setFiche(m),
  }));


  return (
    <PanneauRepertoire
      darkMode={darkMode}
      filtresDansSidebar={filtresDansSidebar}
      lignes={lignes}
      categories={categories}
      placeholder="Rechercher un magazine…"
      paliersBudget={[
        { libelle: 'Tous les prix', max: null },
        { libelle: 'Moins de 2 000 €', max: 2000 },
        { libelle: 'Moins de 5 000 €', max: 5000 },
      ]}
    />
  );
}

/* --------------------------------------------------------------------- UGC */

type CreateurUgc = {
  id: string;
  name: string;
  avatar_url: string;
  specialty: string | null;
  bio: string | null;
  sectors_covered: string[] | null;
  total_posts: number | null;
  total_brands: number | null;
  galerie: string[];
};

export function PanneauUgc({ darkMode, onSendMessage }: PanneauProps) {
  const [createurs, setCreateurs] = useState<CreateurUgc[] | null>(null);

  useEffect(() => {
    let vivant = true;
    Promise.all([
      supabase
        .from('ugc_creator_profiles')
        .select('id, name, avatar_url, specialty, bio, sectors_covered, total_posts, total_brands')
        .eq('is_active', true)
        .order('total_posts', { ascending: false })
        .limit(60),
      supabase
        .from('ugc_public_posts')
        .select('creator_profile_id, images')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(360),
    ]).then(([profils, publications]) => {
        if (!vivant) return;
        if (profils.error) {
          console.error('Créateurs UGC : lecture impossible', profils.error);
          setCreateurs([]);
          return;
        }
        if (publications.error) console.error('Portfolios UGC : lecture impossible', publications.error);
        const imagesParCreateur = new Map<string, string[]>();
        for (const publication of publications.data ?? []) {
          const actuelles = imagesParCreateur.get(publication.creator_profile_id) ?? [];
          imagesParCreateur.set(publication.creator_profile_id, [...actuelles, ...(publication.images ?? [])].slice(0, 6));
        }
        setCreateurs((profils.data ?? []).map((profil) => ({
          ...profil,
          galerie: imagesParCreateur.get(profil.id) ?? [],
        })) as CreateurUgc[]);
      });
    return () => {
      vivant = false;
    };
  }, []);

  if (createurs === null) {
    return (
      <p className={darkMode ? 'py-6 text-center text-xs text-white/50' : 'py-6 text-center text-xs text-[#6E6E73]'}>
        Lecture des créateurs…
      </p>
    );
  }

  const secteurs: Categorie[] = Array.from(
    new Set(createurs.flatMap((c) => c.sectors_covered ?? [])),
  )
    .sort((a, b) => a.localeCompare(b, 'fr'))
    .map((s) => ({ id: s, mot: s }));

  const lignes: LigneRepertoire[] = createurs.map((c) => ({
    id: c.id,
    cats: c.sectors_covered ?? [],
    titre: c.name,
    sousTitre: c.specialty ?? 'Créateur UGC',
    image: c.avatar_url,
    /* Les contenus réels du créateur remplacent la description. */
    galerie: c.galerie,
    bio: c.galerie.length ? null : c.bio,
    chiffres: [
      { label: 'contenus', valeur: c.total_posts !== null ? nombre(c.total_posts) : 'Non mesuré' },
      { label: 'marques', valeur: c.total_brands !== null ? nombre(c.total_brands) : 'Non mesuré' },
    ],
    actionLibelle: 'Message',
    onAction: () =>
      onSendMessage?.(
        `Je veux une série de contenus UGC avec ${c.name}. Propose-moi trois scénarios adaptés à mes produits et le brief de tournage.`,
      ),
  }));

  return (
    <PanneauRepertoire
      darkMode={darkMode}
      lignes={lignes}
      categories={secteurs}
      placeholder="Rechercher un créateur UGC…"
      videMessage="Aucun créateur UGC référencé pour l'instant."
    />
  );
}
