import { useCallback, useState } from "react";
import { Phone, PhoneOff, Loader2, Mic } from "lucide-react";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@lystes/components/ui/button";
import { supabase } from "@lystes/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@lystes/lib/utils";
import { LystesOrb } from "@lystes/components/chatbot/LystesOrb";


interface VoiceCallButtonProps {
  assistantName?: string;
  voiceId?: string;
  /** Contexte produit/marque injecté dans le prompt de l'agent vocal. */
  contextPrompt?: string;
  /** Première phrase prononcée par l'agent. */
  firstMessage?: string;
  language?: string;
  /** "widget-icon" = rendu identique au bouton d'appel du widget boutique. */
  renderAs?: "default" | "widget-icon" | "orb";
  /**
   * Edge function qui délivre le jeton. En mode démo `/shoot`, on utilise
   * `shot-voice-token` : le contexte produit est composé côté serveur et les
   * overrides de session sont explicitement autorisés sur l'agent.
   */
  tokenFunction?: string;
  /** Corps envoyé à la fonction de jeton (produit scrapé en mode démo). */
  tokenBody?: Record<string, unknown>;
}


/**
 * Bouton d'appel vocal ElevenLabs Conversational AI.
 * Utilise la voix custom via override TTS (doit être activée dans l'agent ElevenLabs).
 */
export function VoiceCallButton({
  assistantName,
  voiceId = "NEjemlRxgWmL5ZGJetsB",
  contextPrompt,
  firstMessage,
  language,
  renderAs = "default",
  tokenFunction = "elevenlabs-assistant-token",
  tokenBody,
}: VoiceCallButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => toast.success("Appel vocal démarré"),
    onDisconnect: () => toast.info("Appel terminé"),
    onError: (err) => {
      console.error("[VoiceCall] error:", err);
      toast.error("Erreur assistant vocal");
    },
  });


  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  const start = useCallback(async () => {
    if (isConnecting || isConnected) return;
    setIsConnecting(true);
    let stableStream: MediaStream | null = null;
    try {
      // Micro stable : echo/noise/gain traités côté navigateur → moins de coupures
      // et de mots déformés côté modèle STT.
      stableStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000,
        },
        video: false,
      });
      const inputDeviceId =
        stableStream.getAudioTracks()[0]?.getSettings().deviceId;

      const { data, error } = await supabase.functions.invoke(tokenFunction, {
        body: { assistantName, ...(tokenBody ?? {}) },
      });
      if (error || !data?.token) {
        throw new Error(error?.message || "Token indisponible");
      }

      // Le serveur fait autorité sur le contexte produit ; les props ne servent
      // que de repli quand la fonction de jeton n'en renvoie pas.
      const sessionPrompt: string | undefined = data.contextPrompt || contextPrompt;
      const sessionFirst: string | undefined = data.firstMessage || firstMessage;
      const sessionLang: string | undefined = data.language || language;

      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
        ...(inputDeviceId ? { inputDeviceId } : {}),
        preferHeadphonesForIosDevices: true,
        overrides: {
          tts: { voiceId: data.voiceId || voiceId },
          ...(sessionPrompt || sessionFirst || sessionLang
            ? {
                agent: {
                  ...(sessionPrompt ? { prompt: { prompt: sessionPrompt } } : {}),
                  ...(sessionFirst ? { firstMessage: sessionFirst } : {}),
                  ...(sessionLang ? { language: sessionLang } : {}),
                },
              }
            : {}),
        },
      });
    } catch (e) {
      console.error("[VoiceCall] start failed:", e);
      toast.error(
        e instanceof Error ? e.message : "Impossible de démarrer l'appel"
      );
      stableStream?.getTracks().forEach((t) => t.stop());
    } finally {
      setIsConnecting(false);
    }
  }, [
    assistantName,
    contextPrompt,
    conversation,
    firstMessage,
    isConnected,
    isConnecting,
    language,
    tokenBody,
    tokenFunction,
    voiceId,
  ]);



  const stop = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  // Rendu à l'identique du bouton d'appel du widget boutique (icône 24px).
  // Orbe flottante : vit à l'intérieur de la page servie en iframe, donc
  // disponible sur toutes les boutiques sans mise à jour du plugin.
  if (renderAs === "orb") {
    /* Orbe d'appel : disque noir avec la même auréole lumineuse que
       l'orbe principale (couche « ring » du composant d'orbe). */
    const size = 40;
    const iconPx = Math.max(14, Math.round(size * 0.45));
    return (
      <button
        type="button"
        onClick={isConnected ? stop : start}
        disabled={isConnecting}
        aria-label={isConnected ? "Raccrocher" : "Parler à l'expert"}
        title={isConnected ? "Raccrocher" : "Parler à l'expert"}
        className={cn(
          "border-none bg-transparent p-0 cursor-pointer",
          "transition-transform hover:scale-105 disabled:opacity-60"
        )}
      >
        <LystesOrb
          size={size}
          dark
          variant="ring"
          badge={null}
          className={cn(
            isConnected && "lystes-orb-incall",
            isSpeaking && "animate-pulse"
          )}
        >
          {isConnecting ? (
            <Loader2 style={{ width: iconPx, height: iconPx }} className="animate-spin" />
          ) : isConnected ? (
            <PhoneOff style={{ width: iconPx, height: iconPx }} />
          ) : (
            <Phone style={{ width: iconPx, height: iconPx }} />
          )}
        </LystesOrb>
      </button>
    );
  }


  if (renderAs === "widget-icon") {
    return (
      <button
        type="button"
        className={cn("lystes-call-btn", isConnected && "in-call")}
        onClick={isConnected ? stop : start}
        disabled={isConnecting}
        aria-label="Appeler un expert"
        title="Appeler un expert"
      >
        {isConnecting ? (
          <Loader2 className="animate-spin" />
        ) : isConnected ? (
          <PhoneOff />
        ) : (
          <Phone />
        )}
      </button>
    );
  }

  if (isConnected) {

    return (
      <Button
        variant="destructive"
        size="sm"
        onClick={stop}
        className="gap-1 text-xs"
      >
        {isSpeaking ? (
          <Mic className={cn("h-3 w-3 animate-pulse")} />
        ) : (
          <PhoneOff className="h-3 w-3" />
        )}
        {isSpeaking ? "Parle..." : "Raccrocher"}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={start}
      disabled={isConnecting}
      className="gap-1 text-xs"
      title="Parler à l'assistant"
    >
      {isConnecting ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Phone className="h-3 w-3" />
      )}
      Appeler
    </Button>
  );
}
