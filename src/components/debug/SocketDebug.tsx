import { useEffect, useState } from 'react';
import { socketService } from '@/service/socket/socketService';
import { useLocation } from 'react-router-dom';

export const SocketDebug = () => {
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const location = useLocation();
    
    useEffect(() => {
        const updateInfo = () => {
            setDebugInfo(socketService.getDebugInfo());
        };
        
        updateInfo();
        const interval = setInterval(updateInfo, 2000);
        
        return () => clearInterval(interval);
    }, []);
    
    const pingServer = () => {
        const result = socketService.pingServer();
        if (result) {
            socketService.setupPingListener();
        }
    };
    
    const forceReconnect = () => {
        const token = localStorage.getItem('access-token');
        const role = localStorage.getItem('user-role') || 'user';
        
        if (token) {
            socketService.connect(token, role)
                .then(connected => {
                    console.log(`Force reconnect ${connected ? 'successful' : 'failed'}`);
                });
        } else {
            console.error('No token available for reconnection');
        }
    };
    
    if (!debugInfo) return null;
    
    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 9999,
            fontSize: '12px',
            maxWidth: '300px'
        }}>
            <h4>Socket Debug</h4>
            <div>Connected: <span style={{color: debugInfo.isConnected ? 'green' : 'red'}}>
                {debugInfo.isConnected ? 'Yes' : 'No'}
            </span></div>
            <div>Socket ID: {debugInfo.socketId}</div>
            <div>Role: {debugInfo.userRole}</div>
            <div>Current Chat: {debugInfo.currentChatId || 'none'}</div>
            <div>Joined Chats: {debugInfo.joinedChats.join(', ') || 'none'}</div>
            <div>Listeners:
                <ul>
                    <li>newMessage: {debugInfo.hasListeners.newMessage ? 'Yes' : 'No'}</li>
                    <li>messagesRead: {debugInfo.hasListeners.messagesRead ? 'Yes' : 'No'}</li>
                </ul>
            </div>
            <div>Expected Role: {location.pathname.startsWith('/developer') ? 'developer' : 'user'}</div>
            <button 
                onClick={pingServer}
                style={{
                    background: 'blue',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    marginTop: '10px'
                }}
            >
                Ping Server
            </button>
            <button 
                onClick={forceReconnect}
                style={{
                    background: 'green',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    marginTop: '5px'
                }}
            >
                Force Reconnect
            </button>
        </div>
    );
};
