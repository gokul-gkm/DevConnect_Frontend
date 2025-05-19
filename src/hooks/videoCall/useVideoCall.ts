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
  const userRole = localStorage.getItem('user-role') || 'developer';
  
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    
    const initTimeout = setTimeout(() => {
      if (isMountedRef.current) {
        initializeCall();
      }
    }, 500);

    return () => {
      isMountedRef.current = false;
      clearTimeout(initTimeout);
      endCall();
    };
  }, [sessionId]);
  
  async function initializeCall() {
    if (isInitializing) return;
    
    try {
      setIsInitializing(true);
      setIsLoading(true);
      
      console.log('Before socket connection attempt');
      const socketConnected = await socketService.waitForConnection();
      console.log('Socket connection result:', socketConnected);
      
      if (!socketConnected) {
        throw new Error('Unable to connect to signaling server');
      }
      
      console.log('Using role for WebRTC:', userRole);
      
      const initialized = await webRTCService.initialize(
        sessionId, 
        userRole as 'user' | 'developer',
        isHost
      );
      
      if (!initialized) {
        throw new Error('Failed to initialize WebRTC');
      }
      
      const preferredVideoDevice = localStorage.getItem('preferred-video-device');
      const preferredAudioDevice = localStorage.getItem('preferred-audio-device');
      
      const videoConstraints = preferredVideoDevice 
        ? { deviceId: { exact: preferredVideoDevice }, width: { ideal: 640 }, height: { ideal: 480 } } 
        : true;
        
      const audioConstraints = preferredAudioDevice
        ? { deviceId: { exact: preferredAudioDevice }, echoCancellation: true, noiseSuppression: true }
        : true;
        
      const stream = await webRTCService.startLocalStream({ 
        audio: audioConstraints, 
        video: videoConstraints 
      });
      
      if (!stream && isMountedRef.current) {
        throw new Error('Failed to access camera/microphone');
      }
      
      socketService.joinVideoRoom(sessionId);
      
      const data = await fetchSessionData(sessionId);
      
      if (isMountedRef.current) {
        setLocalStream(stream);
        setSessionData(data);
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
  }
  
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
