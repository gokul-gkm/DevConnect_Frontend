import { socketService } from "../socket/socketService";
import { toast } from "react-hot-toast";

/* ============================ TYPES ============================ */

interface PeerConnection {
  connection: RTCPeerConnection;
  streams: MediaStream[];
  cameraSender?: RTCRtpSender;
  screenSender?: RTCRtpSender;
  pendingCandidates: RTCIceCandidateInit[];
}

/* ============================ SERVICE ============================ */

class WebRTCService {
  private peers = new Map<string, PeerConnection>();

  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;

  private roomId: string | null = null;
  private userId: string | null = null;
  private role: "user" | "developer" | null = null;

  private initialized = false;


  private onTrackCallbacks: ((s: MediaStream, id: string) => void)[] = [];
  private onDisconnectCallbacks: ((id: string) => void)[] = [];

  private socketDisconnectTimer: any = null;
  private readonly socketDisconnectFallbackTimeout = 10000;

  private readonly RELOAD_FLAG = "webrtc-is-reloading";

  private iceServers: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ];

  constructor() {
    console.log("🏗️ [WEBRTC] Constructor called");
    this.registerReloadHandler();
    console.log("✅ [WEBRTC] Constructor complete");
     this.ensureSocketListeners();
     console.log("✅ [WEBRTC] Constructor complete");
  }

  /* ============================ INIT ============================ */

  
  async initialize(
    roomId: string,
    role: "user" | "developer"
  ): Promise<boolean> {
    try {
      console.log("🚀 [WEBRTC] initialize() called", { 
        roomId, 
        role,
        alreadyInitialized: this.initialized,
        currentRoomId: this.roomId,
        currentRole: this.role
      });

      if (this.initialized && this.roomId === roomId && this.role === role) {
        console.log("⏭️ [WEBRTC] Already initialized with same params, skipping");
        this.debug("INIT_SKIP_ALREADY_INITIALIZED");
        return true;
      }

      this.debug("INIT_START", { roomId, role });

      console.log("🧹 [WEBRTC] Cleaning up before init");
      this.cleanup(true);

      this.roomId = roomId;
      this.role = role;
      this.userId = localStorage.getItem("user-id");
      console.log("👤 [WEBRTC] User info:", { userId: this.userId, role, roomId });

      if (!this.userId) {
        console.error("❌ [WEBRTC] Missing userId");
        throw new Error("Missing userId");
      }

      const reload = localStorage.getItem(this.RELOAD_FLAG);
      console.log("🔄 [WEBRTC] Reload flag check:", { hasReloadFlag: !!reload });
      
      if (reload) {
        localStorage.removeItem(this.RELOAD_FLAG);
        this.debug("SOFT_RECONNECT");
        
        if (!socketService.isConnected()) {
          console.error("❌ [WEBRTC] Socket not connected during reconnect!");
          throw new Error("Socket not connected");
        }
        
        console.log("🔄 [WEBRTC] Re-registering socket listeners before reconnect");
        this.registerSocketListeners();
        
        console.log("🔄 [WEBRTC] Soft reconnect - emitting webrtc:reconnect", {
          roomId,
          userId: this.userId,
          role
        });

        socketService.emit("webrtc:reconnect", {
          roomId,
          userId: this.userId,
          role,
        });


        setTimeout(async () => {
          console.log("🔍 [WEBRTC] Checking peer status after reconnect", {
            roomId,
            peerCount: this.peers.size,
            userId: this.userId
          });
          
        
          if (this.peers.size === 0) {
            console.log("⚠️ [WEBRTC] No peers after reconnect, joining room normally");
            socketService.joinVideoRoom(roomId);
          }
        }, 2000);

        this.initialized = true;
        console.log("✅ [WEBRTC] Soft reconnect complete - waiting for session-info");
        return true;
      }
      
      if (socketService.isConnected()) {
        console.log("🔄 [WEBRTC] Re-registering socket listeners before normal init");
        this.registerSocketListeners();
      }
      
      console.log("🚪 [WEBRTC] Normal init - joining video room");
      const joinResult = socketService.joinVideoRoom(roomId);
      console.log("📊 [WEBRTC] joinVideoRoom result:", joinResult);

      this.initialized = true;
      this.debug("INIT_DONE");
      console.log("✅ [WEBRTC] Initialization complete");
      return true;
    } catch (err) {
      console.error("[WebRTC] init failed", err);
      this.debug("INIT_FAILED", { error: err });
      toast.error("Failed to initialize video call");
      return false;
    }
  }

  /* ============================ SOCKET ============================ */

  private ensureSocketListeners() {
    if (socketService.isConnected()) {
      console.log("🔌 [WEBRTC] Socket already connected, registering listeners");
      this.registerSocketListeners();
    } else {
      console.log("⏳ [WEBRTC] Socket not connected yet, will register on connect");
      socketService.on("connect", () => {
        console.log("🟢 [WEBRTC] Socket connected, registering listeners");
        this.registerSocketListeners();
      });
    }
  }

  private registerSocketListeners() {
    console.log("👂 [WEBRTC] Registering socket listeners", {
      socketConnected: socketService.isConnected(),
      hasSocket: !!socketService
    });

    socketService.on("webrtc:session-info", (data) => {
      console.log("📨 [WEBRTC] ✅✅✅ Received webrtc:session-info ✅✅✅", data);
      this.handleSessionInfo(data);
    });
    
    socketService.on("webrtc:offer", (data) => {
      console.log("📨 [WEBRTC] Received webrtc:offer", { 
        from: data.from, 
        to: data.to,
        sessionId: data.sessionId 
      });
      this.handleOffer(data);
    });
    
    socketService.on("webrtc:answer", (data) => {
      console.log("📨 [WEBRTC] Received webrtc:answer", { 
        from: data.from, 
        to: data.to,
        sessionId: data.sessionId 
      });
      this.handleAnswer(data);
    });
    
    socketService.on("webrtc:ice-candidate", (data) => {
      console.log("📨 [WEBRTC] Received webrtc:ice-candidate", { 
        from: data.from, 
        to: data.to,
        hasCandidate: !!data.candidate,
        sessionId: data.sessionId 
      });
      this.handleICE(data);
    });
    
    socketService.on("webrtc:user-left", (data) => {
      console.log("📨 [WEBRTC] Received webrtc:user-left", data);
      this.handleDisconnect(data);
    });
    
    socketService.on("webrtc:request-renegotiation", (data) => {
      console.log("📨 [WEBRTC] Received webrtc:request-renegotiation", data);
      this.handleRenegotiation();
    });

    socketService.on("disconnect", () => {
      console.log("📨 [WEBRTC] Socket disconnected");
      this.handleSocketDisconnect();
    });

    console.log("✅ [WEBRTC] Socket listeners registered");
  }

  private registerReloadHandler() {
    window.addEventListener("beforeunload", () => {
      localStorage.setItem(this.RELOAD_FLAG, "1");
    });
  }

  /* ============================ MEDIA ============================ */

  async startLocalStream(): Promise<MediaStream | null> {
    if (this.localStream) return this.localStream;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    this.localStream = stream;
    return stream;
  }

  toggleAudio(enabled: boolean) {
    this.localStream?.getAudioTracks().forEach(t => (t.enabled = enabled));
  }

  toggleVideo(enabled: boolean) {
    this.localStream?.getVideoTracks().forEach(t => (t.enabled = enabled));
  }

  /* ============================ PEERS ============================ */

  private createPeer(peerId: string, initiator: boolean): PeerConnection {
    console.log("👥 [WEBRTC] createPeer() called", { peerId, initiator });

    if (this.peers.has(peerId)) {
      console.log("⏭️ [WEBRTC] Peer already exists:", peerId);
      return this.peers.get(peerId)!;
    }

    this.debug("CREATE_PEER", { peerId, initiator });

    const pc = new RTCPeerConnection({ iceServers: this.iceServers });
    console.log("🔗 [WEBRTC] Created RTCPeerConnection for:", peerId);

    const peer: PeerConnection = {
      connection: pc,
      streams: [],
      pendingCandidates: [],
    };

    this.peers.set(peerId, peer);
    console.log("✅ [WEBRTC] Peer added to map:", peerId, "Total peers:", this.peers.size);

    pc.onicecandidate = e => {
      if (!e.candidate) {
        console.log("🏁 [WEBRTC] ICE gathering complete for:", peerId);
        return
      };
      console.log("🧊 [WEBRTC] ICE candidate generated for:", peerId);
      socketService.emit("webrtc:ice-candidate", {
        to: peerId,
        from: this.userId,
        candidate: e.candidate,
        sessionId: this.roomId,
      });
    };

    pc.ontrack = e => {
      console.log("📹 [WEBRTC] Track received from:", peerId, {
        trackKind: e.track.kind,
        trackLabel: e.track.label,
        streamId: e.streams[0]?.id
      });
      const stream = e.streams[0];
      peer.streams.push(stream);
      this.onTrackCallbacks.forEach(cb => cb(stream, peerId));
    };

    pc.onconnectionstatechange = () => {
      console.log("🔄 [WEBRTC] Connection state changed:", {
        peerId,
        state: pc.connectionState,
        signalingState: pc.signalingState,
        iceConnectionState: pc.iceConnectionState
      });
      
      this.debug("PC_STATE", {
        peerId,
        state: pc.connectionState,
      });

      if (pc.connectionState === "failed") {
        console.warn("⚠️ [WEBRTC] Connection failed, restarting ICE:", peerId);
        pc.restartIce();
      }
    };

    this.attachLocalTracks(peer);
    console.log("📎 [WEBRTC] Local tracks attached to peer:", peerId);

    if (initiator) {
      console.log("🎯 [WEBRTC] Creating offer (initiator):", peerId);
      this.createOffer(peerId, peer);
    } else {
      console.log("⏳ [WEBRTC] Waiting for offer (non-initiator):", peerId);
    }

    return peer;
  }

  private attachLocalTracks(peer: PeerConnection) {
    if (!this.localStream) return;
    for (const track of this.localStream.getTracks()) {
      peer.connection.addTrack(track, this.localStream);
    }
  }

  /* ============================ SDP ============================ */

  private async createOffer(peerId: string, peer: PeerConnection) {
    console.log("📝 [WEBRTC] createOffer() called", { peerId });
    try {
      const offer = await peer.connection.createOffer();
      console.log("✅ [WEBRTC] Offer created:", { 
        peerId,
        type: offer.type,
        sdpLength: offer.sdp?.length 
      });
      
      await peer.connection.setLocalDescription(offer);
      console.log("✅ [WEBRTC] Local description set (offer)");

      socketService.emit("webrtc:offer", {
        sdp: offer,
        to: peerId,
        from: this.userId,
        sessionId: this.roomId,
      });
      console.log("📤 [WEBRTC] Offer emitted to:", peerId);
    } catch (err) {
      console.error("❌ [WEBRTC] createOffer failed:", err);
      throw err;
    }
  }

  private handleOffer = async (data: any) => {
    console.log("📥 [WEBRTC] handleOffer() called", { 
      from: data.from,
      sessionId: data.sessionId,
      currentRoomId: this.roomId,
      matches: data.sessionId === this.roomId
    });

    if (data.sessionId !== this.roomId) {
      console.warn("⚠️ [WEBRTC] Offer sessionId mismatch, ignoring");
      return
    };

    console.log("👥 [WEBRTC] Creating peer for offer sender:", data.from);
    const peer = this.createPeer(data.from, false);

    if (peer.connection.signalingState !== "stable") {
      console.log("🔄 [WEBRTC] Signaling state not stable, rolling back:", {
        state: peer.connection.signalingState
      });
      try {
        await peer.connection.setLocalDescription({ type: "rollback" } as any);
        console.log("✅ [WEBRTC] Rollback successful");
      } catch(err) {
        console.warn("⚠️ [WEBRTC] Rollback failed:", err);
      }
    }
    console.log("📥 [WEBRTC] Setting remote description (offer)");
    await peer.connection.setRemoteDescription(
      new RTCSessionDescription(data.sdp)
    );

    console.log("✅ [WEBRTC] Remote description set (offer)");

    console.log("🧊 [WEBRTC] Processing pending ICE candidates:", peer.pendingCandidates.length);

    for (const c of peer.pendingCandidates) {
      await peer.connection.addIceCandidate(new RTCIceCandidate(c));
    }
    peer.pendingCandidates = [];

    console.log("📝 [WEBRTC] Creating answer");
    const answer = await peer.connection.createAnswer();
    console.log("✅ [WEBRTC] Answer created");

    await peer.connection.setLocalDescription(answer);
    console.log("✅ [WEBRTC] Local description set (answer)");

    socketService.emit("webrtc:answer", {
      sdp: answer,
      to: data.from,
      from: this.userId,
      sessionId: this.roomId,
    });
    console.log("📤 [WEBRTC] Answer emitted to:", data.from);
  };

  private handleAnswer = async ({ from, sdp }: any) => {
    console.log("📥 [WEBRTC] handleAnswer() called", { from });
    const peer = this.peers.get(from);
    if (!peer) {
      console.warn("⚠️ [WEBRTC] No peer found for answer:", from);
      return
    };

    console.log("📥 [WEBRTC] Setting remote description (answer)");
    await peer.connection.setRemoteDescription(
      new RTCSessionDescription(sdp)
    );
    console.log("✅ [WEBRTC] Remote description set (answer)");
  };

  /* ============================ ICE ============================ */

  private handleICE = async ({ from, candidate }: any) => {
    console.log("🧊 [WEBRTC] handleICE() called", { 
      from,
      hasCandidate: !!candidate,
      hasPeer: this.peers.has(from)
    });
    const peer = this.peers.get(from);
    if (!peer || !candidate) {
      console.warn("⚠️ [WEBRTC] No peer or candidate:", { hasPeer: !!peer, hasCandidate: !!candidate });
      return
    };

    if (!peer.connection.remoteDescription) {
      console.log("⏳ [WEBRTC] No remote description yet, queuing candidate");
      peer.pendingCandidates.push(candidate);
      return;
    }

    console.log("🧊 [WEBRTC] Adding ICE candidate");
    await peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
    console.log("✅ [WEBRTC] ICE candidate added");
  };

  /* ============================ SESSION ============================ */

 

  private handleSessionInfo = ({ participants, roomId }: any) => {
    console.log("📋 [WEBRTC] handleSessionInfo() called", { 
      roomId,
      currentRoomId: this.roomId,
      matches: roomId === this.roomId,
      participants,
      participantCount: participants?.length
    });
    
    if (roomId !== this.roomId) {
      console.warn("⚠️ [WEBRTC] Session info roomId mismatch, ignoring");
      return;
    }

    console.log("👥 [WEBRTC] Processing participants:", participants);
    
    const participantIds = new Set(participants.map((p: any) => p.userId));
    for (const [peerId, peer] of this.peers.entries()) {
      if (!participantIds.has(peerId)) {
        console.log("🗑️ [WEBRTC] Closing peer for removed participant:", peerId);
        peer.connection.close();
        this.peers.delete(peerId);
      }
    }
    
    participants.forEach((p: any) => {
      if (p.userId === this.userId) {
        console.log("⏭️ [WEBRTC] Skipping self:", p.userId);
        return;
      }
      

      if (this.peers.has(p.userId)) {
        const existingPeer = this.peers.get(p.userId)!;
        if (existingPeer.connection.connectionState === "closed" || 
            existingPeer.connection.connectionState === "failed" ||
            existingPeer.connection.connectionState === "disconnected") {
          console.log("🔄 [WEBRTC] Recreating peer for existing participant with bad connection:", p.userId);
          existingPeer.connection.close();
          this.peers.delete(p.userId);
        } else {
          console.log("⏭️ [WEBRTC] Peer already exists with good connection:", p.userId);
          return;
        }
      }

      const initiator = this.userId! > p.userId;
      console.log("👥 [WEBRTC] Creating peer for participant:", {
        userId: p.userId,
        role: p.role,
        initiator,
        myUserId: this.userId
      });
      this.createPeer(p.userId, initiator);
    });
    
    console.log("✅ [WEBRTC] Session info processed, total peers:", this.peers.size);
  };
  


  private handleRenegotiation = async () => {
    console.log("🔄 [WEBRTC] handleRenegotiation() called", {
      role: this.role,
      peerCount: this.peers.size
    });


    for (const [peerId, peer] of this.peers.entries()) {
      try {
        const isInitiator = this.userId! > peerId;
        
        if (isInitiator && peer.connection.signalingState === "stable") {
          console.log("📝 [WEBRTC] Creating renegotiation offer for peer:", peerId);
          await this.createOffer(peerId, peer);
        } else {
          console.log("⏭️ [WEBRTC] Skipping renegotiation for peer:", peerId, {
            isInitiator,
            signalingState: peer.connection.signalingState
          });
        }
      } catch (err) {
        console.error("❌ [WEBRTC] Failed to renegotiate with peer:", peerId, err);
      }
    }
  };

  /* ============================ SCREENSHARE ============================ */


