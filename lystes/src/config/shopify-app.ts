/**
 * L'APPLICATION SHOPIFY LYSTES, VUE DU FRONT : SON IDENTIFIANT ET SES LIENS
 * PROFONDS VERS L'ÉDITEUR DE THÈME.
 *
 * Une seule source. `src/config/urls.ts` les ré-exporte sous leurs anciens
 * noms (lienActivationAgentShopify, lienBlocLotsShopify), pour les guides qui
 * les utilisent déjà.
 *
 * L'extension de thème vit dans `shopify-app-config/extensions/lystes-agent` :
 *   - `blocks/agent.liquid`, un APP EMBED (cible `body`) ;
 *   - `blocks/lots.liquid`, un APP BLOCK de fiche produit.
 * Depuis le 27/09/2026 (audit, lot 4), ni l'un ni l'autre n'a de champ à
 * remplir : ils lisent l'identifiant du compte dans le metafield app-data
 * `lystes.account_id`, que Lystes écrit après l'autorisation
 * (supabase/functions/_shared/shopify-mise-en-place.ts). Un clic sur le lien
 * suffit : l'interrupteur est déjà basculé, le bloc déjà posé. C'est ce que
 * demande l'exigence 5.1.3 de l'App Store (liens profonds vers l'éditeur).
 *
 * Format des liens (shopify.dev, theme-app-extensions/configuration) :
 *   app embed  : /admin/themes/current/editor?context=apps&activateAppId={api_key}/{handle}
 *   app block  : /admin/themes/current/editor?template=product&addAppBlockId={api_key}/{handle}&target=mainSection
 * `{handle}` est le nom du fichier Liquid du bloc, sans extension.
 */

/** Le `client_id` de l'application publique Lystes (shopify-app-config/shopify.app.toml). */
export const SHOPIFY_CLIENT_ID = "7ab0b3c9524db02f78c7da4e522691e3";

/** `blocks/agent.liquid` : l'app embed de l'agent. */
export const BLOC_AGENT = "agent";
/** `blocks/lots.liquid` : l'app block des lots, sur la fiche produit. */
export const BLOC_LOTS = "lots";
/** `blocks/chat-fiche.liquid` : le chat dans la fiche produit, sous le bouton panier (Olvio, 11/10/2026). */
export const BLOC_CHAT_FICHE = "chat-fiche";

const REGEX_MYSHOPIFY = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;

/** Le domaine `.myshopify.com` tel quel, ou une chaîne vide s'il n'en est pas un. */
function domaineValide(shop: string | null | undefined): string {
  const d = String(shop ?? "").trim().toLowerCase();
  return REGEX_MYSHOPIFY.test(d) ? d : "";
}

/** Ouvre l'éditeur de thème avec l'agent Lystes déjà activé. Vide sans domaine `.myshopify.com`. */
export function lienActivationAgent(shop: string | null | undefined): string {
  const boutique = domaineValide(shop);
  if (!boutique) return "";
  return `https://${boutique}/admin/themes/current/editor?context=apps&activateAppId=${SHOPIFY_CLIENT_ID}/${BLOC_AGENT}`;
}

/** Ouvre le modèle de fiche produit avec le bloc des lots déjà ajouté. Vide sans domaine `.myshopify.com`. */
export function lienAjoutLots(shop: string | null | undefined): string {
  const boutique = domaineValide(shop);
  if (!boutique) return "";
  return `https://${boutique}/admin/themes/current/editor?template=product&addAppBlockId=${SHOPIFY_CLIENT_ID}/${BLOC_LOTS}&target=mainSection`;
}

/** Ouvre le modèle de fiche produit avec le bloc « Chat de la fiche » déjà ajouté. Vide sans domaine `.myshopify.com`. */
export function lienAjoutChatFiche(shop: string | null | undefined): string {
  const boutique = domaineValide(shop);
  if (!boutique) return "";
  return `https://${boutique}/admin/themes/current/editor?template=product&addAppBlockId=${SHOPIFY_CLIENT_ID}/${BLOC_CHAT_FICHE}&target=mainSection`;
}
