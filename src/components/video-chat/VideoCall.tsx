import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, 
  Users, MoreVertical, Share, MonitorUp, Settings, 
  Maximize, Clock, LayoutGrid, Shield,
  X, Volume2, VolumeX, Sparkles, ZoomIn, 
  LayoutPanelTop, UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// This would be implemented based on your WebRTC/Socket.io setup
const useVideoCall = (sessionId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [sessionData, setSessionData] = useState<any>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      setSessionData({
        title: "React Advanced State Management",
        user: {
          username: "Sarah Parker",
          profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        }
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [sessionId]);
  
  // Mock call duration timer
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected]);
  
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoEnabled(!isVideoEnabled);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);
  const endCall = () => setIsConnected(false);
  
  return {
    isConnected,
    isLoading,
    isMuted,
    isVideoEnabled,
    isScreenSharing,
    error,
    callDuration,
    sessionData,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    endCall
  };
};

const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function VideoCall() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  
  const [layout, setLayout] = useState<'default' | 'screenShare' | 'grid'>('default');
  const [chatOpen, setChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [videoOpacity, setVideoOpacity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    isConnected,
    isLoading,
    isMuted,
    isVideoEnabled,
    isScreenSharing,
    error,
    callDuration,
    sessionData,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    endCall
  } = useVideoCall(sessionId);

  // Set up local video preview
  useEffect(() => {
    if (isVideoEnabled && localVideoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error('Error accessing media devices:', err));
    }
    
    // Cleanup function to stop all tracks when component unmounts
    return () => {
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoEnabled]);
  
  // Mock remote video with a timer for demonstration
  useEffect(() => {
    if (isConnected && remoteVideoRef.current) {
      // In a real implementation, this would come from your WebRTC connection
      setTimeout(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then(stream => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            }
          })
          .catch(err => console.error('Error simulating remote video:', err));
      }, 1000);
    }
  }, [isConnected]);
  
  // Update layout based on screen sharing state
  useEffect(() => {
    if (isScreenSharing) {
      setLayout('screenShare');
    } else {
      setLayout('default');
    }
  }, [isScreenSharing]);
  
  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    };
    
    if (isConnected) {
      window.addEventListener('mousemove', handleMouseMove);
      timeout = setTimeout(() => setShowControls(false), 5000);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isConnected]);
  
  // Handle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  const handleEndCall = () => {
    endCall();
    navigate('/developer/sessions/scheduled');
  };

  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex flex-col items-center justify-center z-50">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-2xl"></div>
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-[3px] border-zinc-800/80 shadow-[0_0_25px_rgba(0,0,0,0.3)]"></div>
            <div className="w-24 h-24 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin absolute"></div>
            <div className="w-24 h-24 rounded-full border-2 border-transparent border-b-purple-500/70 animate-spin absolute" style={{ animationDuration: '1.5s' }}></div>
            <div className="absolute flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-indigo-400/90" />
            </div>
          </div>
        </div>
        <h2 className="text-xl font-medium text-white mb-2">Connecting to Session</h2>
        <p className="text-zinc-400 text-sm flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          Setting up secure connection...
        </p>
      </div>
    );
  }
  
  if (error || !isConnected) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex flex-col items-center justify-center z-50 p-4">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl blur-2xl"></div>
          <div className="relative bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-800/80 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)] text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl"></div>
              <div className="relative bg-zinc-900/80 rounded-full w-full h-full flex items-center justify-center border border-zinc-700/50">
                <PhoneOff className="w-7 h-7 text-indigo-400" />
              </div>
            </div>
            
            <h2 className="text-xl font-medium text-white mb-2">
              {error ? "Connection Failed" : "Call Ended"}
            </h2>
            
            {!error && (
              <p className="text-indigo-300 mb-1 text-sm font-medium">
                Duration: {formatDuration(callDuration)}
              </p>
            )}
            
            <p className="text-zinc-400 mb-6 text-sm">
              {error ? error : "The call has been disconnected"}
            </p>
            
            <Button 
              onClick={() => navigate('/developer/scheduled-sessions')}
              className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl py-2 px-6 mx-auto border border-zinc-700/50 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.3)]"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <div 
        ref={containerRef}
        className={cn(
          "fixed inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex flex-col overflow-hidden",
          isCompact ? "p-4" : ""
        )}
        onMouseMove={() => setShowControls(true)}
      >

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-3xl opacity-20"></div>
        </div>
        
        <div className="absolute top-4 right-4 z-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 shadow-lg"
                onClick={() => setIsCompact(!isCompact)}
              >
                {isCompact ? <ZoomIn className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isCompact ? 'Expand' : 'Compact Mode'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
  
        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "absolute top-0 left-0 right-0 z-30 px-6 flex justify-between items-center",
                isCompact ? "h-14 bg-black/80 backdrop-blur-md" : "h-20 bg-gradient-to-b from-black via-black/70 to-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-950/80 border border-indigo-500/30 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]">
                  <Shield className="h-4 w-4 text-indigo-400" />
                </div>
                
                <div>
                  <h3 className={cn(
                    "font-medium text-white",
                    isCompact ? "text-sm" : "text-lg"
                  )}>
                    {sessionData?.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span className="text-xs text-zinc-400">{formatDuration(callDuration)}</span>
                  </div>
                </div>
              </div>
              
              {!isCompact && (
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="rounded-full bg-black/60 backdrop-blur-md border border-zinc-800/80 text-white hover:bg-black/80 h-9 w-9 shadow-lg"
                        onClick={() => setLayout(layout === 'grid' ? 'default' : 'grid')}
                      >
                        {layout === 'grid' ? 
                          <LayoutPanelTop className="h-4 w-4" /> : 
                          <LayoutGrid className="h-4 w-4" />
                        }
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-black/90 text-zinc-300 border-zinc-700/50">
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
                    <TooltipContent side="bottom" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                      <p>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</p>
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
                        {videoOpacity === 1 ? 
                          <Volume2 className="h-4 w-4" /> : 
                          <VolumeX className="h-4 w-4" />
                        }
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                      <p>{videoOpacity === 1 ? 'Dim Video' : 'Brighten Video'}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className={cn(
          "flex-grow relative flex mx-auto my-4",
          windowSize.width < 768 ? "max-w-full px-2" : "max-w-6xl",
          isCompact ? "rounded-xl overflow-hidden shadow-2xl border border-zinc-800/80" : 
            "rounded-2xl overflow-hidden border border-zinc-800/40 shadow-[0_8px_30px_rgba(0,0,0,0.3)]",
          layout === 'default' ? "flex-col" : 
          layout === 'screenShare' ? "flex-col" : 
          "grid grid-cols-2 gap-2",
          !isCompact && (windowSize.width < 768 ? "h-[60vh]" : "h-[75vh] aspect-video")
        )}>

          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 to-black/95 backdrop-blur-sm"></div>
          
          {isScreenSharing && layout === 'screenShare' && (
            <div className="flex-grow relative">
              <video 
                ref={screenShareRef}
                className="w-full h-full object-contain bg-black"
                autoPlay
                playsInline
                style={{ opacity: videoOpacity }}
              />
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-sm flex items-center gap-2 border border-zinc-800/80 shadow-lg">
                <MonitorUp className="h-4 w-4 text-indigo-400" />
                Screen Share
              </div>
            </div>
          )}
          
          <div className={cn(
            "relative",
            layout === 'default' ? "flex-grow" : 
            layout === 'screenShare' ? "h-1/4" : 
            "col-span-1 h-full",
            isCompact && layout === 'default' ? "aspect-video" : "",
            "p-2"
          )}>
            <div className="relative w-full h-full overflow-hidden rounded-xl border border-zinc-800/60">
              <video 
                ref={remoteVideoRef}
                className={cn(
                  "object-cover bg-zinc-900 w-full h-full rounded-xl",
                  layout === 'default' ? "" : 
                  layout === 'screenShare' ? "" : 
                  ""
                )}
                autoPlay
                playsInline
                style={{ opacity: videoOpacity }}
              />
              
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-sm flex items-center gap-2 border border-zinc-800/80 shadow-lg">
                <div className="h-5 w-5 rounded-full overflow-hidden shadow-inner border border-indigo-500/30">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={sessionData?.user?.profilePicture} />
                    <AvatarFallback className="bg-indigo-900/80 text-white text-xs">
                      {sessionData?.user?.username?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {sessionData?.user?.username}
              </div>
            </div>
          </div>
          
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "overflow-hidden rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-zinc-800/80",
              layout === 'default' ? 
                isCompact ? 
                  "absolute bottom-20 right-4 w-28 z-20" : 
                  "absolute top-4 right-4 w-40 max-h-32 z-20"
              : 
              layout === 'screenShare' ? 
                "absolute top-4 right-4 w-40 max-h-32 z-20" :
                "col-span-1 h-full relative"
            )}
            drag={layout !== 'grid'}
            dragConstraints={containerRef}
            dragElastic={0.1}
            dragMomentum={false}
          >
            <div className="relative w-full h-full overflow-hidden rounded-xl bg-zinc-950">
              {isVideoEnabled ? (
                <video 
                  ref={localVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm">
                  <Avatar className={cn(
                    "mb-1", 
                    isCompact ? "h-8 w-8" : "h-10 w-10"
                  )}>
                    <AvatarFallback className="bg-indigo-900/80 text-white text-xs">
                      You
                    </AvatarFallback>
                  </Avatar>
                  {!isCompact && <span className="text-zinc-400 text-[10px]">Camera Off</span>}
                </div>
              )}
              
              <div className="absolute bottom-1 right-1 bg-black/90 backdrop-blur-md px-1.5 py-0.5 rounded text-white text-[10px] flex items-center gap-1 border border-zinc-800/60">
                {isMuted && <MicOff className="h-2 w-2 text-red-500" />}
                You
              </div>
            </div>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {chatOpen && !isCompact && (
            <motion.div 
              initial={{ x: 350, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 350, opacity: 0 }}
              transition={{ type: 'spring', damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-[320px] bg-black/90 backdrop-blur-xl border-l border-zinc-800/80 z-40 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.3)]"
            >
              <div className="flex justify-between items-center p-4 border-b border-zinc-800/80">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  Chat
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-zinc-400 hover:text-white rounded-full h-8 w-8 bg-zinc-900/80 border border-zinc-800/60"
                  onClick={() => setChatOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-grow p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                <div className="text-center text-zinc-500 py-10 flex flex-col items-center">
                  <MessageSquare className="h-8 w-8 text-zinc-700 mb-2" />
                  No messages yet
                </div>
              </div>
              
              <div className="p-4 border-t border-zinc-800/80">
                <textarea 
                  className="w-full bg-zinc-900/80 border border-zinc-800/60 rounded-xl p-3 text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 shadow-inner"
                  placeholder="Type a message..."
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-900/20 border border-indigo-500/30"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "relative z-30",
                isCompact ? "h-16" : "h-20"
              )}
            >
              <div className={cn(
                "absolute inset-0",
                isCompact ? "bg-black/80 backdrop-blur-md" : "bg-gradient-to-t from-black via-black/70 to-transparent"
              )}></div>
              
              <div className="relative h-full flex items-center justify-center gap-3">
                {isCompact ? (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={cn(
                            "h-10 w-10 rounded-full backdrop-blur-md",
                            isMuted ? 
                              "bg-red-900/20 text-red-400 border border-red-500/30" : 
                              "bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70"
                          )}
                          onClick={toggleMute}
                        >
                          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                        <p>{isMuted ? 'Unmute' : 'Mute'}</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={cn(
                            "h-10 w-10 rounded-full backdrop-blur-md",
                            isVideoEnabled ? 
                              "bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70" : 
                              "bg-red-900/20 text-red-400 border border-red-500/30" 
                          )}
                          onClick={toggleVideo}
                        >
                          {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                        <p>{isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-10 w-10 rounded-full bg-red-600/90 text-white border border-red-500/50 hover:bg-red-700 shadow-lg shadow-red-900/20"
                          onClick={handleEndCall}
                        >
                          <PhoneOff className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                        <p>End call</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={cn(
                            "h-12 w-12 rounded-full backdrop-blur-md shadow-lg",
                            isMuted ? 
                              "bg-red-900/20 text-red-400 border border-red-500/30" : 
                              "bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70"
                          )}
                          onClick={toggleMute}
                        >
                          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                        <p>{isMuted ? 'Unmute' : 'Mute'}</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={cn(
                            "h-12 w-12 rounded-full backdrop-blur-md shadow-lg",
                            isVideoEnabled ? 
                              "bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70" : 
                              "bg-red-900/20 text-red-400 border border-red-500/30" 
                          )}
                          onClick={toggleVideo}
                        >
                          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                        <p>{isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-14 w-14 rounded-full bg-red-600/90 text-white border border-red-500/50 hover:bg-red-700 shadow-xl shadow-red-900/20"
                            onClick={handleEndCall}
                          >
                            <PhoneOff className="h-6 w-6" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                          <p>End call</p>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={cn(
                            "h-12 w-12 rounded-full backdrop-blur-md shadow-lg",
                            isScreenSharing ? 
                              "bg-indigo-900/20 text-indigo-400 border border-indigo-500/30" : 
                              "bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70"
                          )}
                          onClick={toggleScreenShare}
                        >
                          <Share className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                        <p>{isScreenSharing ? 'Stop sharing' : 'Share screen'}</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={cn(
                            "h-12 w-12 rounded-full backdrop-blur-md shadow-lg",
                            chatOpen ? 
                              "bg-indigo-900/20 text-indigo-400 border border-indigo-500/30" : 
                              "bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70"
                          )}
                          onClick={() => setChatOpen(!chatOpen)}
                        >
                          <MessageSquare className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                        <p>{chatOpen ? 'Close chat' : 'Open chat'}</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-12 w-12 rounded-full backdrop-blur-md bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70 shadow-lg"
                        >
                          <UserPlus className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                        <p>Invite participant</p>
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
                            {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
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
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {!showControls && !isCompact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="h-10 w-10 rounded-full bg-black/80 backdrop-blur-md border border-zinc-800/80 flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                onClick={() => setShowControls(true)}
              >
                <MoreVertical className="h-5 w-5 text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
