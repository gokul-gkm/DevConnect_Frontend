import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { socketService } from "@/service/socket/socketService";
import { useAudioUnlock } from "@/hooks/videoCall/useAudioUnlock";

export function useIncomingCall() {

  const activeToastId = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRingtone = async () => {
    stopRingtone();

    const audio = new Audio("/audio/incoming_call.mp3");
    audio.loop = true;
    audio.volume = 0.8;

    audioRef.current = audio;

    try {
      await audio.play();
      console.log("🔔 Incoming call ringtone playing");
    } catch {
      console.warn("🔕 Ringtone blocked — will retry after user interaction");
    }
  };

  const stopRingtone = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;
  };

  useAudioUnlock(() => {
    if (activeToastId.current) {
      startRingtone();
    }
  });

  useEffect(() => {
    const handleIncomingCall = (_data: { sessionId: string }) => {
      if (activeToastId.current) return;

      startRingtone();

      activeToastId.current = toast.custom(
        (t) => (
          <div className="flex items-center gap-4 bg-zinc-900 border border-emerald-500/30 px-4 py-3 rounded-xl shadow-xl w-[320px]">
            <div className="flex-1">
              <p className="text-white font-medium">Incoming Video Call</p>
              <p className="text-xs text-zinc-400">
                Developer started the session
              </p>
            </div>

            <button
              onClick={() => {
                stopRingtone();
                toast.dismiss(t.id);
                activeToastId.current = null;
                //  window.location.href = `/video-call-lobby/${data.sessionId}?mode=participant`;
              }}
              className="px-3 py-1 text-sm rounded-md bg-emerald-600 text-white"
            >
              Join
            </button>

            <button
              onClick={() => {
                stopRingtone();
                toast.dismiss(t.id);
                activeToastId.current = null;
              }}
              className="px-3 py-1 text-sm rounded-md bg-zinc-700 text-white"
            >
              Skip
            </button>
          </div>
        ),
        { duration: 20000 }
      );
    };

    socketService.on("video:session:initiated", handleIncomingCall);

    return () => {
      socketService.off("video:session:initiated", handleIncomingCall);
      stopRingtone();
      activeToastId.current = null;
    };
  }, []);
}