import { useState, useEffect, useRef } from 'react';
import { socketService } from '@/service/socket/socketService';
import { webRTCService } from '@/service/webrtc/webRTCService';
import { toast } from 'react-hot-toast';

interface UseVideoCallStateProps {
  sessionId: string;
  isHost?: boolean;
}

export function useVideoCallState({ sessionId, isHost = false }: UseVideoCallStateProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const initRef = useRef(false);

  useEffect(() => {
    const initializeCall = async () => {
      if (initRef.current) return;
      initRef.current = true;

      try {
        setIsInitializing(true);
        
        const socketConnected = await socketService.waitForConnection();
        if (!socketConnected) {
          throw new Error('Unable to connect to signaling server');
        }

        const userRole = localStorage.getItem('user-role') || 'user';
        
        const initialized = await webRTCService.initialize(
          sessionId,
          userRole as 'user' | 'developer',
          isHost
        );

        if (!initialized) {
          throw new Error('Failed to initialize WebRTC');
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        socketService.joinVideoRoom(sessionId);
        
        setIsConnected(true);
      } catch (err: any) {
        console.error('Error initializing video call:', err);
        setError(err.message || 'Failed to join video call');
        toast.error(err.message || 'Failed to join video call');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeCall();

    return () => {
      webRTCService.cleanup();
      socketService.leaveVideoRoom(sessionId);
      initRef.current = false;
    };
  }, [sessionId, isHost]);

  return {
    isConnected,
    error,
    isInitializing,
    endCall: () => {
      webRTCService.cleanup();
      socketService.leaveVideoRoom(sessionId);
      setIsConnected(false);
    }
  };
}

