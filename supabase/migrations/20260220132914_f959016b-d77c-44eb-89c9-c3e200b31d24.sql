
-- Table pour les sélections de produits partageables
CREATE TABLE public.product_selections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Ma sélection',
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_selections ENABLE ROW LEVEL SECURITY;

-- Owners can manage their own selections
CREATE POLICY "Users can manage own selections"
  ON public.product_selections
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Anyone can view selections (to allow link sharing)
CREATE POLICY "Anyone can view selections"
  ON public.product_selections
  FOR SELECT
  USING (true);

-- Trigger pour updated_at
CREATE TRIGGER update_product_selections_updated_at
  BEFORE UPDATE ON public.product_selections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
