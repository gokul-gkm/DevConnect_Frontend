import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { socketService } from "@/service/socket/socketService";
import { webRTCService } from "@/service/webrtc/webRTCService";

/* ============================ TYPES ============================ */

interface UseVideoCallProps {
  sessionId: string;
  isHost?: boolean;
  onError?: (error: string) => void;
}

interface VideoCallParticipant {
  id: string;
  stream: MediaStream | null;
  role: "user" | "developer";
  username?: string;
  profilePicture?: string;
}

interface UseVideoCallReturn {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  remoteScreenStreams: Map<string, MediaStream>;
  participants: VideoCallParticipant[];
  screenShareStream: MediaStream | null;

  isMuted: boolean;
  isVideoEnabled: boolean;
  isConnected: boolean;
  isLoading: boolean;
  isScreenSharing: boolean;

  callDuration: number;
  error: string | null;
  sessionData: any;
  isReconnecting: boolean;

  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  endCall: () => void;
}

/* ============================ HOOK ============================ */

export function useVideoCall({
  sessionId,
  isHost = false,
  onError,
}: UseVideoCallProps): UseVideoCallReturn {
  const memoSessionId = useMemo(() => sessionId, [sessionId]);

  const userRole =
    (localStorage.getItem("user-role") as "user" | "developer") || "user";

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState(
    new Map<string, MediaStream>()
  );
  const [remoteScreenStreams, setRemoteScreenStreams] = useState(
    new Map<string, MediaStream>()
  );

  const [screenShareStream, setScreenShareStream] =
    useState<MediaStream | null>(null);

  const [participants, setParticipants] = useState<VideoCallParticipant[]>([]);
  const [sessionData] = useState<any>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const initializingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const TIMER_KEY = `call-start-${sessionId}`;

  /* ============================ TIMER ============================ */

  const startTimer = (startTs: number) => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - startTs) / 1000));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  /* ============================ WEBRTC CALLBACKS ============================ */

  useEffect(() => {
    webRTCService.onTrack((stream, peerId) => {
      const isScreen = stream
        .getVideoTracks()
        .some((t) => t.label.toLowerCase().includes("screen"));

      if (isScreen) {
        setRemoteScreenStreams((p) => new Map(p).set(peerId, stream));
      } else {
        setRemoteStreams((p) => new Map(p).set(peerId, stream));
      }
    });

    webRTCService.onParticipantDisconnected((peerId) => {
      setRemoteStreams((p) => {
        const m = new Map(p);
        m.delete(peerId);
        return m;
      });

      setRemoteScreenStreams((p) => {
        const m = new Map(p);
        m.delete(peerId);
        return m;
      });
    });
  }, []);

  /* ============================ INIT ============================ */


  useEffect(() => {
    console.log("🎬 [useVideoCall] Initialization effect triggered", {
      sessionId: memoSessionId,
      userRole,
      isHost,
      isReconnecting
    });
    mountedRef.current = true;

    const initialize = async () => {

      if (initializingRef.current) {
        console.log("⏭️ [useVideoCall] Already initializing, skipping");
        return;
      }
    
      if (isReconnecting) {
        console.log("⏭️ [useVideoCall] Reconnecting in progress, skipping normal init");
        return;
      }
      
      if (localStream && isConnected) {
        console.log("⏭️ [useVideoCall] Already initialized with stream, skipping");
        return;
      }
      
      console.log("🚀 [useVideoCall] Starting initialization");
      initializingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        console.log("⏳ [useVideoCall] Step 1: Waiting for socket connection");
        const socketReady = await socketService.waitForConnection();
        if (!socketReady) {
          console.error("❌ [useVideoCall] Socket connection failed");
          throw new Error("Signaling server unavailable");
        }
        console.log("✅ [useVideoCall] Socket connected");

        console.log("📹 [useVideoCall] Step 2: Getting local media stream");
        const stream = await webRTCService.startLocalStream();
        if (!stream) {
          console.error("❌ [useVideoCall] Media stream failed");
          throw new Error("Camera/Microphone permission denied");
        }
        console.log("✅ [useVideoCall] Local stream obtained", {
          audioTracks: stream.getAudioTracks().length,
          videoTracks: stream.getVideoTracks().length
        });

        console.log("🔧 [useVideoCall] Step 3: Initializing WebRTC", {
          sessionId: memoSessionId,
          role: userRole
        });
        const ok = await webRTCService.initialize(
          memoSessionId,
          userRole
        );
        if (!ok) {
          console.error("❌ [useVideoCall] WebRTC initialization failed");
          throw new Error("WebRTC initialization failed");
        }
        console.log("✅ [useVideoCall] WebRTC initialized");

        if (!mountedRef.current) {
          console.warn("⚠️ [useVideoCall] Component unmounted during init");
          return
        };

        console.log("✅ [useVideoCall] Step 4: Setting up local stream and state");
        setLocalStream(stream);
        setIsConnected(true);
        setIsLoading(false);

        let start = localStorage.getItem(TIMER_KEY);
        if (!start) {
          start = Date.now().toString();
          localStorage.setItem(TIMER_KEY, start);
          console.log("⏱️ [useVideoCall] Call timer started");
        } else {
          console.log("⏱️ [useVideoCall] Resuming existing call timer");
        }
        startTimer(parseInt(start));

        console.log("🎉 [useVideoCall] Initialization complete");
      } catch (err: any) {
        console.error("❌ [useVideoCall] Initialization error:", err);
        setError(err.message);
        setIsConnected(false);
        onError?.(err.message);
      } finally {
        initializingRef.current = false;
        console.log("🏁 [useVideoCall] Initialization finished");
      }
    };

    initialize();

    return () => {
      console.log("🧹 [useVideoCall] Cleanup");
      mountedRef.current = false;
    };
  }, [memoSessionId, userRole, isHost, isReconnecting, localStream, isConnected]);

  /* ============================ PARTICIPANTS ============================ */

  useEffect(() => {
    console.log("👥 [useVideoCall] Participants effect triggered", {
      localStream: !!localStream,
      remoteStreamsCount: remoteStreams.size
    });
    const list: VideoCallParticipant[] = [
      {
        id: "local",
        stream: localStream,
        role: userRole,
        username: "You",
        profilePicture:
          localStorage.getItem("user-profile-pic") || undefined,
      },
    ];

    remoteStreams.forEach((stream, id) => {
      console.log("👥 [useVideoCall] Adding remote participant:", id);
      list.push({
        id,
        stream,
        role: "user",
        username: "Remote",
      });
    });
    console.log("👥 [useVideoCall] Total participants:", list.length);
    setParticipants(list);
  }, [localStream, remoteStreams, userRole]);



  /* ============================ SOCKET RECONNECT ============================ */

  useEffect(() => {
    console.log("🔄 [useVideoCall] Socket reconnect effect triggered");

    const onDisconnect = () => {
      console.log("🔴 [useVideoCall] Socket disconnected");
      setIsReconnecting(true);
      setIsConnected(false);
    };

    const onConnect = async () => {
      console.log("🟢 [useVideoCall] Socket reconnected, reinitializing");
      try {
        setIsReconnecting(true);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log("📹 [useVideoCall] Reconnect: Getting local media stream");
        const stream = await webRTCService.startLocalStream();
        if (!stream) {
          console.error("❌ [useVideoCall] Reconnect: Media stream failed");
          throw new Error("Camera/Microphone permission denied");
        }
        console.log("✅ [useVideoCall] Reconnect: Local stream obtained");
        
        // Initialize WebRTC
        const ok = await webRTCService.initialize(memoSessionId, userRole);
        if (!ok) {
          console.error("❌ [useVideoCall] Reconnect: WebRTC initialization failed");
          throw new Error("WebRTC initialization failed");
        }
        
        if (mountedRef.current) {
          setLocalStream(stream);
          setIsConnected(true);
          setIsLoading(false);
          
          let start = localStorage.getItem(TIMER_KEY);
          if (!start) {
            start = Date.now().toString();
            localStorage.setItem(TIMER_KEY, start);
            console.log("⏱️ [useVideoCall] Reconnect: Call timer started");
          } else {
            console.log("⏱️ [useVideoCall] Reconnect: Resuming existing call timer");
          }
          startTimer(parseInt(start));
        }
        
        console.log("✅ [useVideoCall] Reconnection complete");
      } catch(err) {
        console.error("❌ [useVideoCall] Reconnection failed:", err);
        setIsConnected(false);
        setError(err instanceof Error ? err.message : "Reconnection failed");
      } finally {
        setIsReconnecting(false);
      }
    };

    socketService.on("disconnect", onDisconnect);
    socketService.on("connect", onConnect);

    return () => {
      console.log("🧹 [useVideoCall] Removing reconnect listeners");
      socketService.off("disconnect", onDisconnect);
      socketService.off("connect", onConnect);
    };
  }, [memoSessionId, userRole]);

  /* ============================ CONTROLS ============================ */

  const toggleMute = useCallback(() => {
    if (!localStream) return;
    const track = localStream.getAudioTracks()[0];
    if (!track) return;

    const next = !track.enabled;
    webRTCService.toggleAudio(next);
    setIsMuted(!next);
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (!localStream) return;
    webRTCService.toggleVideo(!isVideoEnabled);
    setIsVideoEnabled((v) => !v);
  }, [localStream, isVideoEnabled]);

  const toggleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) {
        await webRTCService.stopScreenSharing();
        setScreenShareStream(null);
        setIsScreenSharing(false);
      } else {
        const s = await webRTCService.startScreenSharing();
        if (s) {
          setScreenShareStream(s);
          setIsScreenSharing(true);
        }
      }
    } catch (err: any) {
      setError(err.message);
      onError?.(err.message);
    }
  }, [isScreenSharing]);

  /* ============================ END CALL ============================ */

  const endCall = useCallback(() => {
    stopTimer();
    localStorage.removeItem(TIMER_KEY);

    localStream?.getTracks().forEach((t) => t.stop());

    webRTCService.leaveRoom();
    webRTCService.cleanup(false);

    setLocalStream(null);
    setRemoteStreams(new Map());
    setRemoteScreenStreams(new Map());
    setIsConnected(false);
  }, [localStream]);

  return {
    localStream,
    remoteStreams,
    remoteScreenStreams,
    participants,

    screenShareStream,
    isMuted,
    isVideoEnabled,
    isScreenSharing,

    isConnected,
    isLoading,
    isReconnecting,

    callDuration,
    error,
    sessionData,

    toggleMute,
    toggleVideo,
    toggleScreenShare,
    endCall,
  };
}
