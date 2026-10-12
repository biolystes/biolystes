import { toast } from 'sonner';
import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@lystes/integrations/supabase/client";

export type TryOnState =
  | "idle"
  | "requesting"
  | "connecting"
  | "active"
  | "error"
  | "fallback_photo";

interface UseDecartTryOnOptions {
  accountId: string;
  agentId?: string;
  product: {
    id: string;
    name: string;
    description?: string;
    image_url: string;
  };
  promptTemplate: string;
  idealResolution?: { width: number; height: number; fps: number };
  fallbackToPhoto?: boolean;
  onStateChange?: (state: TryOnState) => void;
}

export function useDecartTryOn({
  accountId,
  agentId,
  product,
  promptTemplate,
  idealResolution = { width: 1280, height: 704, fps: 25 },
  fallbackToPhoto = true,
  onStateChange,
}: UseDecartTryOnOptions) {
  const [state, setState] = useState<TryOnState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [usageInfo, setUsageInfo] = useState<{ used: number; limit: number } | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const promptsSentRef = useRef(0);
  const addedToCartRef = useRef(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const updateState = useCallback(
    (newState: TryOnState) => {
      setState(newState);
      onStateChange?.(newState);
    },
    [onStateChange]
  );

  // Construit le prompt à partir du modèle + des données produit
  const buildPrompt = useCallback(
    (p: typeof product) => {
      return promptTemplate
        .replace("{product_name}", p.name)
        .replace("{product_description}", p.description || "");
    },
    [promptTemplate]
  );

  // Envoie l'image de référence produit via WebSocket
  const sendProductReference = useCallback(
    async (imageUrl: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          wsRef.current?.send(
            JSON.stringify({ type: "image", image: base64 })
          );
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("[useDecartTryOn] Failed to send product reference:", err);
        toast.error("Une erreur est survenue");
      }
    },
    []
  );

  // Envoie le prompt via WebSocket
  const sendPrompt = useCallback(
    (prompt: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      wsRef.current.send(JSON.stringify({ type: "prompt", prompt }));
      promptsSentRef.current += 1;
    },
    []
  );

  // Démarre la session d'essayage
  const start = useCallback(async () => {
    updateState("requesting");
    setErrorMessage(null);

    // 1. Demande l'accès caméra
    let localStream: MediaStream;
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: isMobile ? 720 : idealResolution.width },
          height: { ideal: isMobile ? 1280 : idealResolution.height },
          frameRate: { ideal: idealResolution.fps },
        },
        audio: false,
      });
      localStreamRef.current = localStream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
    } catch (err) {
      console.warn("[useDecartTryOn] Camera denied:", err);
      if (fallbackToPhoto) {
        updateState("fallback_photo");
      } else {
        setErrorMessage("Caméra non disponible. Veuillez autoriser l'accès.");
        updateState("error");
      }
      return;
    }

    // 2. Récupère la connexion via le proxy
    updateState("connecting");

    try {
      const { data, error } = await supabase.functions.invoke(
        "decart-tryon-proxy",
        {
          body: {
            account_id: accountId,
            agent_id: agentId,
            product_id: product.id,
            product_name: product.name,
            product_image_url: product.image_url,
            action: "get_connection",
          },
        }
      );

      if (error) throw error;

      if (data?.error === "tryon_limit_reached") {
        setErrorMessage(data.message);
        updateState("error");
        cleanup();
        return;
      }

      if (!data?.wsUrl) throw new Error("No WebSocket URL received");

      setSessionId(data.sessionId);
      setUsageInfo({
        used: data.usedSeconds || 0,
        limit: data.limitSeconds || 300,
      });

      // 3. Connecte le WebSocket
      const ws = new WebSocket(data.wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[useDecartTryOn] WebSocket connected");
        setupWebRTC(localStream, ws);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          handleWSMessage(msg);
        } catch {
          // Données binaires ou non-JSON
        }
      };

      ws.onerror = (err) => {
        console.error("[useDecartTryOn] WebSocket error:", err);
        setErrorMessage("Erreur de connexion au serveur d'essayage.");
        updateState("error");
      };

      ws.onclose = () => {
        console.log("[useDecartTryOn] WebSocket closed");
      };
    } catch (err) {
      console.error("[useDecartTryOn] Connection error:", err);
      toast.error("Une erreur est survenue");
      setErrorMessage("Impossible de se connecter au serveur d'essayage.");
      updateState("error");
      cleanup();
    }
  }, [accountId, agentId, product, idealResolution, isMobile, fallbackToPhoto, updateState, buildPrompt]);

  // Configure la connexion pair-à-pair WebRTC
  const setupWebRTC = useCallback(
    (localStream: MediaStream, ws: WebSocket) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      // Ajoute les pistes locales
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      // Gère le flux distant
      const remoteStream = new MediaStream();
      remoteStreamRef.current = remoteStream;

      pc.ontrack = (event) => {
        event.streams[0]?.getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        startTimeRef.current = Date.now();
        updateState("active");

        // Envoie le prompt initial + l'image produit
        const prompt = buildPrompt(product);
        sendPrompt(prompt);
        sendProductReference(product.image_url);
      };

      // Candidats ICE
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          ws.send(
            JSON.stringify({
              type: "ice_candidate",
              candidate: event.candidate,
            })
          );
        }
      };

      // Crée et envoie l'offre
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          ws.send(
            JSON.stringify({
              type: "offer",
              sdp: pc.localDescription,
            })
          );
        })
        .catch((err) => {
          console.error("[useDecartTryOn] Offer creation failed:", err);
          toast.error("Une erreur est survenue");
          setErrorMessage("Échec de la connexion vidéo.");
          updateState("error");
        });
    },
    [product, buildPrompt, sendPrompt, sendProductReference, updateState]
  );

  // Gère les messages WebSocket
  const handleWSMessage = useCallback(
    (msg: Record<string, unknown>) => {
      if (msg.type === "answer" && msg.sdp) {
        pcRef.current?.setRemoteDescription(
          new RTCSessionDescription(msg.sdp as RTCSessionDescriptionInit)
        );
      } else if (msg.type === "ice_candidate" && msg.candidate) {
        pcRef.current?.addIceCandidate(
          new RTCIceCandidate(msg.candidate as RTCIceCandidateInit)
        );
      }
    },
    []
  );

  // Change de produit (changement de variante)
  const changeProduct = useCallback(
    (newProduct: typeof product) => {
      const prompt = buildPrompt(newProduct);
      sendPrompt(prompt);
      sendProductReference(newProduct.image_url);
    },
    [buildPrompt, sendPrompt, sendProductReference]
  );

  // Marque comme ajouté au panier
  const markAddedToCart = useCallback(() => {
    addedToCartRef.current = true;
  }, []);

  // Libère les ressources
  const cleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    pcRef.current?.close();
    pcRef.current = null;

    wsRef.current?.close();
    wsRef.current = null;

    remoteStreamRef.current = null;
  }, []);

  // Termine la session et transmet le rapport au serveur
  const stop = useCallback(async () => {
    const durationSeconds = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 0;

    cleanup();

    if (sessionId) {
      try {
        const { error } = await supabase.functions.invoke("decart-tryon-proxy", {
          body: {
            account_id: accountId,
            action: "end_session",
            session_id: sessionId,
            duration_seconds: durationSeconds,
            added_to_cart: addedToCartRef.current,
            prompts_sent: promptsSentRef.current,
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error("[useDecartTryOn] Failed to end session:", err);
        toast.error("Une erreur est survenue");
      }
    }

    updateState("idle");
    setSessionId(null);
    startTimeRef.current = null;
    promptsSentRef.current = 0;
    addedToCartRef.current = false;
  }, [sessionId, accountId, cleanup, updateState]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    state,
    errorMessage,
    sessionId,
    usageInfo,
    isMobile,
    localVideoRef,
    remoteVideoRef,
    start,
    stop,
    changeProduct,
    sendPrompt,
    markAddedToCart,
  };
}
