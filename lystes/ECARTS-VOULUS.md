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
| Au-dessus de l'en-tête | bandeau vert « Démo : ajoutez lystes.ai/… » | gardé depuis le 15/10/2026 (voir plus bas) |
| Bannière | champ « Lien d'une fiche produit / Tester gratuitement » | retiré ; seul « Prendre rendez-vous » reste |
| Galerie des créateurs | panneau « Téléchargez votre image produit » | masqué (`sansGeneration`), comme sur l'accueil |
| Bas de page | « Sans engagement / résiliable à tout moment », « Sans engagement · Configuration guidée » | retirés (arguments d'abonnement) |
| Cartes | « En savoir plus » vers lystes.ai/solutions | gardés (navigation) |
| Cartes équipes (/agents-ia) | essayage virtuel ; portfolio photo multi-secteurs | carte d’essayage retirée ; portfolio limité aux trois photos de produits cosmétiques Cléa, sans onglets mode, lifestyle, studio ni food (16/10/2026) |

## Innovation : page /innovation, section de l'accueil, menu (JP, 14/10/2026)

`/innovation` (`src/pages/InnovationPage.tsx`, cadre des pages du pied de page)
reprend ce que montre lystes.ai/cosmetique, pour Biolystes. Elle vit hors de
`lystes/` ; les composants de lystes.ai qu'elle emploie (`FaceMeshScanner`,
`SafeVideo`, `EnteteSection`, `lib/mediapipe-sur`) sont dans
`RACINES_BIOLYSTES` de `sync.py` : ils restent copiés même si /bio cesse de les
importer.

| Endroit | Sur lystes.ai | Sur biolystes.com |
|---|---|---|
| Accueil, après les blocs des agents IA et des créateurs | rien | section « Toujours plus d'innovation » (`src/components/innovation/AppelInnovation.tsx`) : maillage du visage, trois lieux, « Découvrir nos innovations » vers /innovation (écart 32) |
| Maillage du visage de cette section | — | un AUTRE visage que le carrousel (`src/assets/innovation/visage-accueil.jpg`, profil-03 de `public/demo-lystes/diagnostics`) : aucune photo deux fois sur la page. Son scanner se monte quand celui du carrousel (`#diagnostic-facemesh-slot`) a fini son analyse : deux FaceMesh initialisés en même temps se heurtent dans le module wasm unique de MediaPipe et le second restait sur « Analyse en cours » (14/10/2026) |
| `lystes/tailwind.config.ts`, content | `lystes/src` | + `src/actus` (écart 23) + `src/components/innovation` |
| Menu principal (`MENU_BIOLYSTES`) | — | Agents IA, Innovation, À propos, Questions fréquentes ; le menu du téléphone saute « Agents IA », déjà donné par la bascule |
| Bascule menu d'ordinateur / burger | 1024 px (`lg`) | 1280 px (`xl`) : à 1024 px, quatre entrées faisaient déborder l'en-tête de 40 px (écart 33) |

Retirés de /innovation faute de source : les repères chiffrés de /cosmetique
(×3,1, ×4,1, +72 %, ×6,2, +48 %) et les barres « sans l'IA / avec l'IA »
(3,02 % / 6,76 %, 4 % / 31 %). Aucun prix.

## Bandeau vert « Démo » au-dessus de l'en-tête (JP, 15/10/2026)

JP : « la même top bar » que sur lystes.ai. Le composant est celui de
petal-diagnostics, `src/components/landing/TopBar.tsx`, déjà copié tel quel dans
`lystes/src/components/landing/TopBar.tsx`. Il remplace la décision du
13/10/2026 (bandeau retiré, pistache réservé au pied de page).

| Endroit | Sur lystes.ai | Sur biolystes.com |
|---|---|---|
| `/agents-ia` (HomeVisionPage) | bandeau | bandeau, comme lystes.ai : l'écart 19 de `ecarts_voulus.py` est levé |
| Accueil `/` (BioPage) | /bio : pas de bandeau | bandeau, `<Header overlay topBar={<TopBar />} />` (écart 19 bis) |

| Bandeau au téléphone | `px-2` (8 px du bord), « produit. » seul en 2e ligne à 375 px | `px-4` (16 px) et `[text-wrap:balance]` (écart 19 ter) |

Le bouton « Copier » copie `lystes.ai/`, comme sur lystes.ai.
