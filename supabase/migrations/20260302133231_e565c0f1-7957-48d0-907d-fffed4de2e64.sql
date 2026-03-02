
DROP POLICY "Users can manage own selections" ON public.product_selections;

CREATE POLICY "Anyone can insert selections"
  ON public.product_selections
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own selections"
  ON public.product_selections
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own selections"
  ON public.product_selections
  FOR DELETE
  USING (auth.uid() = user_id);
