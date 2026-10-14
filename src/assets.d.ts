// Keep asset modules visible to isolated checks of the articles data file.
declare module "@/assets/*.jpg" { const src: string; export default src; }
declare module "@/assets/*.png" { const src: string; export default src; }
declare module "@/assets/*.webp" { const src: string; export default src; }
declare module "*.jpg" { const src: string; export default src; }
declare module "*.jpeg" { const src: string; export default src; }
declare module "*.png" { const src: string; export default src; }
declare module "*.webp" { const src: string; export default src; }
declare module "*.svg" { const src: string; export default src; }
