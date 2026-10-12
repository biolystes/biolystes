/**
 * État vide du répertoire des freelances (30/09/2026).
 *
 * Remplace la liste là où elle s'affichait : fenêtre Cowork « Trouver une
 * agence », /dashboard/agences, /dashboard/experts-marketing. Aucun freelance
 * n'est encore inscrit : on le dit, et on donne la page d'inscription. Les
 * neuf fiches inventées qui occupaient la place sont retirées, voir
 * `src/data/repertoire-freelances.ts`.
 *
 * Dessin maison : fond pierre, rayon 14, aucune bordure, aucune ombre.
 */
import { useTranslation } from 'react-i18next';
import { cn } from '@lystes/lib/utils';
import { LIEN_INSCRIPTION_FREELANCE } from '@lystes/data/repertoire-freelances';

export function AucunFreelanceInscrit({ darkMode = false }: { darkMode?: boolean }) {
  const { t } = useTranslation();

  return (
    <div className={cn('rounded-[14px] px-5 py-6', darkMode ? 'bg-white/[0.06]' : 'bg-[#f3f4f5]')}>
      <p className={cn('text-[12.5px] font-semibold', darkMode ? 'text-white' : 'text-[#000]')}>
        {t('dashboard.annuaires.freelances.aucunInscrit', "Aucun freelance inscrit pour l'instant.")}
      </p>
      <p className={cn('mt-1 text-[11px] leading-[1.5]', darkMode ? 'text-white/60' : 'text-[#777b7f]')}>
        {t('dashboard.annuaires.freelances.aucunInscritDetail', 'Les profils apparaîtront ici au fil des inscriptions.')}
      </p>
      <a
        href={LIEN_INSCRIPTION_FREELANCE}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'mt-3 inline-block text-[11px] font-medium underline underline-offset-4',
          darkMode ? 'text-white' : 'text-[#000]',
        )}
      >
        {t('dashboard.annuaires.freelances.lienInscription', "Page d'inscription des freelances")}
      </a>
    </div>
  );
}
