import { logout } from '@/redux/slices/authSlice';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

let storeRef: any = null;

export const injectStore = (store: any) => {
  storeRef = store;
};

class SocketService {
    private socket: Socket | null = null;
    private userRole: string | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private isConnecting = false;
    private lastConnectionAttempt = 0;
    private connectionCooldown = 1000;
    private connectionCallbacks: Array<(success: boolean) => void> = [];
    private connectionTimeout: NodeJS.Timeout | null = null;
    private currentChatId: string | null = null;
    private joinedChats: Set<string> = new Set();
    private hasNewMessageListener = false;
    private hasMessagesReadListener = false;
    private hasTypingStartListener = false;
    private hasTypingStopListener = false;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private autoReconnect = true;
    private reconnectInterval = 3000;
    private hasNewNotificationListener = false;
    private hasNotificationReadListener = false;
    private hasNotificationAllReadListener = false;
    private hasUnreadCountListener = false;
    private hasWebRTCListeners = false;
    private lastRoomJoinTime: number = 0;
    private roomJoinCooldown: number = 2000;
    private pendingRoomJoins: Map<string, NodeJS.Timeout> = new Map();
    
    connect(token?: string | null, role?: string): Promise<boolean> {
        
        if (this.socket?.connected && this.userRole === role) {
            return Promise.resolve(true);
        }
        
        if (this.socket?.connected && this.userRole !== role) {
            this.disconnect();
        }
        
        return new Promise((resolve) => {
            try {
                const now = Date.now();
                
                if (this.socket?.connected && this.userRole === role) {
                    resolve(true);
                    return;
                }
                
                if (this.reconnectTimer) {
                    clearTimeout(this.reconnectTimer);
                    this.reconnectTimer = null;
                }
                
                if (this.isConnecting) {
                    this.connectionCallbacks.push((success) => resolve(success));
                    return;
                }
                
                if (now - this.lastConnectionAttempt < this.connectionCooldown) {
                    setTimeout(() => {
                        this.connect(token, role).then(resolve);
                    }, this.connectionCooldown);
                    return;
                }

                this.isConnecting = true;
                this.lastConnectionAttempt = now;
                
                this.connectionTimeout = setTimeout(() => {
                    if (this.isConnecting) {
                        console.error('Socket connection attempt timed out');
                        this.isConnecting = false;
                        
                        this.connectionCallbacks.forEach(callback => callback(false));
                        this.connectionCallbacks = [];
                        
                        if (this.socket && !this.socket.connected) {
                            this.socket.close();
                            this.socket = null;
                        }
                        
                        resolve(false);
                    }
                }, 10000);
                
                if (this.socket) {
                    this.disconnect();
                }

                const userRole = role || 'user';
                this.userRole = userRole;
                
                let authToken = token;
                if (!authToken) {
                    authToken = localStorage.getItem('access-token');
                }
                
                if (!authToken) {
                    console.error('Cannot connect socket: No authentication token provided');
                    this.resetConnectionState();
                    resolve(false);
                    return;
                }
                
                try {
                    const cleanToken = authToken.startsWith('Bearer ') ? authToken.substring(7) : authToken;
                    
                    this.socket = io(import.meta.env.VITE_API_BASE_URL, {
                        auth: { token: cleanToken },
                        withCredentials: true,
                        transports: ['websocket', 'polling'],
                        reconnection: true,
                        reconnectionAttempts: this.maxReconnectAttempts,
                        reconnectionDelay: 1000,
                        timeout: 20000
                    });


                    this.socket.on('connect', () => {
                        this.reconnectAttempts = 0;
                        this.resetConnectionState();
                        
                        this.connectionCallbacks.forEach(callback => callback(true));
                        this.connectionCallbacks = [];
                        
                        if (this.joinedChats.size > 0) {
                            this.joinedChats.forEach(chatId => {
                                this.joinChat(chatId);
                            });
                        }
                        
                        resolve(true);
                    });
                    
                    this.socket.on('connect_error', (error) => {
                        console.error('Socket connection error:', error);
                        this.handleReconnect();
                        this.resetConnectionState();
                        
                        this.connectionCallbacks.forEach(callback => callback(false));
                        this.connectionCallbacks = [];
                        
                        resolve(false);
                    });

                    this.socket.on('disconnect', (reason) => {
                        this.resetConnectionState();

                        if (this.autoReconnect && ['io server disconnect', 'transport close'].includes(reason)) {
                            this.setupReconnect();
                        }
                    });

                    this.setupEventListeners();
                } catch (error) {
                    console.error('Socket connection error:', error);
                    this.resetConnectionState();
                    resolve(false);
                }
            } catch (error) {
                console.error('Unexpected error in socket connect:', error);
                this.resetConnectionState();
                resolve(false);
            }
        });
    }
    
