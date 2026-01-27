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
  if (initRef.current) {
    console.log('[useVideoCallState] Already initialized, skipping');
    return;
  }

  initRef.current = true;

  const initializeCall = async () => {
    try {
      console.log('[useVideoCallState] Starting initialization');
      setIsInitializing(true);

      const socketConnected = await socketService.waitForConnection();
      if (!socketConnected) {
        throw new Error('Unable to connect to signaling server');
      }

      const userRole =
        (localStorage.getItem('user-role') as 'user' | 'developer') || 'user';

      const initialized = await webRTCService.initialize(
        sessionId,
        userRole
      );

      if (!initialized) {
        throw new Error('Failed to initialize WebRTC');
      }

      socketService.joinVideoRoom(sessionId);
      setIsConnected(true);

      console.log('[useVideoCallState] Initialization complete');
    } catch (err: any) {
      console.error('[useVideoCallState] Initialization error:', err);
      setError(err.message || 'Failed to join video call');
      toast.error(err.message || 'Failed to join video call');
    } finally {
      setIsInitializing(false);
    }
  };

  initializeCall();

  return () => {
    console.log('[useVideoCallState] Skipping cleanup (StrictMode-safe)');
  };
}, [sessionId]);

  return {
    isConnected,
    error,
    isInitializing,
    endCall: () => {
      console.log('[useVideoCallState] Ending call manually');
      webRTCService.cleanup(false);
      socketService.leaveVideoRoom(sessionId);
      setIsConnected(false);
    }
  };
}

