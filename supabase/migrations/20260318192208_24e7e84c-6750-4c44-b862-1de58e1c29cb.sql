-- Create storage bucket for product clean images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access on product-images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'product-images');

-- Allow authenticated users to manage images (edge functions use service role)
CREATE POLICY "Authenticated can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated can update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');
