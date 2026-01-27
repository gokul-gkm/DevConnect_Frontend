import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

class SocketService {
  private socket: Socket | null = null;

  private isConnecting = false;
  private connectPromise: Promise<boolean> | null = null;

  private joinedVideoRooms = new Set<string>();
  private lastJoinTime = 0;
  private JOIN_COOLDOWN = 1500;

  /* =========================
     CONNECTION
  ========================= */

  connect(token: string): Promise<boolean> {


    console.log("🔌 [SOCKET] connect() called", { 
      hasSocket: !!this.socket, 
      isConnected: this.socket?.connected,
      isConnecting: this.isConnecting 
    });
    
    if (this.socket) {
      if (this.socket.connected) {
        console.log("✅ [SOCKET] Already connected, returning");
        return Promise.resolve(true);
      }
      console.log("🔄 [SOCKET] Reconnecting existing socket");
      this.socket.connect();
      return this.connectPromise!;
    }
    
    if (this.isConnecting && this.connectPromise) {
      console.log("⏳ [SOCKET] Already connecting, waiting for promise");
      return this.connectPromise;
    } 

    console.log("🚀 [SOCKET] Starting new connection");

    this.isConnecting = true;

    this.connectPromise = new Promise(resolve => {
      this.socket = io(import.meta.env.VITE_API_BASE_URL, {
        auth: { token },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
      });

      this.socket.on("connect", () => {
        console.log("🟢 [SOCKET] Connected successfully:", this.socket?.id);
        this.isConnecting = false;
        resolve(true);
      });

      this.socket.on("disconnect", reason => {
        console.warn("🔴 Socket disconnected:", reason);
        this.isConnecting = false;
        this.joinedVideoRooms.clear();
        console.log("🧹 [SOCKET] Cleared joined video rooms");
      });

      this.socket.on("connect_error", err => {
        console.error("❌ Socket connect error:", err.message);
        this.isConnecting = false;
        resolve(false);
      });

      this.socket.on("user:blocked", () => {
        toast.error("Your account has been blocked");
        this.logout();
        window.location.href = "/auth/login";
      });
    });

    return this.connectPromise;
  }

