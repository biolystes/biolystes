
-- Add legal status fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS statut_juridique TEXT DEFAULT 'particulier',
  ADD COLUMN IF NOT EXISTS civilite TEXT,
  ADD COLUMN IF NOT EXISTS date_naissance DATE,
  ADD COLUMN IF NOT EXISTS nationalite TEXT,
  ADD COLUMN IF NOT EXISTS code_postal TEXT,
  ADD COLUMN IF NOT EXISTS ville TEXT,
  ADD COLUMN IF NOT EXISTS pays TEXT,
  ADD COLUMN IF NOT EXISTS raison_sociale TEXT,
  ADD COLUMN IF NOT EXISTS forme_juridique TEXT,
  ADD COLUMN IF NOT EXISTS siege_social TEXT,
  ADD COLUMN IF NOT EXISTS rcs_siret TEXT,
  ADD COLUMN IF NOT EXISTS numero_tva TEXT,
  ADD COLUMN IF NOT EXISTS representant_nom TEXT,
  ADD COLUMN IF NOT EXISTS representant_qualite TEXT,
  ADD COLUMN IF NOT EXISTS piece_identite_url TEXT;

-- Contract templates
CREATE TABLE public.contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  contenu_html TEXT NOT NULL,
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage templates" ON public.contract_templates FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can read active templates" ON public.contract_templates FOR SELECT TO authenticated USING (active = true);

-- Onboarding contracts (separate from existing contracts table)
CREATE TABLE public.onboarding_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL,
  numero_contrat TEXT UNIQUE NOT NULL,
  pack TEXT NOT NULL,
  montant_setup DECIMAL NOT NULL,
  montant_abonnement DECIMAL NOT NULL DEFAULT 0,
  contenu_html TEXT NOT NULL,
  contenu_hash TEXT,
  statut TEXT NOT NULL DEFAULT 'brouillon',
  signed_at TIMESTAMPTZ,
  signature_ip TEXT,
  signature_ua TEXT,
  signature_image_url TEXT,
  certificat_pdf_url TEXT,
  produits_selectionnes JSONB,
  brand_name TEXT,
  template_id UUID REFERENCES public.contract_templates(id)
);
ALTER TABLE public.onboarding_contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own onboarding contracts" ON public.onboarding_contracts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own onboarding contracts" ON public.onboarding_contracts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own draft contracts" ON public.onboarding_contracts FOR UPDATE TO authenticated USING (auth.uid() = user_id AND statut = 'brouillon') WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all onboarding contracts" ON public.onboarding_contracts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Contract amendments
CREATE TABLE public.contract_amendments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_contract_id UUID REFERENCES public.onboarding_contracts(id) NOT NULL,
  motif TEXT NOT NULL,
  contenu_html TEXT NOT NULL,
  contenu_hash TEXT,
  signed_at TIMESTAMPTZ,
  signature_image_url TEXT,
  certificat_pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.contract_amendments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own amendments" ON public.contract_amendments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.onboarding_contracts WHERE id = parent_contract_id AND user_id = auth.uid()));
CREATE POLICY "Admins can manage amendments" ON public.contract_amendments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Sequence for contract numbering
CREATE SEQUENCE IF NOT EXISTS contract_number_seq START 1;

-- Function to generate contract number
CREATE OR REPLACE FUNCTION public.generate_contract_number()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'BIO-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('contract_number_seq')::TEXT, 5, '0')
$$;
