CREATE TABLE public.commandes_goodies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  nom text NOT NULL CHECK (char_length(nom) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 200),
  telephone text CHECK (char_length(telephone) <= 40),
  entreprise text CHECK (char_length(entreprise) <= 160),
  message text CHECK (char_length(message) <= 2000),
  articles jsonb NOT NULL CHECK (jsonb_typeof(articles) = 'array' AND jsonb_array_length(articles) BETWEEN 1 AND 50),
  statut text NOT NULL DEFAULT 'nouvelle'
);
GRANT INSERT ON public.commandes_goodies TO anon, authenticated;
GRANT SELECT, UPDATE ON public.commandes_goodies TO authenticated;
GRANT ALL ON public.commandes_goodies TO service_role;
ALTER TABLE public.commandes_goodies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tout le monde peut passer commande" ON public.commandes_goodies FOR INSERT TO anon, authenticated WITH CHECK (statut = 'nouvelle');
CREATE POLICY "Admins lisent les commandes" ON public.commandes_goodies FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins modifient les commandes" ON public.commandes_goodies FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));