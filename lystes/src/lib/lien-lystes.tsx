/* Liens des composants repris de lystes.ai, sur biolystes.com.

   Sur lystes.ai, `<Link to="/tarifs">` mène à une page de lystes.ai. Recopié
   tel quel sur biolystes.com, il mènerait à une page qui n’existe pas ici.
   Ce module remplace le `Link` de react-router-dom pour tout le dossier
   lystes/ : une adresse interne devient l’adresse absolue sur lystes.ai,
   sauf les quelques pages qui ont leur équivalent sur biolystes.com
   (l’accueil et les pages légales, que tout site doit porter lui-même). */
import { forwardRef, type AnchorHTMLAttributes } from "react";
import { Link as LienRouteur, NavLink as LienNavRouteur, type LinkProps, type NavLinkProps } from "react-router-dom";

export const SITE_LYSTES = "https://lystes.ai";

/* Adresse sur lystes.ai → adresse équivalente sur biolystes.com. */
const SUR_BIOLYSTES: Record<string, string> = {
  "/": "/",
  "/legal": "/mentions-legales",
  "/privacy": "/politique-confidentialite",
  "/terms": "/cgv",
};

/** Adresse finale d’un lien interne de lystes.ai : chemin local sur
 *  biolystes.com s’il existe, sinon adresse absolue sur lystes.ai. */
export function lienLystes(cible: string): { interne: boolean; href: string } {
  if (!cible.startsWith("/") || cible.startsWith("//")) return { interne: false, href: cible };
  const chemin = cible.split(/[?#]/)[0];
  const local = SUR_BIOLYSTES[chemin];
  if (local !== undefined) return { interne: true, href: local + cible.slice(chemin.length) };
  return { interne: false, href: SITE_LYSTES + cible };
}

function cibleTexte(to: LinkProps["to"]): string | null {
  if (typeof to === "string") return to;
  if (to && typeof to === "object" && typeof to.pathname === "string") {
    return to.pathname + (to.search || "") + (to.hash || "");
  }
  return null;
}

/* Propriétés propres au routeur, à ne pas poser sur une simple balise <a>. */
const PROPRIETES_ROUTEUR = ["replace", "state", "reloadDocument", "preventScrollReset", "relative", "viewTransition", "caseSensitive", "end", "discover"];

function sansRouteur(props: Record<string, unknown>) {
  const reste: Record<string, unknown> = {};
  for (const [cle, valeur] of Object.entries(props)) if (!PROPRIETES_ROUTEUR.includes(cle)) reste[cle] = valeur;
  return reste as AnchorHTMLAttributes<HTMLAnchorElement>;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...reste }, ref) {
  const texte = cibleTexte(to);
  if (texte !== null) {
    const { interne, href } = lienLystes(texte);
    if (!interne) return <a ref={ref} href={href} {...sansRouteur(reste)} />;
    return <LienRouteur ref={ref} to={href} {...reste} />;
  }
  return <LienRouteur ref={ref} to={to} {...reste} />;
});

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink({ to, ...reste }, ref) {
  const texte = cibleTexte(to);
  if (texte !== null) {
    const { interne, href } = lienLystes(texte);
    if (!interne) {
      const { className, style, children, ...autres } = reste;
      const etat = { isActive: false, isPending: false, isTransitioning: false };
      return (
        <a
          ref={ref}
          href={href}
          className={typeof className === "function" ? className(etat) : className}
          style={typeof style === "function" ? style(etat) : style}
          {...sansRouteur(autres)}
        >
          {typeof children === "function" ? children(etat) : children}
        </a>
      );
    }
    return <LienNavRouteur ref={ref} to={href} {...reste} />;
  }
  return <LienNavRouteur ref={ref} to={to} {...reste} />;
});
