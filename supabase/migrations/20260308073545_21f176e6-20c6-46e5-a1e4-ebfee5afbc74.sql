
CREATE OR REPLACE FUNCTION public.generate_contract_number()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'BIO-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('public.contract_number_seq')::TEXT, 5, '0')
$$;
