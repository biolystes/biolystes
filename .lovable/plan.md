
## Amélioration du bouton "Prendre rendez-vous" dans le chat

### Problème actuel
Le bouton "Prendre rendez-vous" s'affiche après **chaque message** de l'IA, ce qui est redondant et peu élégant.

### Solution proposée
Afficher le bouton "Prendre rendez-vous" **une seule fois**, uniquement sous le **dernier message** de l'IA, et seulement quand l'IA a terminé de répondre (pas pendant le streaming). Cela donne une expérience propre et contextuelle.

### Changement technique

**Fichier : `src/components/AIChat.tsx`**

- Identifier le dernier message `assistant` dans la liste
- N'afficher le bouton RDV que sous ce dernier message assistant, et uniquement si `typing === false` (la réponse est terminée)
- Supprimer le bouton des autres messages précédents

```text
Avant : bouton RDV après CHAQUE réponse IA
Après : bouton RDV uniquement sous la DERNIÈRE réponse IA (quand la frappe est terminée)
```

C'est un changement minimal dans `AIChat.tsx` — identifier `isLastAssistant` pour chaque message et conditionner l'affichage du bouton.
