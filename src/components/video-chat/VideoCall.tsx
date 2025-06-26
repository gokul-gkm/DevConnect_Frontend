import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Users,
  MoreVertical,
  Share,
  MonitorUp,
  Settings,
  Maximize,
  Clock,
  LayoutGrid,
  Shield,
  Volume2,
  VolumeX,
  LayoutPanelTop,
} from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useVideoCall } from "@/hooks/videoCall/useVideoCall";
import Loading from "./Loading";
import CallDisconnected from "./CallDisconnected";
import VideoChat from "./VideoChat";
import VideoSessionApi from "@/service/Api/VideoSessionApi";

const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs > 0 ? `${hrs}:` : ""}${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

type VideoType = 'remote' | 'local' | 'screen';

export default function VideoCall() {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const isHost = searchParams.get("host") === "true";
  
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const sideVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);

  const [layout, setLayout] = useState<"default" | "screenShare" | "grid">("default");
  const [chatOpen, setChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoOpacity, setVideoOpacity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mainVideo, setMainVideo] = useState<VideoType>('remote');

  const {
    localStream,
    remoteStreams,
    participants,
    screenShareStream,
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
  } = useVideoCall({
    sessionId,
    isHost,
    onError: (message) => {
      toast.error(message, {
        duration: 5000,
        style: {
          background: "#991b1b",
          color: "#fff",
          border: "1px solid #ef4444",
        },
      });
    },
  });


  const remoteStream = Array.from(remoteStreams.values())[0];

  const [isIntentionallyEnded, setIsIntentionallyEnded] = useState(false);

  useEffect(() => {
    if (!mainVideoRef.current || !sideVideoRef.current) return;

    mainVideoRef.current.srcObject = null;
    sideVideoRef.current.srcObject = null;

    switch (mainVideo) {
      case 'remote':
        if (remoteStream) {
          mainVideoRef.current.srcObject = remoteStream;
        }
        if (localStream && isVideoEnabled) {
          sideVideoRef.current.srcObject = localStream;
        }
        break;
        
      case 'local':
        if (localStream) {
          mainVideoRef.current.srcObject = localStream;
        }
        if (remoteStream) {
          sideVideoRef.current.srcObject = remoteStream;
        }
        break;
        
      case 'screen':
        if (screenShareStream) {
          mainVideoRef.current.srcObject = screenShareStream;
        }
        if (remoteStream) {
          sideVideoRef.current.srcObject = remoteStream;
        }
        break;
    }
  }, [mainVideo, localStream, remoteStream, screenShareStream, isVideoEnabled]);

  useEffect(() => {
    if (isScreenSharing && screenShareStream) {
      setMainVideo('screen');
      setLayout("screenShare");
    } else if (mainVideo === 'screen') {
      setMainVideo('remote');
      setLayout("default");
    }
  }, [isScreenSharing, screenShareStream]);


  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const userRole = localStorage.getItem('user-role') || 'user';

  const handleEndCall = async () => {
    console.log("[VideoCall Component] Ending call");
    setIsIntentionallyEnded(true);
    try {
      endCall();

      if (userRole === 'user') {
        await VideoSessionApi.leaveSession(sessionId);
        navigate("/sessions/history");
      } else {
      await VideoSessionApi.endSession(sessionId);
      navigate("/developer/sessions/scheduled");
    }
    } catch (error) {
      console.error("[VideoCall Component] Error ending call:", error);
      toast.error("Failed to end session properly");
    if (userRole === 'user') {
      navigate("/sessions/history");
    } else {
      navigate("/developer/sessions/scheduled");
    }
    } 
  };

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const switchVideoPosition = (videoType: VideoType) => {
    if (videoType === mainVideo) return; 
    
    if (videoType === 'screen' && !screenShareStream) return;
    
    if (videoType === 'local' && !isVideoEnabled && !localStream) return;
    
    setMainVideo(videoType);
  };

  const getMainStreamInfo = () => {
    switch (mainVideo) {
      case 'remote':
        return {
          stream: remoteStream,
          label: participants[1]?.username || "Remote User",
          avatar: participants[1]?.profilePicture,
          showAvatar: true
        };
      case 'local':
        return {
          stream: localStream,
          label: "You",
          avatar: null,
          showAvatar: false
        };
      case 'screen':
        return {
          stream: screenShareStream,
          label: "Screen Share",
          avatar: null,
          showAvatar: false
        };
      default:
        return null;
    }
  };

  const getSideStreamInfo = () => {

    if (mainVideo === 'remote') {
      return {
        stream: localStream,
        label: "You",
        isLocal: true,
        hasVideo: isVideoEnabled
      };
    } else {
      return {
        stream: remoteStream,
        label: participants[1]?.username || "Remote User",
        isLocal: false,
        hasVideo: true
      };
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if ((error || !isConnected) && !isIntentionallyEnded) {
    return (
      <CallDisconnected
        error={error}
        callDuration={callDuration}
        formatDuration={formatDuration}
        onReturn={() => navigate("/developer/sessions/scheduled")}
      />
    );
  }

  const mainStreamInfo = getMainStreamInfo();
  const sideStreamInfo = getSideStreamInfo();

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className={cn(
          "fixed inset-0 flex flex-col",
          "overflow-y-auto md:overflow-hidden",
           "p-4"
        )}
      >
        <div
          className={cn(
            "sticky top-0 z-50 px-4 py-3",
            "bg-black/60 backdrop-blur-sm border-b border-zinc-800/30",
            "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-indigo-950/80 border border-indigo-500/30">
              <Shield className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-medium text-white">
                {sessionData?.title || "Video Call"}
              </h3>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-indigo-400" />
                <span className="text-xs text-zinc-400">
                  {formatDuration(callDuration)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/60 backdrop-blur-md border border-zinc-800/80 text-white hover:bg-black/80 h-9 w-9 shadow-lg"
                  onClick={() =>
                    setLayout(layout === "grid" ? "default" : "grid")
                  }
                >
                  {layout === "grid" ? (
                    <LayoutPanelTop className="h-4 w-4" />
                  ) : (
                    <LayoutGrid className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-black/90 text-zinc-300 border-zinc-700/50"
              >
                <p>Change Layout</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/60 backdrop-blur-md border border-zinc-800/80 text-white hover:bg-black/80 h-9 w-9 shadow-lg"
                  onClick={toggleFullscreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-black/90 text-zinc-300 border-zinc-700/50"
              >
                <p>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/60 backdrop-blur-md border border-zinc-800/80 text-white hover:bg-black/80 h-9 w-9 shadow-lg"
                  onClick={() => setVideoOpacity(videoOpacity === 1 ? 0.7 : 1)}
                >
                  {videoOpacity === 1 ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-black/90 text-zinc-300 border-zinc-700/50"
              >
                <p>{videoOpacity === 1 ? "Dim Video" : "Brighten Video"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

    
        <div
          className={cn(
            "flex-grow relative flex mx-auto my-4",
            "w-full max-w-7xl",
            "flex-row gap-6",
            "rounded-2xl"
          )}
        >
          <div className="absolute inset-0  backdrop-blur-sm rounded-2xl"></div>

          <div 
            className={cn(
              "relative flex-grow",
              "w-2/3",
              "aspect-[16/9]",
              "rounded-2xl overflow-hidden",
              "border-2 border-zinc-800/40",
              "bg-black/40",
              "shadow-[0_8px_30px_rgba(0,0,0,0.7)]",
              "hover:border-indigo-500/30 transition-colors duration-300",
              "cursor-pointer"
            )}
            onClick={() => {
              if (mainVideo === 'remote') {
                if (isVideoEnabled && localStream) {
                  switchVideoPosition('local');
                } else if (screenShareStream) {
                  switchVideoPosition('screen');
                }
              } else if (mainVideo === 'local') {
                if (screenShareStream) {
                  switchVideoPosition('screen');
                } else {
                  switchVideoPosition('remote');
                }
              } else {
                switchVideoPosition('remote');
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            
            <video
              ref={mainVideoRef}
              className={cn(
                "w-full h-full object-cover",
                mainVideo === 'screen' ? "object-contain bg-black" : ""
              )}
              autoPlay
              playsInline
              muted={mainVideo === 'local'}
              style={{ opacity: mainVideo === 'local' ? 1 : videoOpacity }}
            />

            {mainStreamInfo && (
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm flex items-center gap-3 border border-zinc-800/80 shadow-lg">
                {mainVideo === 'screen' && <MonitorUp className="h-4 w-4 text-indigo-400" />}
                {mainStreamInfo.showAvatar && (
                  <div className="h-6 w-6 rounded-full overflow-hidden shadow-inner border border-indigo-500/30">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={mainStreamInfo.avatar || undefined} />
                      <AvatarFallback className="bg-indigo-900/80 text-white text-xs">
                        {mainStreamInfo.label[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                {mainStreamInfo.label}
              </div>
            )}
          </div>

          <div className="w-1/3 flex flex-col gap-4">
    
            <motion.div
              layout
              className={cn(
                "overflow-hidden rounded-xl",
                "w-full",
                "aspect-[16/9]",
                "border-2 border-zinc-800/40",
                "bg-black/40",
                "shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
                "hover:border-indigo-500/30 transition-colors duration-300",
                "cursor-pointer"
              )}
              onClick={() => {
                if (sideStreamInfo?.isLocal) {
                  switchVideoPosition('local');
                } else {
                  switchVideoPosition('remote');
                }
              }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-xl bg-zinc-950">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                
                {sideStreamInfo?.stream && (sideStreamInfo.isLocal ? isVideoEnabled : true) ? (
                  <video
                    ref={sideVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted={sideStreamInfo.isLocal}
                    style={{ opacity: sideStreamInfo.isLocal ? 1 : videoOpacity }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm">
                    <Avatar className="h-12 w-12 mb-2 ring-2 ring-indigo-500/20">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white text-lg">
                        {sideStreamInfo?.label?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-zinc-400 text-sm">
                      {sideStreamInfo?.isLocal && !isVideoEnabled ? "Camera Off" : "No Video"}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs flex items-center gap-2 border border-zinc-800/60">
                  {sideStreamInfo?.isLocal && isMuted && <MicOff className="h-3 w-3 text-red-500" />}
                  {sideStreamInfo?.label}
                </div>
              </div>
            </motion.div>

            {isScreenSharing && mainVideo !== 'screen' && (
              <div 
                className={cn(
                  "relative w-full aspect-[16/9]",
                  "rounded-xl overflow-hidden",
                  "border-2 border-zinc-800/40",
                  "bg-black/40",
                  "shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
                  "hover:border-indigo-500/30 transition-colors duration-300",
                  "cursor-pointer"
                )}
                onClick={() => switchVideoPosition('screen')}
              >
                <video
                  ref={screenShareRef}
                  className="w-full h-full object-contain"
                  autoPlay
                  playsInline
                  style={{ opacity: videoOpacity }}
                />
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs flex items-center gap-2 border border-zinc-800/60">
                  <MonitorUp className="h-3 w-3 text-indigo-400" />
                  Screen Share
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "sticky bottom-0 z-30",
            "py-4 px-2 sm:px-4"
          )}
        >
          <div className="max-w-7xl mx-auto flex justify-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 sm:h-12 sm:w-12",
                "rounded-full backdrop-blur-md",
                isMuted
                  ? "bg-red-900/20 text-red-400 border border-red-500/30"
                  : "bg-zinc-800/70 text-white border border-zinc-700/50"
              )}
              onClick={toggleMute}
            >
              {isMuted ? (
                <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 sm:h-12 sm:w-12",
                "rounded-full backdrop-blur-md",
                isVideoEnabled
                  ? "bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70"
                  : "bg-red-900/20 text-red-400 border border-red-500/30"
              )}
              onClick={toggleVideo}
            >
              {isVideoEnabled ? (
                <Video className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <VideoOff className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-14 w-14 sm:h-16 sm:w-16",
                  "rounded-full bg-red-600/90 text-white border border-red-500/50 hover:bg-red-700 shadow-xl shadow-red-900/20"
                )}
                onClick={handleEndCall}
              >
                <PhoneOff className="h-6 w-6 sm:h-7 sm:w-7" />
              </Button>
            </motion.div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 sm:h-12 sm:w-12",
                    "rounded-full backdrop-blur-md",
                    isScreenSharing
                      ? "bg-indigo-900/20 text-indigo-400 border border-indigo-500/30"
                      : "bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70"
                  )}
                  onClick={toggleScreenShare}
                >
                  <Share className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black/90 text-zinc-300 border-zinc-700/50"
              >
                <p>{isScreenSharing ? "Stop sharing" : "Share screen"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 sm:h-12 sm:w-12",
                    "rounded-full backdrop-blur-md",
                    chatOpen
                      ? "bg-indigo-900/20 text-indigo-400 border border-indigo-500/30"
                      : "bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70"
                  )}
                  onClick={() => setChatOpen(!chatOpen)}
                >
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black/90 text-zinc-300 border-zinc-700/50"
              >
                <p>{chatOpen ? "Close chat" : "Open chat"}</p>
              </TooltipContent>
            </Tooltip>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full backdrop-blur-md bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70 shadow-lg"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-black/90 backdrop-blur-xl border border-zinc-800/80 text-white rounded-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)]">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/70 rounded-xl"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Audio settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/70 rounded-xl"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Participants
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/70 rounded-xl"
                    onClick={toggleFullscreen}
                  >
                    <Maximize className="h-4 w-4 mr-2" />
                    {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  </Button>
                  <hr className="border-zinc-800/80 my-1" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-300 hover:text-red-400 hover:bg-zinc-800/70 rounded-xl"
                    onClick={handleEndCall}
                  >
                    <PhoneOff className="h-4 w-4 mr-2 text-red-500" />
                    End call
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <AnimatePresence>
          {chatOpen && <VideoChat onClose={() => setChatOpen(false)} />}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}