# Traductions de tableau de bord commencées, pas encore servies

Le glob de `src/i18n/dashboard-locale.ts` est `locales/dashboard/*.json`, non
récursif : un fichier posé **ici** n'active pas la langue. C'est le seul but de
ce dossier.

Pourquoi il existe. Déposer `locales/dashboard/<code>.json` suffit à mettre la
langue dans le sélecteur du marchand — c'est écrit noir sur blanc dans
`dashboard-locale.ts`, et c'est voulu. Le piège est qu'aucune vérification ne
regardait le CONTENU du fichier. Le 20/08/2026, `ar.json` couvrait 25 clés sur
861, soit 3 %. Commité au bon endroit, il aurait remis l'arabe dans le
sélecteur et servi un tableau de bord français à 97 % sous une étiquette arabe.

Décision de JP, tranchée le 20/08 : « ne proposez pas une langue tant que le
tableau de bord n'y est pas traduit ».

**Pour activer une langue** : finir la traduction jusqu'à au moins 90 % des clés
de `dashboard/fr.json`, puis remonter le fichier d'un niveau. Le test
`src/test/langues-couvertes-bout-en-bout.test.ts` mesure le taux et refuse en
dessous du seuil, avec le compte exact dans son message.
