import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Share,
  LayoutGrid,
  Maximize,
  Shield,
  Clock,
  MonitorUp,
} from "lucide-react";

import { Button } from "@/components/ui/shadcn-button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

import { useVideoCall } from "@/hooks/videoCall/useVideoCall";
import Loading from "./Loading";
import CallDisconnected from "./CallDisconnected";
import VideoSessionApi from "@/service/Api/VideoSessionApi";

const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs > 0 ? hrs + ":" : ""}${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

type VideoType = "local" | "remote" | "screen";

export default function VideoCall() {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const isHost = searchParams.get("host") === "true";

  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const tileRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const setTileRef = (key: string) => (el: HTMLVideoElement | null) => {
    tileRefs.current[key] = el;
  };

  const [mainVideo, setMainVideo] = useState<VideoType>("remote");
  const [mainScreenOwner, setMainScreenOwner] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isIntentionallyEnded, setIsIntentionallyEnded] = useState(false);

  const {
    localStream,
    remoteStreams,
    remoteScreenStreams,
    screenShareStream,
    participants,
    isMuted,
    isVideoEnabled,
    isConnected,
    isLoading,
    isScreenSharing,
    callDuration,
    error,
    sessionData,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    endCall,
    isReconnecting,
  } = useVideoCall({
    sessionId,
    isHost,
    onError: (msg) =>
      toast.error(msg, {
        duration: 5000,
        style: {
          background: "#991b1b",
          color: "#fff",
          border: "1px solid #ef4444",
        },
      }),
  });

  const remoteStream = useMemo(
    () => Array.from(remoteStreams.values())[0] || null,
    [remoteStreams]
  );

  const remoteScreenEntries = useMemo(
    () => Array.from(remoteScreenStreams.entries()),
    [remoteScreenStreams]
  );

  const getMainStream = useCallback(() => {
    if (mainVideo === "local") return localStream;
    if (mainVideo === "remote") return remoteStream;

    if (mainVideo === "screen") {
      if (mainScreenOwner === "local") return screenShareStream;
      if (mainScreenOwner)
        return remoteScreenStreams.get(mainScreenOwner) || null;

      return remoteScreenEntries[0]?.[1] || screenShareStream || null;
    }

    return null;
  }, [
    mainVideo,
    mainScreenOwner,
    localStream,
    remoteStream,
    screenShareStream,
    remoteScreenStreams,
    remoteScreenEntries,
  ]);

  const attachToVideo = useCallback(
    async (
      el: HTMLVideoElement | null,
      stream: MediaStream | null,
      muted = false
    ) => {
      if (!el) return;

      try {
        el.muted = muted;

        if (el.srcObject !== stream) {
          el.srcObject = stream;
        }

        setTimeout(() => {
          el.play().catch((err) =>
            console.warn("Tile video play prevented:", err)
          );
        }, 50);
      } catch (err) {
        console.warn("Tile stream attach error:", err);
      }
    },
    []
  );

  useEffect(() => {
    attachToVideo(mainVideoRef.current, getMainStream(), mainVideo === "local");
  }, [getMainStream, mainVideo, attachToVideo]);

  const sidebarTiles = useMemo(() => {
    const arr: {
      key: string;
      label: string;
      stream: MediaStream | null;
      muted?: boolean;
      type: VideoType;
      ownerId?: string;
    }[] = [];

    if (mainVideo !== "local") {
      arr.push({
        key: "local",
        label: "You",
        stream: localStream,
        muted: true,
        type: "local",
      });
    }

    if (
      screenShareStream &&
      !(mainVideo === "screen" && mainScreenOwner === "local")
    ) {
      arr.push({
        key: "screen:local",
        label: "Your Screen",
        stream: screenShareStream,
        muted: true,
        type: "screen",
        ownerId: "local",
      });
    }

    remoteScreenEntries.forEach(([peerId, stream]) => {
      const isMain = mainVideo === "screen" && mainScreenOwner === peerId;
      if (!isMain)
        arr.push({
          key: `screen:${peerId}`,
          label: `Screen (${peerId})`,
          stream,
          muted: true,
          type: "screen",
          ownerId: peerId,
        });
    });

    if (remoteStream && mainVideo !== "remote") {
      arr.push({
        key: "remote",
        label: participants?.[1]?.username || "Remote",
        stream: remoteStream,
        muted: false,
        type: "remote",
      });
    }

    return arr;
  }, [
    localStream,
    screenShareStream,
    remoteStream,
    remoteScreenEntries,
    participants,
    mainVideo,
    mainScreenOwner,
  ]);

  useEffect(() => {
    sidebarTiles.forEach((t) => {
      attachToVideo(tileRefs.current[t.key], t.stream, true);
    });
  }, [sidebarTiles, attachToVideo]);

  useEffect(() => {
    if (pinned) return;

    if (isScreenSharing && screenShareStream) {
      setMainVideo("screen");
      setMainScreenOwner("local");
      return;
    }

    if (remoteScreenEntries.length > 0) {
      const [peerId] = remoteScreenEntries[0];
      setMainVideo("screen");
      setMainScreenOwner(peerId);
      return;
    }

    if (!isScreenSharing && remoteScreenEntries.length === 0) {
      setMainVideo(remoteStream ? "remote" : "local");
      setMainScreenOwner(null);
    }
  }, [
    isScreenSharing,
    screenShareStream,
    remoteScreenEntries,
    remoteStream,
    pinned,
  ]);

  const swapToMain = (tileKey: string) => {
    if (tileKey === "local") {
      setMainVideo("local");
      setMainScreenOwner(null);
      setPinned(false);
      return;
    }

    if (tileKey === "remote") {
      setMainVideo("remote");
      setMainScreenOwner(null);
      setPinned(false);
      return;
    }

    if (tileKey.startsWith("screen:")) {
      const owner = tileKey.split(":")[1];
      setMainVideo("screen");
      setMainScreenOwner(owner);
      setPinned(false);
      return;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const userRole = localStorage.getItem("user-role") || "user";

  const handleEndCall = async () => {
    setIsIntentionallyEnded(true);
    try {
      endCall();

      if (userRole === "user") {
        await VideoSessionApi.leaveSession(sessionId);
        navigate("/sessions/history");
      } else {
        await VideoSessionApi.endSession(sessionId);
        navigate("/developer/sessions/scheduled");
      }
    } catch (err) {
      navigate(
        userRole === "user"
          ? "/sessions/history"
          : "/developer/sessions/scheduled"
      );
    }
  };

  if (isLoading) return <Loading />;

  if ((error || !isConnected) && !isIntentionallyEnded) {
    return (
      <CallDisconnected
        error={error}
        callDuration={callDuration}
        formatDuration={formatDuration}
        onReturn={() =>
          navigate(
            userRole === "user"
              ? "/sessions/history"
              : "/developer/sessions/scheduled"
          )
        }
      />
    );
  }

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex flex-col overflow-hidden"
      >
        {/* ------------------------------ HEADER ------------------------------ */}
        <div className="px-4 py-3 border-b border-zinc-800/40 bg-black/60 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center">
              <Shield className="h-4 w-4 text-indigo-400" />
            </div>

            <div>
              <h3 className="text-white font-medium">
                {sessionData?.title || "Video Call"}
              </h3>
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Clock className="h-3 w-3" />
                {formatDuration(callDuration)}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-black/40 border border-zinc-800/60"
            >
              <LayoutGrid className="h-4 w-4 text-white" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-black/40 border border-zinc-800/60"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>

        {/* ------------------------------ MAIN AREA ------------------------------ */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex items-start justify-center p-6">
            <div className="relative w-full max-w-3xl aspect-video rounded-2xl bg-black/40 border border-zinc-800 shadow-2xl overflow-hidden">
              <video
                ref={mainVideoRef}
                autoPlay
                playsInline
                muted={mainVideo === "local"}
                className={cn(
                  "w-full h-full",
                  mainVideo === "screen"
                    ? "object-contain bg-black"
                    : "object-cover"
                )}
              />
              {isConnected &&
                !isLoading &&
                !isReconnecting &&
                participants.length <= 1 && (
                  <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <div className="h-14 w-14 rounded-full border-4 border-white/20 border-t-white animate-spin mb-4" />
                    <p className="text-lg font-medium">
                      {isHost
                        ? "Waiting for user to join…"
                        : "Connecting you to the developer…"}
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">
                      {isHost
                        ? "The user will join once they accept the call"
                        : "Please wait while the session connects"}
                    </p>
                  </div>
                )}

              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-zinc-700 text-sm text-white">
                {mainVideo === "screen" ? (
                  <>
                    <MonitorUp className="h-4 w-4 text-indigo-400" />
                    {mainScreenOwner === "local"
                      ? "Your Screen"
                      : `Screen (${mainScreenOwner})`}
                  </>
                ) : (
                  <>
                    {mainVideo === "local"
                      ? "You"
                      : participants?.[1]?.username || "Remote"}
                  </>
                )}

                {pinned && (
                  <span className="text-indigo-400 text-xs ml-2">(Pinned)</span>
                )}
              </div>
            </div>
          </div>

          {/* ------------------------------ RIGHT PANEL ------------------------------ */}
          <div className="hidden md:flex w-80 flex-col p-4 gap-4 overflow-y-auto border-l border-zinc-800/40 bg-black/30">
            <div className="text-zinc-300 text-sm px-1 mb-1">Participants</div>

            {sidebarTiles.length === 0 ? (
              <div className="text-zinc-500 text-xs px-2">No preview tiles</div>
            ) : (
              sidebarTiles.map((tile) => (
                <div
                  key={tile.key}
                  className="rounded-xl bg-black/40 border border-zinc-800/40 p-2 shadow-lg cursor-pointer hover:bg-black/50"
                  onClick={() => swapToMain(tile.key)}
                >
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
                    <video
                      ref={(el) => {
                        setTileRef(tile.key)(el);

                        if (!el || !tile.stream) return;

                        try {
                          if (el.srcObject !== tile.stream) {
                            el.srcObject = tile.stream;
                          }

                          setTimeout(() => {
                            el.play().catch(() => {});
                          }, 30);
                        } catch {}
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="mt-2 text-xs text-zinc-300 flex items-center gap-1">
                    {tile.type === "screen" && (
                      <MonitorUp className="h-3 w-3 text-indigo-400" />
                    )}
                    {tile.label}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ------------------------------ BOTTOM TOOLBAR ------------------------------ */}
        <div className="fixed bottom-0 left-0 right-0 py-4 bg-black/40 backdrop-blur-md border-t border-zinc-800/50">
          <div className="max-w-4xl mx-auto flex justify-center items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-12 w-12 rounded-full border backdrop-blur",
                isMuted
                  ? "bg-red-900/40 text-red-400 border-red-500/30"
                  : "bg-zinc-800/60 text-white"
              )}
              onClick={toggleMute}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-12 w-12 rounded-full border backdrop-blur",
                isVideoEnabled
                  ? "bg-zinc-800/60 text-white"
                  : "bg-red-900/40 text-red-400 border-red-500/30"
              )}
              onClick={toggleVideo}
            >
              {isVideoEnabled ? <Video /> : <VideoOff />}
            </Button>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-16 w-16 rounded-full bg-red-600 text-white shadow-xl"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-12 w-12 rounded-full border backdrop-blur",
                isScreenSharing
                  ? "bg-indigo-900/40 text-indigo-300 border-indigo-500/30"
                  : "bg-zinc-800/60 text-white"
              )}
              onClick={toggleScreenShare}
            >
              <Share />
            </Button>
          </div>
        </div>

        {/* ------------------------------ MOBILE TILES BOTTOM ------------------------------ */}
        <div className="md:hidden fixed bottom-20 left-0 right-0 bg-black/40 backdrop-blur z-40 px-2 py-3 overflow-x-auto flex gap-3">
          {sidebarTiles.map((tile) => (
            <div
              key={tile.key}
              className="min-w-[180px] h-[110px] rounded-xl bg-black/50 border border-zinc-700 overflow-hidden shadow cursor-pointer"
              onClick={() => swapToMain(tile.key)}
            >
              <video
                ref={(el) => {
                  setTileRef(tile.key)(el);

                  if (!el || !tile.stream) return;

                  try {
                    if (el.srcObject !== tile.stream) {
                      el.srcObject = tile.stream;
                    }

                    setTimeout(() => {
                      el.play().catch(() => {});
                    }, 30);
                  } catch {}
                }}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                {tile.label}
              </div>
            </div>
          ))}
        </div>

        {isReconnecting && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
            <div className="animate-spin h-12 w-12 border-4 border-white/30 border-t-white rounded-full"></div>
            <p className="mt-4 text-white text-sm">Reconnecting…</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
