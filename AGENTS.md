# Project rules

- Biolystes pages (src/) must import their own images from `src/assets`, never from `lystes/src/assets`: the `lystes/` folder is overwritten when it is resynced from the other project, so files can disappear and break the build.
- Keep BioPage's SalonSlides on Embla with a shared data-driven slide template, so each slide can have distinct central and side media without duplicating its layout.
