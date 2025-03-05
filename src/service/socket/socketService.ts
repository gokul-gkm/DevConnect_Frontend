
import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;
    private userRole: string | null = null;

    connect(token: string, role?: string) {
        if (this.socket?.connected) return;
        
        this.userRole = role || null;
        
        this.socket = io(import.meta.env.VITE_API_BASE_URL, {
            auth: { token },
            withCredentials: true
        });
        this.setupEventListeners();
    }

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket connected as', this.userRole);
        })

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        })

        this.socket.on('connect_error', (error) => {
            console.log('Socket connection error:', error)
        })
    }

    disconnect() {
        if (this.socket) {
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
        this.socket?.on('new-message', callback);
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
}

export const socketService = new SocketService();