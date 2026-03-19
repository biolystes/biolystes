INSERT INTO product_clean_images (product_name, product_name_normalized, clean_image_url)
VALUES
  ('Duo Corps Peaux Sensibles', 'duocorpspeauxsensibles', 'https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/duocorpspeauxsensibles.webp'),
  ('Le Duo Réparation & Brillance', 'leduoreparationbrillance', 'https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/leduoreparationbrillance.webp'),
  ('Coffret Renaissance Capillaire', 'coffretrenaissancecapillaire', 'https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/coffretrenaissancecapillaire.webp'),
  ('Duo Performance Anti-Âge', 'duoperformanceantiage', 'https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/duoperformanceantiage.webp'),
  ('Duo de routine contre les taches brunes', 'duoderoutinecontrelestachesbrunes', 'https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/duoderoutinecontrelestachesbrunes.webp'),
  ('Le duo d''hydratation ultime', 'leduodhydratationultime', 'https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/leduodhydratationultime.webp'),
  ('Boîte de collection pour le teint clair', 'boitedecollectionpourleteintclair', 'https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/boitedecollectionpourleteintclair.webp')
ON CONFLICT (product_name_normalized) 
DO UPDATE SET clean_image_url = EXCLUDED.clean_image_url;