  async waitForConnection(timeout = 8000): Promise<boolean> {
    console.log("⏱️ [SOCKET] waitForConnection()", { 
      isConnected: this.socket?.connected,
      hasPromise: !!this.connectPromise,
      timeout 
    });
    if (this.socket?.connected) {
      console.log("✅ [SOCKET] Already connected");
      return true;
    }


    const start = Date.now();

    if (!this.connectPromise) {
      console.warn("⚠️ [SOCKET] No connection promise yet, polling for connection");
  
      while (Date.now() - start < timeout) {

        if (this.socket?.connected) {
          console.log("✅ [SOCKET] Connected during polling");
          return true;
        }
  
        if (this.connectPromise) {
          console.log("🔄 [SOCKET] connectPromise appeared during polling");
          break;
        }
  
        await new Promise(res => setTimeout(res, 100));
      }

      if (this.socket?.connected) {
        console.log("✅ [SOCKET] Connected after polling loop");
        return true;
      }
  
      if (!this.connectPromise && !this.socket?.connected) {
        console.warn("⏰ [SOCKET] Polling finished, still no connection");
        return false;
      }
    }
    if (this.socket?.connected) {
      console.log("✅ [SOCKET] Connected before waiting on promise");
      return true;
    }
    const elapsed = Date.now() - start;
    const remainingTimeout = Math.max(0, timeout - elapsed);
    
    if (remainingTimeout <= 0) {
      console.warn("⏰ [SOCKET] No time remaining after polling");
      return false;
    }

    console.log("⏳ [SOCKET] Waiting on connectPromise", {
      elapsed,
      remainingTimeout,
      hasPromise: !!this.connectPromise
    });


const result = await Promise.race([
  this.connectPromise!,
  new Promise<boolean>(res =>
    setTimeout(() => {
      console.warn("⏰ [SOCKET] Connection timeout while waiting on promise", {
        elapsed: Date.now() - start,
        timeout
      });
      res(false);
    }, remainingTimeout),
  ),
]);
    
console.log("📊 [SOCKET] waitForConnection result:", result, {
  isConnected: this.socket?.connected,
  elapsed: Date.now() - start
});


if (!result && this.socket?.connected) {
  console.log("✅ [SOCKET] Socket connected after promise resolved false");
  return true;
}
  
    return result;
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  /* =========================
     EVENT API 
  ========================= */

  on(event: string, handler: (...args: any[]) => void) {
    if (!this.socket) {
      console.warn("⚠️ [SOCKET] on() called but socket is null:", event);
      return;
    }
    console.log("👂 [SOCKET] Registering listener:", event, {
      socketId: this.socket.id,
      connected: this.socket.connected
    });

    const listenerCount = this.socket.listeners(event).length;
    if (listenerCount > 0) {
      console.log(`⚠️ [SOCKET] Removing ${listenerCount} existing listener(s) for: ${event}`);
    }

    this.socket.off(event);

    this.socket.on(event, (...args) => {
      console.log(
        `%c📩 SOCKET EVENT: ${event}`,
        "color:#22c55e;font-weight:bold",
        args
      );
      handler(...args);
    });
    console.log("✅ [SOCKET] Listener registered for:", event);
  }

  off(event: string, handler?: (...args: any[]) => void) {
    if (!this.socket) return;
    this.socket.off(event, handler);
  }

  emit(event: string, payload?: any) {
    console.log("📤 [SOCKET] emit() called:", event, { 
      connected: this.socket?.connected,
      payload 
    });
    if (!this.socket?.connected) {
      console.warn(`⚠️ [SOCKET] emit skipped (not connected): ${event}`);
      return;
    }

    console.log(
      `%c📤 SOCKET EMIT: ${event}`,
      "color:#3b82f6;font-weight:bold",
      payload
    );

    this.socket.emit(event, payload);
  }

  /* =========================
     CHAT
  ========================= */

  joinChat(chatId: string) {
    this.emit("user:join-chat", chatId);
  }

  leaveChat(chatId: string) {
    this.emit("user:leave-chat", chatId);
  }

  emitTypingStart(chatId: string) {
    this.emit("typing:start", chatId);
  }

  emitTypingStop(chatId: string) {
    this.emit("typing:stop", chatId);
  }

  /* =========================
     NOTIFICATIONS
  ========================= */

  markNotificationRead(id: string) {
    this.emit("notification:mark-read", id);
  }

  markAllNotificationsRead() {
    this.emit("notification:mark-all-read");
  }

  /* =========================
     WEBRTC 
  ========================= */

  joinVideoRoom(roomId: string): boolean {
    console.log("🚪 [SOCKET] joinVideoRoom() called:", { 
      roomId,
      connected: this.socket?.connected,
      alreadyJoined: this.joinedVideoRooms.has(roomId),
      timeSinceLastJoin: Date.now() - this.lastJoinTime
    });
    if (!this.socket?.connected) {
      console.warn("⚠️ [SOCKET] Cannot join video room: socket not connected");
      return false;
    }

    if (this.joinedVideoRooms.has(roomId)) {
      console.log("⏭️ [SOCKET] Already joined video room:", roomId);
      return true;
    }

    const now = Date.now();
    if (now - this.lastJoinTime < this.JOIN_COOLDOWN) {
      console.log("⏳ [SOCKET] Video room join throttled");
      return false;
    }

    this.lastJoinTime = now;
    this.joinedVideoRooms.add(roomId);

    console.log("✅ [SOCKET] Joining video room:", roomId);

    this.emit("webrtc:join-room", { roomId });
    return true;
  }

  leaveVideoRoom(roomId: string) {
    console.log("🚪 [SOCKET] leaveVideoRoom() called:", { 
      roomId,
      connected: this.socket?.connected,
      wasJoined: this.joinedVideoRooms.has(roomId)
    });

    if (!this.socket?.connected) return;

    this.joinedVideoRooms.delete(roomId);
    this.emit("webrtc:leave-room", { roomId });
  }

  /* =========================
     CLEANUP
  ========================= */

  logout() {
    console.log("🚪 SocketService.logout()");

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    this.socket = null;
    this.isConnecting = false;
    this.connectPromise = null;
    this.joinedVideoRooms.clear();
  }
}

/* =========================
   SINGLETON
========================= */

export const socketService = new SocketService();