async startScreenSharing(): Promise<MediaStream | null> {
  try {
    if (!this.roomId || !this.userId) {
      throw new Error("WebRTC not initialized");
    }

    this.debug("SCREEN_SHARE_START");
    console.log("🖥️ [WEBRTC] Starting screen sharing");

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    this.screenStream = stream;

    const screenTrack = stream.getVideoTracks()[0];
    if (!screenTrack) {
      console.error("❌ [WEBRTC] No screen track available");
      return null;
    }

    console.log("📹 [WEBRTC] Screen track obtained, adding to peers:", this.peers.size);

    for (const [peerId, peer] of this.peers.entries()) {
      try {
        console.log("➕ [WEBRTC] Adding screen track to peer:", peerId);
        peer.screenSender = peer.connection.addTrack(screenTrack, stream);
        console.log("✅ [WEBRTC] Screen track added to peer:", peerId);
      } catch (err) {
        console.error("❌ [WEBRTC] Failed to add screen track to peer:", peerId, err);
      }
    }


    console.log("🔄 [WEBRTC] Triggering renegotiation for screen share");
    for (const [peerId, peer] of this.peers.entries()) {
      try {
       
        const isInitiator = this.userId! > peerId;
        
        if (isInitiator || peer.connection.signalingState === "stable") {
          console.log("📝 [WEBRTC] Creating offer for screen share renegotiation:", peerId);
          await this.createOffer(peerId, peer);
        } else {
          console.log("⏳ [WEBRTC] Waiting for offer from peer for screen share:", peerId);
        }
      } catch (err) {
        console.error("❌ [WEBRTC] Failed to renegotiate for screen share:", peerId, err);
      }
    }

    screenTrack.onended = () => {
      console.log("🛑 [WEBRTC] Screen track ended by user");
      this.stopScreenSharing();
    };

    socketService.emit("webrtc:screen-sharing-started", {
      roomId: this.roomId,
      userId: this.userId,
    });

    console.log("✅ [WEBRTC] Screen sharing started successfully");
    return stream;
  } catch (err) {
    console.error("❌ [WEBRTC] startScreenSharing failed", err);
    toast.error("Failed to start screen sharing");
    return null;
  }
}

