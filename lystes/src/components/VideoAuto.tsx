import { forwardRef, useCallback, useRef, type VideoHTMLAttributes } from "react";
import { poserMuet, useRelanceLecture, useSourceLisible } from "@lystes/lib/videoSansRange";

/**
 * Vidéo d'arrière-plan muette en lecture automatique, lisible sur iPhone :
 * fichier de public/ lu depuis une adresse blob: (voir lib/videoSansRange),
 * attribut `muted` posé dans le DOM, lecture relancée si refusée. L'affiche
 * (`poster`) reste visible pendant le téléchargement. S'emploie comme une
 * balise <video autoPlay muted loop playsInline src=…>.
 */
type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, "src"> & { src: string };

const VideoAuto = forwardRef<HTMLVideoElement, Props>(function VideoAuto(
  { src, autoPlay = true, loop = true, playsInline = true, ...reste },
  refExterne,
) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const source = useSourceLisible(src);
  useRelanceLecture(ref, source, autoPlay);

  const poser = useCallback(
    (v: HTMLVideoElement | null) => {
      ref.current = v;
      poserMuet(v);
      if (typeof refExterne === "function") refExterne(v);
      else if (refExterne) refExterne.current = v;
    },
    [refExterne],
  );

  return (
    <video
      ref={poser}
      src={source}
      autoPlay={autoPlay}
      muted
      loop={loop}
      playsInline={playsInline}
      {...reste}
    />
  );
});

export default VideoAuto;
