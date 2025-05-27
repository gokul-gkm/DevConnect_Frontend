import { useState, useEffect, useRef, useCallback } from 'react';
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
  
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userRole = localStorage.getItem('user-role') || 'user';
  
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    let initTimeout: NodeJS.Timeout;
    
    const initializeCall = async () => {
      try {
        setIsInitializing(true);
        
        const socketConnected = await socketService.waitForConnection();
        if (!socketConnected) {
          throw new Error('Failed to connect to signaling server');
        }

        const initialized = await webRTCService.initialize(
          sessionId, 
          userRole as 'user' | 'developer',
          isHost
        );
        
        if (!initialized) {
          throw new Error('Failed to initialize WebRTC');
        }

   
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const stream = await webRTCService.startLocalStream({ 
          audio: true, 
          video: true 
        });
        
        if (!stream) {
          throw new Error('Failed to access camera/microphone');
        }

        if (isMountedRef.current) {
          setLocalStream(stream);
          setIsConnected(true);
          setIsLoading(false);
          
          durationIntervalRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
          }, 1000);
        }
      } catch (err: any) {
        console.error('Error initializing video call:', err);
        
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
      isMountedRef.current = false;
      clearTimeout(initTimeout);
      endCall();
    };
  }, [sessionId]);
  
  useEffect(() => {
    if (isMountedRef.current) {
      webRTCService.onTrack((stream, peerId) => {
        setRemoteStreams(prev => {
          const newStreams = new Map(prev);
          newStreams.set(peerId, stream);
          return newStreams;
        });
        
        updateParticipants();
      });
      
      webRTCService.onParticipantDisconnected((peerId) => {
        setRemoteStreams(prev => {
          const newStreams = new Map(prev);
          newStreams.delete(peerId);
          return newStreams;
        });
        
        updateParticipants();
      });
    }
  }, [sessionId]);
  
  const updateParticipants = useCallback(async () => {
    try {
      const participantsData = await fetchParticipantsData(sessionId);
      
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
  }, [sessionId, localStream, remoteStreams, userRole]);
  
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
      
      socketService.leaveVideoRoom(sessionId);
      webRTCService.leaveRoom();
      webRTCService.cleanup();
      
      setIsConnected(false);
    } catch (err: any) {
      console.error('Error ending call:', err);
    }
  }, [localStream, sessionId]);
  
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
