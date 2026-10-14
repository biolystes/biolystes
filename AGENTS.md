# Project rules

- Biolystes pages (src/) must import their own images from `src/assets`, never from `lystes/src/assets`: the `lystes/` folder is overwritten when it is resynced from the other project, so files can disappear and break the build.
- Keep the salon media carousel in BioPage's SalonSlides using Embla and a shared slide template, so both slides preserve identical media and layout without duplicated markup.
