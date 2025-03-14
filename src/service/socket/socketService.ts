import { logout } from '@/redux/slices/authSlice';
import store from '@/redux/store/store';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;
    private userRole: string | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    connect(token: string, role?: string) {
        if (this.socket?.connected) {
            return;
        }

        this.userRole = role || null;
        
        try {
            this.socket = io(import.meta.env.VITE_API_BASE_URL, {
                auth: { token },
                withCredentials: true,
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                reconnectionDelay: 1000,
                timeout: 20000
            });

            this.setupEventListeners();
        } catch (error) {
            console.error('Socket connection error:', error);
        }
    }

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket connected as', this.userRole);
            this.reconnectAttempts = 0;
        })

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        })

        this.socket.on('connect_error', (error) => {
            console.log('Socket connection error:', error)
            this.handleReconnect();
        })


        this.socket.on('user:blocked', () => {
            console.log('Received blocked event');
            this.handleUserBlocked();
        });
    }

    private handleReconnect() {
        this.reconnectAttempts++;
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnection attempts reached');
            this.cleanup();
        }
    }

    private handleUserBlocked() {
        console.log('User blocked - logging out...');
        
        // Disconnect socket first
        this.disconnect();
        
        // Clear all auth tokens
        localStorage.removeItem('access-token');

        
        // Show notification
        toast.error('Your account has been blocked by admin', {
            duration: 5000,
            style: {
                background: '#991b1b',
                color: '#fff',
                border: '1px solid #ef4444'
            }
        });
        
        // Dispatch logout action
        store.dispatch(logout());
        
        // Small delay before redirect to ensure cleanup is complete
        setTimeout(() => {
            window.location.href = '/auth/login';
        }, 100);
    }

    disconnect() {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinChat(chatId: string) {
        if (!this.socket) return;
        
        if (this.userRole === 'developer') {
            console.log('Developer joining chat:', chatId);
            this.socket.emit('developer:join-chat', chatId);
        } else {
            console.log('User joining chat:', chatId);
            this.socket.emit('user:join-chat', chatId);
        }
    }

    leaveChat(chatId: string) {
        if (!this.socket) return;
        
        if (this.userRole === 'developer') {
            this.socket.emit('developer:leave-chat', chatId);
        } else {
            this.socket.emit('user:leave-chat', chatId);
        }
    }

    sendMessage(chatId: string, message: string) {
        this.socket?.emit('send-message', { chatId, message });
    }

    onNewMessage(callback: (data: any)=> void) {
        this.socket?.on('new-message', (data) => {
            console.log("Socket received new message:", data);
            callback(data);
        });
    }

    onTypingStart(callback: (data: any) => void) {
        this.socket?.on('typing:start', callback);
    }

    onTypingStop(callback: (data: any) => void) {
        this.socket?.on('typing:stop', callback);
    }

    emitTypingStart(chatId: string) {
        this.socket?.emit('typing:start', chatId);
    }

    emitTypingStop(chatId: string) {
        this.socket?.emit('typing:stop', chatId);
    }

    onMessagesRead(callback: (data: any)=> void){
        this.socket?.on('messages-read', callback);
    }

    cleanup() {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
        }
    }

    on(event: string, callback: (data: any) => void) {
        this.socket?.on(event, callback);
    }
}

export const socketService = new SocketService();