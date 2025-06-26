import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { socketService } from '@/service/socket/socketService';
import { webRTCService } from '@/service/webrtc/webRTCService';

interface UseVideoCallProps {
  sessionId: string;
  isHost?: boolean;
  onError?: (error: string) => void;
}

interface VideoCallParticipant {
  id: string;
  stream: MediaStream | null;
  role: 'user' | 'developer';
  username?: string;
  profilePicture?: string;
}

interface ParticipantData {
  id: string;
  role: 'user' | 'developer';
  username: string;
  profilePicture?: string;
}

interface UseVideoCallReturn {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
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
  
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  endCall: () => void;
}

export function useVideoCall({ sessionId, isHost = false, onError }: UseVideoCallProps): UseVideoCallReturn {
  const memoizedSessionId = useMemo(() => sessionId, [sessionId]);
  const memoizedIsHost = useMemo(() => isHost, [isHost]);
  
  console.log('[useVideoCall Step 1] Initializing video call hook', { 
    sessionId: memoizedSessionId, 
    isHost: memoizedIsHost 
  });
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [participants, setParticipants] = useState<VideoCallParticipant[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const userRole = localStorage.getItem('user-role') || 'user';
  
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    console.log('[useVideoCall Step 2] Setting up video call effect');
    isMountedRef.current = true;
    let initTimeout: NodeJS.Timeout;
    
    const initializeCall = async () => {
      try {
        console.log('[useVideoCall Step 3] Starting call initialization');
      setIsInitializing(true);
      
        console.log('[useVideoCall Step 4] Waiting for socket connection');
      const socketConnected = await socketService.waitForConnection();
      if (!socketConnected) {
          console.log('[useVideoCall Step 4.1] Socket connection failed');
          throw new Error('Failed to connect to signaling server');
      }
      
        console.log('[useVideoCall Step 5] Initializing WebRTC');
      const initialized = await webRTCService.initialize(
          memoizedSessionId, 
        userRole as 'user' | 'developer',
          memoizedIsHost
      );
      
      if (!initialized) {
          console.log('[useVideoCall Step 5.1] WebRTC initialization failed');
        throw new Error('Failed to initialize WebRTC');
      }
      
        console.log('[useVideoCall Step 6] Waiting for initialization delay');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('[useVideoCall Step 7] Starting local stream');
      const stream = await webRTCService.startLocalStream({ 
          audio: true, 
          video: true 
      });
      
        if (!stream) {
          console.log('[useVideoCall Step 7.1] Failed to get local stream');
        throw new Error('Failed to access camera/microphone');
      }
      
      if (isMountedRef.current) {
          console.log('[useVideoCall Step 8] Setting up local stream and starting duration timer');
        setLocalStream(stream);
        setIsConnected(true);
        setIsLoading(false);
        
        startTimeRef.current = Date.now();
        
        durationIntervalRef.current = setInterval(() => {
          const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setCallDuration(elapsedSeconds);
        }, 1000);
      }
    } catch (err: any) {
        console.error('[useVideoCall Step 9] Error in initialization:', err);
      
      if (isMountedRef.current) {
        setError(err.message || 'Failed to join video call');
        setIsLoading(false);
        onError?.(err.message || 'Failed to join video call');
      }
    } finally {
      if (isMountedRef.current) {
        setIsInitializing(false);
      }
    }
    };

    initTimeout = setTimeout(initializeCall, 500);

    return () => {
      console.log('[useVideoCall Step 10] Cleaning up video call');
      isMountedRef.current = false;
      clearTimeout(initTimeout);
      endCall();
    };
  }, [memoizedSessionId, memoizedIsHost]);
  
  useEffect(() => {
    if (isMountedRef.current) {
      webRTCService.onTrack((stream, peerId) => {
        console.log('🎦[useVideoCall] onTrack callback fired for peerId:', peerId, stream);
        setRemoteStreams(prev => {
          const newStreams = new Map(prev);
          newStreams.set(peerId, stream);
          console.log('[useVideoCall] remoteStreams updated:', Array.from(newStreams.keys()));
          return newStreams;
        });
        updateParticipants();
      });
      
      webRTCService.onParticipantDisconnected((peerId) => {
        setRemoteStreams(prev => {
          const newStreams = new Map(prev);
          newStreams.delete(peerId);
          console.log('[useVideoCall] remoteStreams after disconnect:', Array.from(newStreams.keys()));
          return newStreams;
        });
        
        updateParticipants();
      });
    }
  }, [memoizedSessionId]);
  
  const updateParticipants = useCallback(async () => {
    try {
      const participantsData = await fetchParticipantsData(memoizedSessionId);
      
      const newParticipants: VideoCallParticipant[] = [];
      
      newParticipants.push({
        id: 'local',
        stream: localStream,
        role: userRole as 'user' | 'developer',
        username: 'You',
        profilePicture: localStorage.getItem('user-profile-pic') || undefined
      });
      
      remoteStreams.forEach((stream, peerId) => {
        const participant = participantsData.find((p: any) => p.id === peerId);
        
        if (participant) {
          newParticipants.push({
            id: peerId,
            stream,
            role: participant.role,
            username: participant.username,
            profilePicture: participant.profilePicture
          });
        } else {
          newParticipants.push({
            id: peerId,
            stream,
            role: 'user', 
            username: 'Unknown'
          });
        }
      });
      
      setParticipants(newParticipants);
    } catch (error) {
      console.error('Error updating participants:', error);
    }
  }, [memoizedSessionId, localStream, remoteStreams, userRole]);
  
  useEffect(() => {
    updateParticipants();
  }, [remoteStreams, updateParticipants]);
  
  const toggleMute = useCallback(async () => {
    if (!localStream) return;
    
    const success = await webRTCService.toggleAudio(!isMuted);
    if (success) {
      setIsMuted(!isMuted);
    }
  }, [localStream, isMuted]);
  
  const toggleVideo = useCallback(async () => {
    if (!localStream) return;
    
    const success = await webRTCService.toggleVideo(!isVideoEnabled);
    if (success) {
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [localStream, isVideoEnabled]);
  
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      webRTCService.stopScreenSharing();
      setScreenShareStream(null);
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await webRTCService.startScreenSharing();
        if (stream) {
          setScreenShareStream(stream);
          setIsScreenSharing(true);
        }
      } catch (err: any) {
        console.error('Error sharing screen:', err);
        setError('Failed to share screen: ' + (err.message || 'Unknown error'));
        onError?.('Failed to share screen: ' + (err.message || 'Unknown error'));
      }
    }
  }, [isScreenSharing, onError]);
  
  const endCall = useCallback(() => {
    try {
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
        });
      }
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      
      socketService.leaveVideoRoom(memoizedSessionId);
      webRTCService.leaveRoom();
      webRTCService.cleanup();
      
      setIsConnected(false);
    } catch (err: any) {
      console.error('Error ending call:', err);
    }
  }, [localStream, memoizedSessionId]);
  
  async function fetchSessionData(sessionId: string) {
    return {
      title: "Development Session",
      participants: []
    };
  }
  
  async function fetchParticipantsData(sessionId: string): Promise<ParticipantData[]> {
    return [];
  }
  
  const startCamera = async () => {
    try {
      const stream = await webRTCService.startLocalStream();
      
      if (!stream) {
        throw new Error('Failed to get media stream');
      }
      
      setLocalStream(stream);
    } catch (err) {
      console.error('Camera access error details:', err);
      
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please check your browser permissions.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera or microphone found. Please check your device connections.');
        } else if (err.name === 'NotReadableError') {
          setError('Camera is already in use by another application. Please close other video apps.');
        } else {
          setError(`Camera error: ${err.name}`);
        }
      } else {
        setError('Failed to access camera/microphone');
      }
      
      onError?.('Failed to access camera/microphone');
    }
  };
  
  useEffect(() => {
    if (!socketService.isConnected()) {
        setConnectionState('disconnected');
        return;
    }

    const handleConnect = () => {
        setConnectionState('connected');
    };

    const handleDisconnect = () => {
        setConnectionState('disconnected');
    };

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);

    return () => {
        socketService.off('connect', handleConnect);
        socketService.off('disconnect', handleDisconnect);
    };
  }, []);
  
  return {
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
    endCall
  };
}
