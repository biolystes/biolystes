export function desactiverClicDroit(cible: EventTarget): () => void {
  const bloquer = (event: Event) => event.preventDefault();
  cible.addEventListener("contextmenu", bloquer, { capture: true });
  return () => cible.removeEventListener("contextmenu", bloquer, { capture: true });
}