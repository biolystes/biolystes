-- Sécurité : le bucket privé "contracts" était lisible par tout compte connecté
-- (policy SELECT avec seulement bucket_id = 'contracts').
-- Nouvelle règle : lecture réservée à
--   1. l'équipe (rôle admin, via public.has_role) ;
--   2. la cliente propriétaire : fichiers déposés sous <user_id>/... ;
--   3. la cliente propriétaire de la signature : signatures/<id du contrat>.png
--      où le contrat (onboarding_contracts) lui appartient.
-- Personne d'autre. Écriture inchangée (admin seulement).

UPDATE storage.buckets SET public = false WHERE id = 'contracts';

DROP POLICY IF EXISTS "Users can view own contracts" ON storage.objects;
DROP POLICY IF EXISTS "Owner or admin can read contracts" ON storage.objects;

CREATE POLICY "Owner or admin can read contracts" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'contracts'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR (storage.foldername(name))[1] = auth.uid()::text
      OR (
        (storage.foldername(name))[1] = 'signatures'
        AND EXISTS (
          SELECT 1
          FROM public.onboarding_contracts oc
          WHERE oc.user_id = auth.uid()
            AND oc.id::text = split_part(storage.filename(name), '.', 1)
        )
      )
    )
  );
