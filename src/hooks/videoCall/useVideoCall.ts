import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { socketService } from "@/service/socket/socketService";
import { webRTCService } from "@/service/webrtc/webRTCService";

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

export function useVideoCall({
  sessionId,
  isHost = false,
  onError,
}: UseVideoCallProps): UseVideoCallReturn {
  const memoSessionId = useMemo(() => sessionId, [sessionId]);

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
  const isInitializingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const userRole =
    (localStorage.getItem("user-role") as "user" | "developer") || "user";

  const TIMER_KEY = `call-start-${sessionId}`;

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

  useEffect(() => {
    mountedRef.current = true;

    const initialize = async () => {
      if (isReconnecting || isInitializingRef.current) return;

      isInitializingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const socketReady = await socketService.waitForConnection();
        if (!socketReady) throw new Error("Signaling server unavailable");

        const stream = await webRTCService.startLocalStream({
          audio: true,
          video: true,
        });
        if (!stream) throw new Error("Failed to access camera/microphone");

        const ok = await webRTCService.initialize(
          memoSessionId,
          userRole,
          isHost
        );
        if (!ok) throw new Error("Failed to initialize WebRTC");

        if (!mountedRef.current) return;

        setLocalStream(stream);
        setIsConnected(true);
        setIsLoading(false);

        let start = localStorage.getItem(TIMER_KEY);
        if (!start) {
          start = Date.now().toString();
          localStorage.setItem(TIMER_KEY, start);
        }
        startTimer(parseInt(start));
      } catch (err: any) {
        setError(err.message);
        setIsConnected(false);
        onError?.(err.message);
      } finally {
        isInitializingRef.current = false;
      }
    };

    initialize();
    return () => {
      mountedRef.current = false;
    };
  }, [memoSessionId, isHost, isReconnecting]);

  useEffect(() => {
    const list: VideoCallParticipant[] = [
      {
        id: "local",
        stream: localStream,
        role: userRole,
        username: "You",
        profilePicture: localStorage.getItem("user-profile-pic") || undefined,
      },
    ];

    remoteStreams.forEach((stream, id) => {
      list.push({ id, stream, role: "user", username: "Remote" });
    });

    setParticipants(list);
  }, [localStream, remoteStreams, remoteScreenStreams]);

  useEffect(() => {
    const onDisconnect = () => {
      setIsReconnecting(true);
      setIsConnected(false);
    };

    const onConnect = async () => {
      setIsReconnecting(true);

      try {
        await webRTCService.reconnect(sessionId);
        await webRTCService.renegotiateAllPeers();

        setIsConnected(true);
        setIsReconnecting(false);
      } catch {
        setIsReconnecting(true);
      }
    };

    socketService.on("disconnect", onDisconnect);
    socketService.on("connect", onConnect);

    return () => {
      socketService.off("disconnect", onDisconnect);
      socketService.off("connect", onConnect);
    };
  }, [sessionId]);

  const toggleMute = useCallback(async () => {
  if (!localStream) return;

  const audioTrack = localStream.getAudioTracks()[0];
  if (!audioTrack) return;

  const nextEnabled = !audioTrack.enabled;

  if (await webRTCService.toggleAudio(nextEnabled)) {
    setIsMuted(!nextEnabled);
  }
}, [localStream]);

  const toggleVideo = useCallback(async () => {
    if (!localStream) return;
    if (await webRTCService.toggleVideo(!isVideoEnabled)) {
      setIsVideoEnabled((v) => !v);
    }
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

  const endCall = useCallback(() => {
    stopTimer();
    localStorage.removeItem(TIMER_KEY);

    localStream?.getTracks().forEach((t) => t.stop());

    webRTCService.leaveRoom();
    webRTCService.cleanup();

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
