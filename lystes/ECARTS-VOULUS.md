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
| En-tête, bascule à côté du logo | Ecommerce / Entreprises (/business) | E-commerce (/) / Agents IA : voir plus bas, /agents-ia depuis le 13/10/2026 |
| En-tête ordinateur | Connexion + S'inscrire en 5 min | Prendre rendez-vous |
| En-tête téléphone | S'inscrire | Rendez-vous |
| Menu du téléphone | S'inscrire en 5 min + Connexion | Prendre rendez-vous |
| 18 ans d'expérience | Voir notre dernier projet + Demander l'accès à nos produits | Prendre rendez-vous |
| Passez à l'action | Prendre rendez-vous avec un expert | Prendre rendez-vous |
| Bento, carte « Vendez davantage » | S'inscrire en 5 min | Prendre rendez-vous |
| Bento, carte « Vos équipes IA s'améliorent » | Découvrez vos équipes | Prendre rendez-vous |
| Bento, carte photo de Cléa | « Ça vous dit de passer un coup de fil à Cléa ? » + Appeler Cléa | photo seule |

Gardés tels quels : liens de navigation (menus, pied de page), champ de projet
de la bannière (« Décrivez votre projet… », ouvre l'orbital du widget), champ newsletter du pied de page.

## Aucun prix en ligne (JP, 12/10/2026, PR biolystes 3)

Les traductions recopiées (`lystes/src/i18n/locales/<langue>.json`) embarquent
des prix d'offres dans le JS de biolystes.com, même non affichés. `sans_prix.py`
les retire dans les 14 langues, seulement dans la copie biolystes, et `sync.py`
le relance après `ecarts_voulus.py`. Il s'arrête en nommant la clé si lystes.ai
la déplace.

| Clé | Sur /bio (fr) | Sur biolystes.com |
|---|---|---|
| `landing.pricing.*.price`, `.period` | 99 €, 290 € + 49 €/mois, 499 €, 799 € | vide |
| `landing.pricing.*.features` | « Setup from €290, then €49/month » | ligne retirée |
| `landingNew.faq.questions[].answer` | « … à partir de 49,99 € HT/mois … » | phrase chiffrée retirée |
| `productAgentPage.s133` | Pack Duo à 999 € | Pack Duo |
| `productAgentPage.s135` à `s138` | 11 001 € (‑92 %) et 301 €/mois de charges récurrentes évitées | ‑92 % |

Fiche de démonstration de l'onglet E-commerce (`public/demo-eclose/eclose.js`, en iframe) :
la ligne « 45 € » est retirée sur biolystes.com par `ecarts_voulus.py` (JP, 13/10/2026) ;
lystes.ai garde sa fiche telle quelle.

Laissés : prix de démonstration (produits fictifs, CA des maquettes), capital
social des mentions légales, seuils du programme d'affiliation.

## En-tête sans menus (JP, 13/10/2026, PR biolystes 10)

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

## Bascule dans le site et page /agents-ia (JP, 13/10/2026, PR biolystes 11)

`/agents-ia` reprend l'accueil de lystes.ai (`HomeVisionPage`, ajoutée aux racines
de `sync.py`). Elle partage avec `/` une coquille commune (route parente,
`src/pages/CoquilleLystes.tsx`) : la bascule passe de l'une à l'autre sans
rechargement.

| Endroit | Sur lystes.ai | Sur biolystes.com |
|---|---|---|
| Bascule de l'en-tête | Ecommerce (/) / Entreprises (/business) | E-commerce (/) / Agents IA (/agents-ia), en `Link`, `replace={false}`, pastille lue sur la vraie adresse |
| Menu du téléphone | — | E-commerce (/) / Agents IA (/agents-ia), en `Link` |
| Bannière de /agents-ia | S'inscrire en 5 min | Prendre rendez-vous (« Rendez-vous » sous 721 px, sinon le libellé passe sur deux lignes) |
| Bannière de /agents-ia | Installer sur Shopify, WooCommerce, en point de vente, au domicile, lors de vos événements | rangée retirée |
| Photo de Cléa (/agents-ia) | Appeler Cléa | retiré |
| Bas de page de /agents-ia | S'inscrire en 5 min + Parler au fondateur | Prendre rendez-vous |
| Bas de page de /agents-ia | « N jours d'essai gratuits, carte demandée… » | retiré |
| Démos (bannière de /agents-ia, chat animé) | 35,00 €, 34,00 €, 29,00 € | sans prix |

### Décisions du 13/10/2026 sur /agents-ia (règles de JP)

| Endroit | Sur lystes.ai | Sur biolystes.com |
|---|---|---|
| Au-dessus de l'en-tête | bandeau vert « Démo : ajoutez lystes.ai/… » | retiré (pistache réservé au pied de page) |
| Bannière | champ « Lien d'une fiche produit / Tester gratuitement » | retiré ; seul « Prendre rendez-vous » reste |
| Galerie des créateurs | panneau « Téléchargez votre image produit » | masqué (`sansGeneration`), comme sur l'accueil |
| Bas de page | « Sans engagement / résiliable à tout moment », « Sans engagement · Configuration guidée » | retirés (arguments d'abonnement) |
| Cartes | « En savoir plus » vers lystes.ai/solutions | gardés (navigation) |

## Thème des pages Actus (JP, 13/10/2026, PR biolystes 14)

`sync.py` recopie `tailwind.config.ts` de lystes.ai dans `lystes/tailwind.config.ts`
avec le seul `content` `./lystes/src/**`. Les pages Actus (`src/actus`) s'affichent
sous `.lystes-racine` : sans elles dans ce `content`, leurs classes ne sortent pas
de ce thème et ne s'appliquent pas. Écart 23 de `ecarts_voulus.py`.

| Endroit | Copie brute de sync.py | Sur biolystes.com |
|---|---|---|
| `content` de `lystes/tailwind.config.ts` | `["./lystes/src/**/*.{ts,tsx,html}"]` | `["./lystes/src/**/*.{ts,tsx,html}", "./src/actus/**/*.{ts,tsx}"]` |
| Commentaire de tête | « Ne sert qu'aux fichiers de lystes/ » | mentionne aussi les pages Actus et le défaut de /blog qu'il évite |

## Bouton « S'inscrire » vers l'espace client (JP, 13/10/2026)

« S'inscrire » mène à l'inscription de l'espace client Biolystes,
https://lystes.ai/biolystes/inscription (petal PR 397), ouverte dans un nouvel
onglet comme le rendez-vous. Bouton secondaire à contour ; « Prendre
rendez-vous » reste le bouton principal. Écart 25 de `ecarts_voulus.py`, passé
après les écarts 2, 3 et 4 dont il reprend le texte d'arrivée. Visiteuse
connectée : rien ne change, elle voit son avatar.

| Endroit | Sur /bio | Sur biolystes.com |
|---|---|---|
| En-tête ordinateur | Connexion + S'inscrire en 5 min | S'inscrire (contour) + Prendre rendez-vous |
| En-tête téléphone | S'inscrire | S'inscrire (contour, à partir de 360 px) + Rendez-vous |
| Menu du téléphone | S'inscrire en 5 min + Connexion | Prendre rendez-vous + S'inscrire (contour, l'ancienne place de « Connexion ») |

Gardé tel quel : le champ de projet de la bannière, qui ouvre l'orbital.

`ecarts_voulus.py` vise `~/.worktrees/biolystes-bio` par défaut ; un autre
worktree se passe dans `BIOLYSTES_CIB` :
`BIOLYSTES_CIB=~/.worktrees/<nom> python3 ecarts_voulus.py`.
