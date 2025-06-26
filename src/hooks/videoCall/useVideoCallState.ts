import { useState, useEffect, useRef } from 'react';
import { socketService } from '@/service/socket/socketService';
import { webRTCService } from '@/service/webrtc/webRTCService';
import { toast } from 'react-hot-toast';

interface UseVideoCallStateProps {
  sessionId: string;
  isHost?: boolean;
}

export function useVideoCallState({ sessionId, isHost = false }: UseVideoCallStateProps) {
  console.log('[useVideoCallState Step 1] Initializing video call state', { sessionId, isHost });
  
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const initRef = useRef(false);

  useEffect(() => {
    console.log('[useVideoCallState Step 2] Setting up video call state effect');
    const initializeCall = async () => {
      if (initRef.current) {
        console.log('[useVideoCallState Step 2.1] Already initializing, skipping');
        return;
      }
      initRef.current = true;

      try {
        console.log('[useVideoCallState Step 3] Starting initialization');
        setIsInitializing(true);
        
        console.log('[useVideoCallState Step 4] Waiting for socket connection');
        const socketConnected = await socketService.waitForConnection();
        if (!socketConnected) {
          console.log('[useVideoCallState Step 4.1] Socket connection failed');
          throw new Error('Unable to connect to signaling server');
        }

        const userRole = localStorage.getItem('user-role') || 'user';
        console.log('[useVideoCallState Step 5] Initializing WebRTC', { userRole });
        
        const initialized = await webRTCService.initialize(
          sessionId,
          userRole as 'user' | 'developer',
          isHost
        );

        if (!initialized) {
          console.log('[useVideoCallState Step 5.1] WebRTC initialization failed');
          throw new Error('Failed to initialize WebRTC');
        }

        console.log('[useVideoCallState Step 6] Waiting for initialization delay');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('[useVideoCallState Step 7] Joining video room');
        socketService.joinVideoRoom(sessionId);
        
        setIsConnected(true);
        console.log('[useVideoCallState Step 8] Initialization complete');
      } catch (err: any) {
        console.error('[useVideoCallState Step 9] Error in initialization:', err);
        setError(err.message || 'Failed to join video call');
        toast.error(err.message || 'Failed to join video call');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeCall();

    return () => {
      console.log('[useVideoCallState Step 10] Cleaning up video call state');
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

