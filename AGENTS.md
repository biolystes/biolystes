# Project rules

- Biolystes pages (src/) must import their own images from `src/assets`, never from `lystes/src/assets`: the `lystes/` folder is overwritten when it is resynced from the other project, so files can disappear and break the build.
- Include the shared asset declarations in the Node TypeScript project because the articles export plugin imports data containing image imports.
