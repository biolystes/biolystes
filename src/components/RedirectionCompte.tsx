import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { adresseCompte, URL_CONNEXION } from "@/lib/comptes";

/** Les anciennes pages de compte renvoient vers biolystes.pro. */
export default function RedirectionCompte() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.location.replace(adresseCompte(pathname + search) ?? URL_CONNEXION);
  }, [pathname, search]);
  return null;
}
