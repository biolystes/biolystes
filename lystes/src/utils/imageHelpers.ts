import { toast } from 'sonner';
/**
 * Utilitaires pour la validation des images
 * Utilisé notamment pour filtrer les GIFs dans l'essayage virtuel
 */

/**
 * Vérifie si une URL pointe vers un GIF animé
 */
export function isGifUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  const lowercaseUrl = url.toLowerCase();
  
  // Vérifier l'extension .gif
  if (lowercaseUrl.includes('.gif')) return true;
  
  // Vérifier les paramètres d'URL (certains CDN utilisent ?format=gif)
  if (lowercaseUrl.includes('format=gif')) return true;
  
  // Vérifier les paramètres Shopify/WooCommerce
  if (lowercaseUrl.includes('&f=gif') || lowercaseUrl.includes('?f=gif')) return true;
  
  return false;
}

/**
 * Vérifie si une image est valide pour l'essayage virtuel
 * (formats statiques uniquement : jpg, jpeg, png, webp)
 */
export function isValidTryOnImage(url: string | null | undefined): boolean {
  if (!url) return false;
  
  const lowercaseUrl = url.toLowerCase();
  
  // Exclure les GIFs
  if (isGifUrl(url)) return false;
  
  // Exclure les autres formats non supportés
  const invalidFormats = ['.svg', '.bmp', '.tiff', '.tif', '.ico'];
  if (invalidFormats.some(ext => lowercaseUrl.includes(ext))) return false;
  
  // Accepter les formats statiques courants
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const hasValidExtension = validExtensions.some(ext => lowercaseUrl.includes(ext));
  
  // Si pas d'extension claire (CDN sans extension visible), accepter par défaut
  // car la plupart des CDN servent du JPEG/PNG par défaut
  if (!hasValidExtension) {
    // Vérifier qu'il n'y a pas d'extension problématique
    const hasAnyExtension = /\.[a-z]{3,4}($|\?|&)/i.test(lowercaseUrl);
    if (!hasAnyExtension) return true; // Pas d'extension = probablement OK
  }
  
  return hasValidExtension;
}

/**
 * Extrait l'extension d'une URL d'image
 */
export function getImageExtension(url: string | null | undefined): string | null {
  if (!url) return null;
  
  const match = url.toLowerCase().match(/\.([a-z]{3,4})($|\?|&)/i);
  return match ? match[1] : null;
}

/**
 * Retourne l'image d'origine d'une boutique WordPress lorsque l'URL stockée
 * passe par le relais i0.wp.com. Certains navigateurs mobiles bloquent ce
 * relais dans une iframe alors que le fichier de la boutique reste accessible.
 */
export function getWordPressOriginalImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (!/^i\d+\.wp\.com$/i.test(parsed.hostname)) return null;

    const pathParts = parsed.pathname.split('/').filter(Boolean);
    const originalHost = pathParts.shift();
    if (!originalHost || !originalHost.includes('.')) return null;

    return `https://${originalHost}/${pathParts.join('/')}`;
  } catch {
    return null;
  }
}

/**
 * Convertit un GIF en image statique (première frame) via Canvas
 * Retourne une Promise avec l'URL base64 de l'image JPEG
 */
export function convertGifToStaticImage(gifUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Nécessaire pour les images cross-origin
    
    img.onload = () => {
      try {
        // Créer un canvas avec les dimensions de l'image
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        // Dessiner la première frame sur le canvas
        ctx.drawImage(img, 0, 0);
        
        // Exporter en JPEG (meilleure compression pour les photos)
        const staticImageUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(staticImageUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${gifUrl}`));
    };
    
    img.src = gifUrl;
  });
}

/**
 * Convertit une image en base64 si c'est un GIF, sinon retourne l'URL originale
 * Utile pour préparer les images avant l'essayage virtuel
 */
export async function prepareImageForTryOn(imageUrl: string): Promise<string> {
  if (isGifUrl(imageUrl)) {
    try {
      const staticImage = await convertGifToStaticImage(imageUrl);
      console.log('[imageHelpers] GIF converted to static image');
      return staticImage;
    } catch (error) {
      console.error('[imageHelpers] Failed to convert GIF:', error);
      toast.error("Une erreur est survenue");
      // En cas d'échec, retourner l'URL originale
      return imageUrl;
    }
  }
  return imageUrl;
}

/**
 * Filtre une liste de produits pour ne garder que ceux avec images valides pour l'essayage
 */
export function filterProductsForTryOn<T extends { 
  image_url?: string | null; 
  images?: string[] | null;
  featured_image?: string | null;
}>(products: T[]): T[] {
  return products.filter(product => {
    const imageUrl = product.image_url || product.featured_image || product.images?.[0];
    return isValidTryOnImage(imageUrl);
  });
}

/**
 * Compte les produits par type de validité
 */
export function countProductsByImageValidity<T extends { 
  image_url?: string | null; 
  images?: string[] | null;
  featured_image?: string | null;
}>(products: T[]): { valid: number; invalid: number; gif: number; noImage: number } {
  let valid = 0;
  let invalid = 0;
  let gif = 0;
  let noImage = 0;
  
  for (const product of products) {
    const imageUrl = product.image_url || product.featured_image || product.images?.[0];
    
    if (!imageUrl) {
      noImage++;
    } else if (isGifUrl(imageUrl)) {
      gif++;
    } else if (isValidTryOnImage(imageUrl)) {
      valid++;
    } else {
      invalid++;
    }
  }
  
  return { valid, invalid, gif, noImage };
}