    private resetConnectionState() {
        this.isConnecting = false;
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
        }
    }

    private setupEventListeners() {
        if (!this.socket) return;
        
        this.socket.removeAllListeners('disconnect');
        this.socket.removeAllListeners('user:blocked');
        this.socket.removeAllListeners('newAccessToken'); 
        
        this.socket.on('user:blocked', () => {
            this.handleUserBlocked();
        });

        this.socket.on('newAccessToken', (newToken: string) => {

            localStorage.setItem('access-token', newToken);

            if (this.socket) {
                this.socket.auth = { token: newToken };
            }

            this.forceReconnect();
            
            toast.success('Session refreshed automatically');
        });
    }

    private handleReconnect() {
        this.reconnectAttempts++;
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.cleanup();
        }
    }

    private handleUserBlocked() {
        
        this.disconnect();
    
        localStorage.removeItem('access-token');

        toast.error('Your account has been blocked by admin', {
            duration: 5000,
            style: {
                background: '#991b1b',
                color: '#fff',
                border: '1px solid #ef4444'
            }
        });
        
        logout();
        
        
        setTimeout(() => {
            window.location.href = '/auth/login';
        }, 100);
    }

    disconnect() {
        this.resetConnectionState();
        
        if (this.socket) {
            this.socket.removeAllListeners();
            
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinChat(chatId: string) {
        if (!this.socket) {
            console.warn('Cannot join chat: Socket not connected');
            return false;
        }
        
        if (this.joinedChats.has(chatId)) {
            return true;
        }
        
        if (this.userRole === 'developer') {
            this.socket.emit('developer:join-chat', chatId);
        } else {
            this.socket.emit('user:join-chat', chatId);
        }
        
        this.currentChatId = chatId;
        this.joinedChats.add(chatId);
        
        return true;
    }

    leaveChat(chatId: string) {
        if (!this.socket) {
            console.warn('Cannot leave chat: Socket not connected');
            return;
        }
        
        if (!this.joinedChats.has(chatId)) {
            return;
        }
        
        if (this.userRole === 'developer') {
            this.socket.emit('developer:leave-chat', chatId);
        } else {
            this.socket.emit('user:leave-chat', chatId);
        }
        
        this.joinedChats.delete(chatId);
        
        if (this.currentChatId === chatId) {
            this.currentChatId = null;
        }
    }

    sendMessage(chatId: string, message: string) {
        this.socket?.emit('send-message', { chatId, message });
    }

    onNewMessage(callback: (data: any) => void) {
        if (this.socket) {
            if (this.hasNewMessageListener) {
                this.socket.off('new-message');
            }
            
            this.socket.on('new-message', (data: any) => {
                
                if (!data.chatId) {
                    if (data.message && data.message.chatId) {
                        data.chatId = typeof data.message.chatId === 'object' ? 
                                     data.message.chatId.toString() : data.message.chatId;
                    } else if (data.chat && data.chat._id) {
                        data.chatId = typeof data.chat._id === 'object' ? 
                                     data.chat._id.toString() : data.chat._id;
                    }
                }
                
                callback(data);
            });
            
            this.hasNewMessageListener = true;
        } else {
            console.error('Cannot set up new-message listener: Socket not connected');
        }
    }

    onTypingStart(callback: (data: any) => void) {
        if (!this.socket) return;
        
        if (this.hasTypingStartListener) {
            this.socket.off('typing:start');
        }
        
        this.socket.on('typing:start', callback);
        this.hasTypingStartListener = true;
    }

    onTypingStop(callback: (data: any) => void) {
        if (!this.socket) return;
        
        if (this.hasTypingStopListener) {
            this.socket.off('typing:stop');
        }
        
        this.socket.on('typing:stop', callback);
        this.hasTypingStopListener = true;
    }

    emitTypingStart(chatId: string) {
        this.socket?.emit('typing:start', chatId);
    }

    emitTypingStop(chatId: string) {
        this.socket?.emit('typing:stop', chatId);
    }

    onMessagesRead(callback: (data: any) => void) {
        if (!this.socket) return;
        
        if (this.hasMessagesReadListener) {
            this.socket.off('messages-read');
        }
        
        this.socket.on('messages-read', callback);
        this.hasMessagesReadListener = true;
    }

    cleanup() {
        
        if (this.socket) {
            if (this.hasNewMessageListener) {
                this.socket.off('new-message');
                this.hasNewMessageListener = false;
            }
            
            if (this.hasMessagesReadListener) {
                this.socket.off('messages-read');
                this.hasMessagesReadListener = false;
            }
            
            if (this.hasTypingStartListener) {
                this.socket.off('typing:start');
                this.hasTypingStartListener = false;
            }
            
            if (this.hasTypingStopListener) {
                this.socket.off('typing:stop');
                this.hasTypingStopListener = false;
            }
            
            if (this.hasNewNotificationListener) {
                this.socket.off('notification:new');
                this.hasNewNotificationListener = false;
            }
            
            if (this.hasNotificationReadListener) {
                this.socket.off('notification:marked-read');
                this.hasNotificationReadListener = false;
            }
            
            if (this.hasNotificationAllReadListener) {
                this.socket.off('notification:all-marked-read');
                this.hasNotificationAllReadListener = false;
            }
            
            if (this.hasUnreadCountListener) {
                this.socket.off('notification:unread-count');
                this.hasUnreadCountListener = false;
            }
            
            if (this.hasWebRTCListeners) {
                this.socket.off('webrtc:offer');
                this.socket.off('webrtc:answer');
                this.socket.off('webrtc:ice-candidate');
                this.socket.off('webrtc:user-disconnected');
                this.socket.off('webrtc:session-info');
                this.hasWebRTCListeners = false;
            }
        }
    }

    on(event: string, callback: (data: any) => void) {
        if (!this.socket) return;
        
        console.log(`Setting up listener for event: ${event}`);
        this.socket.on(event, (data) => {
            console.log(`Received event ${event}:`, data);
            callback(data);
        });
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    getCurrentRole(): string | null {
        return this.userRole;
    }

    waitForConnection(timeout = 5000): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.isConnected()) {
                resolve(true);
                return;
            }
            
            
            const timeoutId = setTimeout(() => {
                
                const token = localStorage.getItem('access-token');
                const role = localStorage.getItem('user-role') || 'user';
                
                if (token) {
                    this.connect(token, role).then(resolve);
                } else {
                    resolve(false);
                }
            }, timeout);
            
            const checkInterval = setInterval(() => {
                if (this.isConnected()) {
                    clearTimeout(timeoutId);
                    clearInterval(checkInterval);
                    resolve(true);
                }
            }, 100);
        });
    }

    forceReconnect(): Promise<boolean> {
        
        this.resetConnectionState();

        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
        
        const token = localStorage.getItem('access-token');
        const role = localStorage.getItem('user-role') || 'user';
        
        if (token) {
            return this.connect(token, role);
        } else {
            console.error('Cannot force reconnect: No token available');
            return Promise.resolve(false);
        }
    }

    fullCleanup() {
        
        if (this.socket) {
            this.socket.removeAllListeners();
            
            this.socket.disconnect();
            this.socket = null;
        }
        
        this.resetConnectionState();
    }

    isChatJoined(chatId: string): boolean {
        return this.joinedChats.has(chatId);
    }
    
    getCurrentChat(): string | null {
        return this.currentChatId;
    }

    getDebugInfo() {
        return {
            isConnected: this.socket?.connected || false,
            socketId: this.socket?.id || 'not connected',
            userRole: this.userRole,
            joinedChats: Array.from(this.joinedChats),
            currentChatId: this.currentChatId,
            hasListeners: {
                newMessage: this.hasNewMessageListener,
                messagesRead: this.hasMessagesReadListener,
                typingStart: this.hasTypingStartListener,
                typingStop: this.hasTypingStopListener
            }
        };
    }

    pingServer() {
        console.log('🏓 SENDING PING');
        if (this.socket?.connected) {
            this.socket.emit('ping', { time: new Date().toISOString() });
            return true;
        } else {
            console.log('🏓 CANNOT PING: Socket not connected');
            return false;
        }
    }

    setupPingListener() {
        if (!this.socket) return;
        
        this.socket.on('pong', (data) => {
            console.log('🏓 RECEIVED PONG', data);
        });
    }

    hasMessageListener(): boolean {
        return this.hasNewMessageListener;
    }

    hasReadReceiptListener(): boolean {
        return this.hasMessagesReadListener;
    }

    hasTypingListeners(): boolean {
        return this.hasTypingStartListener || this.hasTypingStopListener;
    }

    private setupReconnect() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }
        
        this.reconnectTimer = setTimeout(() => {
            const token = localStorage.getItem('access-token');
            const role = localStorage.getItem('user-role') || 'user';
            
            if (token) {
                this.connect(token, role)
                    .then(connected => {
                        if (connected) {
                            console.log('Reconnection successful');
                        } else {
                            console.log('Reconnection failed, will try again');
                            this.setupReconnect();
                        }
                    })
                    .catch(error => {
                        console.error('Error during reconnection:', error);
                        this.setupReconnect();
                    });
            } else {
                console.log('No token available for reconnection');
            }
        }, this.reconnectInterval);
    }

    onNewNotification(callback: (data: any) => void) {
        if (!this.socket) return;
        console.log('🎉Setting up new notification listener');
        if (this.hasNewNotificationListener) {
            this.socket.off('notification:new');
        }
        
        this.socket.on('notification:new', callback);
        this.hasNewNotificationListener = true;
    }

    onNotificationRead(callback: (data: any) => void) {
        if (!this.socket) return;
        
        if (this.hasNotificationReadListener) {
            this.socket.off('notification:marked-read');
        }
        
        this.socket.on('notification:marked-read', callback);
        this.hasNotificationReadListener = true;
    }

    onAllNotificationsRead(callback: (data: any) => void) {
        if (!this.socket) return;
        
        if (this.hasNotificationAllReadListener) {
            this.socket.off('notification:all-marked-read');
        }
        
        this.socket.on('notification:all-marked-read', callback);
        this.hasNotificationAllReadListener = true;
    }

    onUnreadCountUpdate(callback: (data: any) => void) {
        if (!this.socket) return;
        
        if (this.hasUnreadCountListener) {
            this.socket.off('notification:unread-count');
        }
        
        this.socket.on('notification:unread-count', callback);
        this.hasUnreadCountListener = true;
    }

    markNotificationAsRead(notificationId: string) {
        if (!this.socket) {
            console.warn('Cannot mark notification as read: Socket not connected');
            return false;
        }
        
        this.socket.emit('notification:mark-read', notificationId);
        return true;
    }

    markAllNotificationsAsRead() {
        if (!this.socket) {
            console.warn('Cannot mark all notifications as read: Socket not connected');
            return false;
        }
        
        this.socket.emit('notification:mark-all-read');
        return true;
    }

    emit(event: string, data: any) {
        if (!this.socket) {
            console.warn('Socket not connected, cannot emit event:', event);
            return;
        }
        
        this.socket.emit(event, data);
    }

    checkOnlineStatus(userId?: string, developerId?: string) {
        if (!this.socket) {
            console.warn('Socket not connected, cannot check online status');
            return Promise.resolve(false);
        }
        
        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                console.warn('Online status check timed out');
                resolve(false);
            }, 3000);
            
            const eventName = userId ? 'user:online' : 'developer:online';
            const callback = (data: any) => {
                clearTimeout(timeoutId);
                
                if (userId && data.userId === userId) {
                    this.socket?.off(eventName, callback);
                    resolve(!!data.isOnline);
                } else if (developerId && data.developerId === developerId) {
                    this.socket?.off(eventName, callback);
                    resolve(!!data.isOnline);
                }
            };
            
            if (this.socket) {
                this.socket.on(eventName, callback);
                
                if (userId) {
                    this.socket.emit('check:online', { userId });
                } else if (developerId) {
                    this.socket.emit('check:online', { developerId });
                }
            } else {
                clearTimeout(timeoutId);
                resolve(false);
            }
        });
    }

    logout() {
        let userId = null;
        const userRole = localStorage.getItem('user-role') || 'user';
        
        if (storeRef) {
            try {
                userId = storeRef.getState().user._id;
            } catch (e) {
                console.error('Error accessing store state:', e);
            }
        }
        
        if (this.socket && userId) {
            if (userRole === 'developer') {
                this.socket.emit('developer:set-offline', { developerId: userId });
            } else {
                this.socket.emit('user:set-offline', { userId });
            }
            
            setTimeout(() => {
                this.cleanup();
                this.disconnect();
            }, 200);
        } else {
            this.cleanup();
            this.disconnect();
        }
    }

    setupWebRTCListeners() {
        if (!this.socket) return;
        
        if (this.hasWebRTCListeners) {
            this.socket.off('webrtc:offer');
            this.socket.off('webrtc:answer');
            this.socket.off('webrtc:ice-candidate');
            this.socket.off('webrtc:user-disconnected');
            this.socket.off('webrtc:session-info');
        }
        
        this.hasWebRTCListeners = true;
    }

    joinVideoRoom(sessionId: string): boolean {
        const now = Date.now();
        
        if (this.pendingRoomJoins.has(sessionId)) {
            clearTimeout(this.pendingRoomJoins.get(sessionId));
            this.pendingRoomJoins.delete(sessionId);
        }

        if (now - this.lastRoomJoinTime < this.roomJoinCooldown) {
            console.log('Skipping room join - cooldown active');
            
            const timeout = setTimeout(() => {
                this.executeRoomJoin(sessionId);
            }, this.roomJoinCooldown - (now - this.lastRoomJoinTime));
            
            this.pendingRoomJoins.set(sessionId, timeout);
            return false;
        }

        return this.executeRoomJoin(sessionId);
    }

    private executeRoomJoin(sessionId: string): boolean {
        if (!this.socket?.connected) {
            console.warn('Cannot join video room: Socket not connected');
            return false;
        }
        
        this.lastRoomJoinTime = Date.now();
        
        if (this.userRole === 'developer') {
            this.socket.emit('developer:join-video', sessionId);
        } else {
            this.socket.emit('user:join-video', sessionId);
        }
        
        return true;
    }

    leaveVideoRoom(sessionId: string): boolean {
   
        if (this.pendingRoomJoins.has(sessionId)) {
            clearTimeout(this.pendingRoomJoins.get(sessionId));
            this.pendingRoomJoins.delete(sessionId);
        }

        if (!this.socket || !sessionId) {
            console.warn('Cannot leave video room: Socket not connected or invalid session ID');
            return false;
        }
        
        if (this.userRole === 'developer') {
            this.socket.emit('developer:leave-video', sessionId);
        } else {
            this.socket.emit('user:leave-video', sessionId);
        }
        
        return true;
    }

    off(event: string, callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }
}

export const socketService = new SocketService();