async stopScreenSharing(): Promise<void> {
  if (!this.screenStream) {
    console.log("⏭️ [WEBRTC] No screen stream to stop");
    return;
  }

  this.debug("SCREEN_SHARE_STOP");
  console.log("🛑 [WEBRTC] Stopping screen sharing");

  for (const [peerId, peer] of this.peers.entries()) {
    if (peer.screenSender) {
      try {
        console.log("➖ [WEBRTC] Removing screen track from peer:", peerId);
        peer.connection.removeTrack(peer.screenSender);
        console.log("✅ [WEBRTC] Screen track removed from peer:", peerId);
      } catch (err) {
        console.error("❌ [WEBRTC] Failed to remove screen track:", peerId, err);
      }
      peer.screenSender = undefined;
    }
  }

  this.screenStream.getTracks().forEach(t => t.stop());
  this.screenStream = null;

  socketService.emit("webrtc:screen-sharing-stopped", {
    roomId: this.roomId,
    userId: this.userId,
  });


  console.log("🔄 [WEBRTC] Triggering renegotiation after stopping screen share");
  for (const [peerId, peer] of this.peers.entries()) {
    try {
      const isInitiator = this.userId! > peerId;
      
      if (isInitiator || peer.connection.signalingState === "stable") {
        console.log("📝 [WEBRTC] Creating offer after screen share stop:", peerId);
        await this.createOffer(peerId, peer);
      }
    } catch (err) {
      console.error("❌ [WEBRTC] Failed to renegotiate after screen share stop:", peerId, err);
    }
  }

  console.log("✅ [WEBRTC] Screen sharing stopped");
}

  /* ============================ DISCONNECT ============================ */

  private handleDisconnect = ({ userId }: any) => {
    const peer = this.peers.get(userId);
    peer?.connection.close();
    this.peers.delete(userId);
    this.onDisconnectCallbacks.forEach(cb => cb(userId));
  };

  private handleSocketDisconnect = () => {
    console.log(this.socketDisconnectTimer)
    this.socketDisconnectTimer = setTimeout(() => {
      this.cleanup(false);
    }, this.socketDisconnectFallbackTimeout);
  };

  /* ============================ CLEANUP ============================ */

  leaveRoom() {
    if (this.roomId) socketService.leaveVideoRoom(this.roomId);
    this.cleanup(false);
  }

  cleanup(preserveStream: boolean) {
    this.peers.forEach(p => p.connection.close());
    this.peers.clear();

    if (!preserveStream) {
      this.localStream?.getTracks().forEach(t => t.stop());
      this.screenStream?.getTracks().forEach(t => t.stop());
      this.localStream = null;
      this.screenStream = null;
    }

    this.roomId = null;
    this.userId = null;
    this.role = null;
    this.initialized = false;
  }

  /* ============================ CALLBACKS ============================ */

  onTrack(cb: (s: MediaStream, id: string) => void) {
    this.onTrackCallbacks.push(cb);
  }

  onParticipantDisconnected(cb: (id: string) => void) {
    this.onDisconnectCallbacks.push(cb);
  }

  private debug(step: string, data?: any) {
    console.log(
      `%c[WEBRTC][${step}]`,
      "color:#a855f7;font-weight:bold",
      data ?? ""
    );
  }
}

export const webRTCService = new WebRTCService();
