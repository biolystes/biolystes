/**
 * Le type de compte côté navigateur. La règle vit dans
 * supabase/functions/_shared/type-de-compte.ts, lue aussi par les fonctions :
 * une seule réponse à « ce compte est-il Business ? ».
 */
export {
  typeDeCompte,
  estBusiness,
  TYPES_DE_COMPTE,
  TYPE_PAR_DEFAUT,
  type TypeDeCompte,
} from "../../../supabase/functions/_shared/type-de-compte";
