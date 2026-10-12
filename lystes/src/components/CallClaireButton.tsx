import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Phone, PhoneOff, Loader2, Mic } from "lucide-react";
import { useConversation } from "@elevenlabs/react";
import { supabase } from "@lystes/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@lystes/lib/utils";
import i18n from "@lystes/i18n/config";
import { BOOKING_URL } from "@lystes/config/urls";
import { getJsxT } from "@lystes/i18n/jsx-locale";

interface CallClaireButtonProps {
  /** "floating" (default) = fixed bottom-right ; "inline" = bouton posé dans un slot parent. */
  variant?: "floating" | "inline";
}

/**
 * Appeler Cléa, l'assistante vocale IA de Lystes.
 * Ouvre une session WebRTC avec l'agent ElevenLabs "Cléa".
 */
export function CallClaireButton({ variant = "floating" }: CallClaireButtonProps) {
  /* Les libellés et messages passent par la traduction (audit du 27/09/2026) :
     une visiteuse anglophone de l'accueil les lisait en français. La
     référence évite qu'un rappel de la conversation, créé au premier rendu,
     parle encore l'ancienne langue. */
  const { i18n: langue } = useTranslation();
  const tr = useMemo(() => getJsxT("appel-clea", langue.language), [langue.language]);
  const trRef = useRef(tr);
  trRef.current = tr;
  const [isConnecting, setIsConnecting] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const requestStableMicrophone = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
      },
    });
    const track = stream.getAudioTracks()[0];
    const inputDeviceId = track?.getSettings().deviceId;
    return { stream, inputDeviceId };
  }, []);

  const openBookingPage = useCallback((params: { url?: string; reason?: string } = {}) => {
    /* Le lien de réservation vit dans src/config/urls.ts (« Ne pas dupliquer
       ce lien ») : une copie écrite ici survivrait à un changement d'adresse. */
    const url = params.url || `${BOOKING_URL}?overlayCalendar=true`;
    try {
      const win = window.open(url, "_blank", "noopener,noreferrer");
      if (win) {
        win.opener = null;
        try { win.focus(); } catch {}
      } else {
        // Popup bloquée : fallback via lien cliqué programmatiquement (garde l'onglet courant).
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      toast.success(trRef.current("Page de réservation ouverte dans un nouvel onglet"));
      return `Booking page opened${params.reason ? ` (reason: ${params.reason})` : ""}`;
    } catch (e) {
      console.error("[open_booking] failed:", e);
      toast.error(trRef.current("Impossible d'ouvrir la page de réservation"));
      return "Failed to open booking page";
    }
  }, []);

  const conversation = useConversation({
    onConnect: () => toast.success(trRef.current("Vous êtes en ligne avec Cléa")),
    onDisconnect: () => toast.info(trRef.current("Appel terminé")),
    onError: (err) => {
      console.error("[CallCléa] error:", err);
      toast.error(trRef.current("Impossible de joindre Cléa"));
    },
    onMessage: (msg: any) => {
      // Log tous les messages pour diagnostic + fallback si l'agent nomme le tool autrement.
      console.log("[CallCléa] message:", msg);
      try {
        const toolCall = msg?.client_tool_call || msg?.tool_call;
        const name: string | undefined = toolCall?.tool_name || toolCall?.name;
        if (name && /book|rendez|rdv|calendar|schedule/i.test(name)) {
          openBookingPage(toolCall?.parameters || toolCall?.arguments || {});
        }
      } catch (e) {
        console.error("[CallCléa] onMessage handler failed:", e);
      }
    },
    clientTools: {
      // Alias multiples pour matcher la config côté ElevenLabs, quel que soit le nommage choisi.
      open_booking: openBookingPage,
      openBooking: openBookingPage,
      open_booking_page: openBookingPage,
      book_meeting: openBookingPage,
      schedule_meeting: openBookingPage,
      open_calendar: openBookingPage,
      prendre_rendez_vous: openBookingPage,
      prendreRendezVous: openBookingPage,
    },
  });

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  useEffect(() => {
    if (!isConnected) {
      setElapsed(0);
      return;
    }
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [isConnected]);

  const start = useCallback(
    async (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (isConnecting || isConnected) return;
      setIsConnecting(true);
      let permissionStream: MediaStream | null = null;
      try {
        const mic = await requestStableMicrophone();
        permissionStream = mic.stream;
        /* Langue du site : Cléa décroche dans la langue de navigation. */
        const siteLanguage = (i18n.resolvedLanguage || i18n.language || "fr").split("-")[0];
        const { data, error } = await supabase.functions.invoke("claire-token", {
          body: { language: siteLanguage },
        });
        if (error || !data?.token) throw new Error(error?.message || "Token indisponible");
        const sessionLanguage = data.language || siteLanguage;
        /* Le premier message part en surcharge dans toutes les langues,
           français compris (contre-revue du 27/09/2026) : la phrase où Cléa
           dit qu'elle est une IA ne dépend plus de la mise à jour de l'agent
           côté ElevenLabs, qui peut échouer. La langue, elle, n'est
           surchargée que hors français : l'agent est configuré en fr. */
        const agentOverride = {
          ...(sessionLanguage !== "fr" ? { language: sessionLanguage } : {}),
          ...(data.first_message ? { firstMessage: data.first_message } : {}),
        };
        await conversation.startSession({
          conversationToken: data.token,
          connectionType: "webrtc",
          inputDeviceId: mic.inputDeviceId,
          preferHeadphonesForIosDevices: true,
          ...(Object.keys(agentOverride).length > 0 ? { overrides: { agent: agentOverride } } : {}),
        });
      } catch (err) {
        console.error("[CallCléa] start failed:", err);
        /* Un message pour la visiteuse, dans sa langue : le texte technique
           (« Token indisponible », « Permission denied ») reste dans la console. */
        const microRefuse = err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "SecurityError");
        toast.error(
          microRefuse
            ? trRef.current("Autorisez le micro pour parler à Cléa.")
            : trRef.current("L'appel n'a pas pu démarrer. Réessayez dans un instant."),
        );
      } finally {
        permissionStream?.getTracks().forEach((track) => track.stop());
        setIsConnecting(false);
      }
    },
    [conversation, isConnected, isConnecting, requestStableMicrophone]
  );

  const stop = useCallback(
    async (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      await conversation.endSession();
    },
    [conversation]
  );

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const wrapperClass =
    variant === "floating"
      ? "fixed z-[60] bottom-5 right-5 flex items-center gap-2"
      : "phone-unscope inline-flex items-center gap-2";

  // Inline = pilule blanche (posée sur l'image de Cléa) ; floating = pilule sombre.
  const isInline = variant === "inline";

  return (
    <div className={wrapperClass} style={{ fontFamily: "inherit" }}>
      {isConnected ? (
        <div
          className={cn(
            "flex items-center gap-2 rounded-full pl-3 pr-1 py-1",
            isInline ? "bg-white text-stone-900" : "bg-stone-900 text-neutral-50"
          )}
        >
          <span
            className={cn(
              "inline-flex h-2 w-2 rounded-full",
              isSpeaking ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
            )}
          />
          <span className="text-[10px] tracking-[0.14em] uppercase">Cléa</span>
          <span
            className={cn(
              "text-[10px] tabular-nums",
              isInline ? "text-stone-500" : "text-stone-300"
            )}
          >
            {mm}:{ss}
          </span>
          {isSpeaking ? <Mic className="h-3 w-3 text-emerald-500 ml-1" /> : null}
          <button
            type="button"
            onClick={stop}
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            aria-label={tr("Raccrocher")}
          >
            <PhoneOff className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={start}
          disabled={isConnecting}
          className={cn(
            "group inline-flex items-center rounded-full transition-all duration-200",
            isInline
              ? "gap-2 bg-white/95 backdrop-blur-md text-stone-900 hover:bg-white hover:-translate-y-0.5 px-4 py-2 leading-none"
              : "gap-1.5 bg-stone-900 text-neutral-50 hover:bg-stone-800 px-4 py-2.5",
            "disabled:opacity-70 disabled:cursor-not-allowed"
          )}
          aria-label={tr("Appeler Cléa, l'assistante vocale IA de Lystes")}
        >
          {isConnecting ? (
            <Loader2 className={cn("h-3.5 w-3.5", "animate-spin")} />
          ) : (
            <Phone className="h-3.5 w-3.5" />
          )}
          <span
            className={cn(
              "uppercase",
              /* 11 px au lieu de 7 (audit du 27/09/2026) : en capitales sur
                 une photo, 7 px ne se lisait pas. Sur une ligne : l'emplacement
                 des pages prend la largeur du bouton (width:max-content). */
              isInline ? "whitespace-nowrap text-[11px] font-semibold tracking-[0.08em]" : "text-[10px] tracking-[0.22em]"
            )}
          >
            {isConnecting ? tr("Connexion…") : tr("Appeler Cléa")}
          </span>
        </button>
      )}
    </div>
  );
}
