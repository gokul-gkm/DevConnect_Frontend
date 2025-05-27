import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { socketService } from '@/service/socket/socketService';

export const SocketManager = () => {
    const { token, user } = useAuth();
    const storedRole = localStorage.getItem('user-role');
    const userRole = user?.role || storedRole || 'user';
    const connectionAttempted = useRef(false);
    
    useEffect(() => {
        console.log(`SocketManager initialized with role: ${userRole}`);
        
        const ensureSocketConnection = async () => {
            if (!token) return;
            
            if (!socketService.isConnected() || socketService.getCurrentRole() !== userRole) {
                connectionAttempted.current = true;
                console.log(`SocketManager: Ensuring socket connection as ${userRole}`);
                
                try {
                    const connected = await socketService.connect(token, userRole);
                    console.log(`SocketManager: Connection as ${userRole} ${connected ? 'successful' : 'failed'}`);
                } catch (error) {
                    console.error('SocketManager: Connection error', error);
                }
            }
        };
        
        ensureSocketConnection();
    }, [token, userRole]);
    
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && token) {
                console.log(`Page became visible, checking socket connection for ${userRole}`);
                if (!socketService.isConnected()) {
                    console.log(`Socket disconnected while page was hidden, reconnecting as ${userRole}`);
                    socketService.connect(token, userRole);
                }
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [token, userRole]);

    return null;
}; 