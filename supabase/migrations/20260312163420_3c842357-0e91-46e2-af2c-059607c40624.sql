
-- Fix the two entries with bad normalization
UPDATE public.product_clean_images 
SET product_name_normalized = 'masquealargileporlesporeset lespointsnoirs'
WHERE product_name = 'Masque à l''argile pour les pores et les points noirs';

-- Actually let me just delete and re-insert the two bad ones
DELETE FROM public.product_clean_images WHERE product_name IN (
  'Masque à l''argile pour les pores et les points noirs',
  'Tonique exfoliant à l''acide glycolique'
);

INSERT INTO public.product_clean_images (product_name, product_name_normalized, clean_image_url) VALUES
('Masque à l''argile pour les pores et les points noirs', 'masquealargileporlesporeset lespointsnoirs', 'https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zLzFTajlFMVVSM2x6X1d0ZWtnZlUwUlRkOUdLTHgzYVY1LmpwZyZ3aWR0aD0xMDI0'),
('Tonique exfoliant à l''acide glycolique', 'toniqueexfoliantalacideglycolique', 'https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1U0emVOTDY5UGtQdk4ta1A0VXhaTkVZaC1SekYwU2ZaLmpwZyZ3aWR0aD0xMDI0');
