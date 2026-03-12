
CREATE TABLE public.product_clean_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  product_name_normalized text NOT NULL,
  clean_image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_name_normalized)
);

ALTER TABLE public.product_clean_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read clean images" ON public.product_clean_images
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage clean images" ON public.product_clean_images
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
