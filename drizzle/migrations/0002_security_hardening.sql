-- product_selections: access only through functions (lookup by unguessable id)
DROP POLICY IF EXISTS "Anyone can insert selections" ON public.product_selections;
DROP POLICY IF EXISTS "Anyone can view selections" ON public.product_selections;
CREATE POLICY "Users can view own selections" ON public.product_selections FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.get_product_selection(_id uuid)
RETURNS TABLE(id uuid, title text, products jsonb, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.id, s.title, s.products, s.created_at FROM public.product_selections s WHERE s.id = _id;
$$;

CREATE OR REPLACE FUNCTION public.create_product_selection(_title text, _products jsonb)
RETURNS TABLE(id uuid, title text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _title IS NULL OR length(trim(_title)) = 0 OR length(_title) > 120 THEN RAISE EXCEPTION 'Titre invalide'; END IF;
  IF jsonb_typeof(_products) <> 'array' OR jsonb_array_length(_products) = 0 OR jsonb_array_length(_products) > 50 THEN RAISE EXCEPTION 'Produits invalides'; END IF;
  RETURN QUERY INSERT INTO public.product_selections (title, products, user_id)
    VALUES (trim(_title), _products, COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid))
    RETURNING product_selections.id, product_selections.title, product_selections.created_at;
END; $$;
GRANT EXECUTE ON FUNCTION public.get_product_selection(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_product_selection(text, jsonb) TO anon, authenticated;

-- product-images: only admins may write
DROP POLICY IF EXISTS "Authenticated can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update product images" ON storage.objects;
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- client prices/totals: never trusted from customers
CREATE OR REPLACE FUNCTION public.strip_client_prices()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') OR auth.uid() IS NULL THEN RETURN NEW; END IF;
  IF TG_TABLE_NAME = 'client_selections' THEN
    NEW.wc_product_price := CASE WHEN TG_OP = 'UPDATE' THEN OLD.wc_product_price ELSE NULL END;
  ELSIF TG_TABLE_NAME = 'client_orders' THEN
    IF TG_OP = 'INSERT' THEN
      NEW.total := NULL;
      NEW.status := 'pending';
      NEW.items := COALESCE((SELECT jsonb_agg(e - 'price') FROM jsonb_array_elements(NEW.items) e), '[]'::jsonb);
    ELSE
      NEW.total := OLD.total; NEW.status := OLD.status; NEW.items := OLD.items;
    END IF;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER client_selections_strip_prices BEFORE INSERT OR UPDATE ON public.client_selections FOR EACH ROW EXECUTE FUNCTION public.strip_client_prices();
CREATE TRIGGER client_orders_strip_prices BEFORE INSERT OR UPDATE ON public.client_orders FOR EACH ROW EXECUTE FUNCTION public.strip_client_prices();

-- client_contracts: signing only via server function
DROP POLICY IF EXISTS "Users can update own contracts" ON public.client_contracts;
CREATE OR REPLACE FUNCTION public.sign_client_contract(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.client_contracts SET status = 'signed', signed_at = now()
  WHERE id = _id AND user_id = auth.uid() AND status = 'pending';
  IF NOT FOUND THEN RAISE EXCEPTION 'Contrat introuvable ou déjà signé'; END IF;
END; $$;
REVOKE EXECUTE ON FUNCTION public.sign_client_contract(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.sign_client_contract(uuid) TO authenticated;