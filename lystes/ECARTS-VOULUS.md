# Écarts voulus entre biolystes.com (accueil) et lystes.ai/bio

L'accueil de biolystes.com est une copie de /bio (petal-diagnostics),
réalignée par `sync.py <commit>`. Les écarts ci-dessous sont VOULUS par JP.
`sync.py` les réapplique à la fin de chaque alignement en lançant
`ecarts_voulus.py`. Si /bio change à l'un de ces endroits, le script s'arrête
et nomme l'écart à revoir : il n'écrase jamais en silence.

## Adaptations de départ (PR biolystes 2, appliquées par sync.py)

- Liens internes de lystes.ai → adresses absolues lystes.ai (`lien-lystes.tsx`),
  sauf `/` et `/bio` (vers `/`), et les pages légales (vers celles de biolystes.com).
- Base Supabase de lystes.ai figée (`env.ts`), `/__l5e/` servi depuis lystes.ai,
  galerie des créateurs en cadre `lystes.ai/creator`.

## Un seul appel à l'action : « Prendre rendez-vous » (JP, 12/10/2026, PR biolystes 4)

Toutes ces cibles sont https://biolystes.pro/rdv, ouvert dans un nouvel onglet
comme les autres boutons de rendez-vous de la page.

| Endroit | Sur /bio | Sur biolystes.com |
|---|---|---|
| En-tête, bascule à côté du logo | Ecommerce / Entreprises (/business) | E-commerce (/) / Agents IA (https://lystes.ai, même onglet) |
| En-tête ordinateur | Connexion + S'inscrire en 5 min | Prendre rendez-vous |
| En-tête téléphone | S'inscrire | Rendez-vous |
| Menu du téléphone | S'inscrire en 5 min + Connexion | Prendre rendez-vous |
| 18 ans d'expérience | Voir notre dernier projet + Demander l'accès à nos produits | Prendre rendez-vous |
| Passez à l'action | Prendre rendez-vous avec un expert | Prendre rendez-vous |
| Bento, carte « Vendez davantage » | S'inscrire en 5 min | Prendre rendez-vous |
| Bento, carte « Vos équipes IA s'améliorent » | Découvrez vos équipes | Prendre rendez-vous |
| Bento, carte photo de Cléa | « Ça vous dit de passer un coup de fil à Cléa ? » + Appeler Cléa | photo seule |

Gardés tels quels : liens de navigation (menus, pied de page), champ « Trouver
des produits » de la bannière (recherche), champ newsletter du pied de page.

## En-tête sans menus (JP, 13/10/2026, PR biolystes « entete/sans-menus »)

| Endroit | Sur /bio | Sur biolystes.com |
|---|---|---|
| En-tête ordinateur | Entreprise, Équipes IA ▾, Lab ▾, Tarifs, langue | rien entre la bascule et « Prendre rendez-vous » |
| Menu du téléphone | Entreprise, Équipes IA, Lab, Tarifs | E-commerce (/), Agents IA (https://lystes.ai), puis « Prendre rendez-vous » |

**Langue cachée, pas supprimée.** Le sélecteur (drapeau et globe) et son code
restent. Une constante le masque en ordinateur et dans le menu du téléphone :

```ts
// lystes/src/components/landing/Header.tsx
const AFFICHER_LANGUE = false;   // true pour le rallumer
```

`ecarts_voulus.py` pose cette constante à `false` : pour rallumer la langue
durablement, changer aussi la valeur dans `ecarts_voulus.py`, sinon le
prochain alignement sur /bio la remettra à `false`.
