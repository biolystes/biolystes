# Project rules

- Biolystes pages (src/) must import their own images from `src/assets`, never from `lystes/src/assets`: the `lystes/` folder is overwritten when it is resynced from the other project, so files can disappear and break the build.
- Keep BioPage's SalonSlides on Embla with a shared data-driven slide template, so each slide can have distinct central and side media without duplicating its layout.
- Keep additional-product eligibility in `src/data/offres.ts` and test it independently of presentation, so pack descriptions cannot drift from the rule.
- Keep the embedded creators gallery's sector row off biolystes.com's home page through the `sansOnglets` flag on `HomeCreatorsGallery` (set in the cosmetique entry of `BlocsAccueilSecteur`), so sector names coming from the embedded view cannot appear on the home page; re-apply it after `lystes/` is resynced.
