import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { socketService } from "@/service/socket/socketService";
import { useCallContext } from "@/contexts/CallContext";

export function useIncomingCall() {
  const {
    setCallAcknowledged,
    setSessionActive,
  } = useCallContext();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabledRef = useRef(false);
  const activeToastIdRef = useRef<string | null>(null);
  const listenerAttachedRef = useRef(false);

  const stopRingtone = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const startRingtone = async () => {
    if (!soundEnabledRef.current) return;

    stopRingtone();
    try {
      const audio = new Audio("/audio/incoming_call.mp3");
      audio.loop = true;
      audio.volume = 0.8;
      audioRef.current = audio;
      await audio.play();
    } catch {
      audioRef.current = null;
    }
  };

  const enableSound = async () => {
    try {
      const unlock = new Audio(
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA="
      );
      unlock.volume = 0;
      await unlock.play();
      unlock.pause();
    } catch {}
    soundEnabledRef.current = true;
    startRingtone();
  };

  useEffect(() => {
    const handleIncomingCall = (data: any) => {
      if (activeToastIdRef.current) return;

      const toastId = toast.custom(
        (t) => (
          <div className="w-[320px] rounded-xl bg-black/70 border border-emerald-500/30 p-4">
            <p className="text-white font-semibold text-sm">
              Incoming Video Call
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              A developer started a session
            </p>

            {!soundEnabledRef.current && (
              <button
                onClick={enableSound}
                className="mt-3 w-full rounded-xl bg-indigo-600 text-white py-2 text-sm"
              >
                🔔 Enable sound
              </button>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  setCallAcknowledged(true);
                  setSessionActive(true);
                  stopRingtone();
                  toast.dismiss(t.id);
                  window.location.href = `/video-call-lobby/${data.sessionId}?mode=participant`;
                }}
                className="flex-1 rounded-xl bg-emerald-600 text-white py-1.5 text-sm"
              >
                Join
              </button>

              <button
                onClick={() => {
                  setCallAcknowledged(true); 
                  setSessionActive(true); 
                  stopRingtone();
                  toast.dismiss(t.id);
                }}
                className="flex-1 rounded-xl bg-zinc-700 text-white py-1.5 text-sm"
              >
                Skip
              </button>
            </div>
          </div>
        ),
        { duration: 20000 }
      );

      activeToastIdRef.current = toastId;
      if (soundEnabledRef.current) startRingtone();

      setTimeout(() => {
        if (activeToastIdRef.current === toastId) {
          stopRingtone();
          activeToastIdRef.current = null;
          setCallAcknowledged(true);
          setSessionActive(true);
        }
      }, 20000);
    };

    const attach = async () => {
      await socketService.waitForConnection();
      if (listenerAttachedRef.current) return;

      socketService.on("video:session:initiated", handleIncomingCall);
      listenerAttachedRef.current = true;
    };

    attach();

    return () => {
      socketService.off("video:session:initiated", handleIncomingCall);
      stopRingtone();
      listenerAttachedRef.current = false;
      activeToastIdRef.current = null;
    };
  }, []);
}
