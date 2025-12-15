import { socketService } from "../socket/socketService";
import { toast } from "react-hot-toast";

interface PeerConnection {
  connection: RTCPeerConnection;
  streams: MediaStream[];
  cameraSender?: RTCRtpSender;
  screenSender?: RTCRtpSender;
  pendingCandidates?: RTCIceCandidateInit[];
}

interface ICECandidate {
  candidate: RTCIceCandidateInit | null;
  from: string;
  to: string;
}

interface SDPOffer {
  sdp: RTCSessionDescriptionInit;
  from: string;
  to: string;
  sessionId: string;
}

class WebRTCService {
  private peerConnections: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private localScreenStream: MediaStream | null = null;
  private roomId: string | null = null;
  private userId: string | null = null;
  private participantRole: "user" | "developer" | null = null;
  private onTrackCallbacks: ((stream: MediaStream, peerId: string) => void)[] =
    [];
  private onParticipantDisconnectedCallbacks: ((peerId: string) => void)[] = [];
  private onLocalStreamCallbacks: ((stream: MediaStream) => void)[] = [];
  private isScreenSharing = false;
  private isInitialized = false;
  private isReloadingFlagKey = "webrtc-is-reloading";
  private socketDisconnectFallbackTimeout = 10000;
  private socketDisconnectTimer: any = null;
  private suppressErrorsDuringReconnect = false;

  private boundHandleRemoteOffer = this.handleRemoteOffer.bind(this);
  private boundHandleRemoteAnswer = this.handleRemoteAnswer.bind(this);
  private boundHandleRemoteICECandidate =
    this.handleRemoteICECandidate.bind(this);
  private boundHandleUserDisconnected = this.handleUserDisconnected.bind(this);
  private boundHandleSessionInfo = this.handleSessionInfo.bind(this);
  private boundHandleSocketDisconnect = this.handleSocketDisconnect.bind(this);
  private boundHandleRequestRenegotiation =
    this.handleRequestRenegotiation.bind(this);

  private iceServers: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    {
      urls: "turn:numb.viagenie.ca",
      username: "webrtc@live.com",
      credential: "muazkh",
    },
  ];

  constructor() {
    this.setupSocketListeners();
    this.registerReloadHandlers();
    try {
      socketService.on("disconnect", this.boundHandleSocketDisconnect);
    } catch (e) {
      console.warn(
        '[WebRTCService] socketService.on("disconnect") registration failed',
        e
      );
    }
  }

  private setupSocketListeners() {
    socketService.off("webrtc:offer", this.boundHandleRemoteOffer);
    socketService.off("webrtc:answer", this.boundHandleRemoteAnswer);
    socketService.off("webrtc:ice-candidate",this.boundHandleRemoteICECandidate);
    socketService.off("webrtc:user-disconnected",this.boundHandleUserDisconnected);
    socketService.off("webrtc:session-info", this.boundHandleSessionInfo);

    socketService.on("webrtc:offer", this.boundHandleRemoteOffer);
    socketService.on("webrtc:answer", this.boundHandleRemoteAnswer);
    socketService.on("webrtc:ice-candidate", this.boundHandleRemoteICECandidate);
    socketService.on("webrtc:user-disconnected", this.boundHandleUserDisconnected);
    socketService.on("webrtc:session-info", this.boundHandleSessionInfo);
    socketService.on("webrtc:request-renegotiation", this.boundHandleRequestRenegotiation);
  }

  private registerReloadHandlers() {
    window.addEventListener("beforeunload", () => {
      try {
        localStorage.setItem(this.isReloadingFlagKey, "1");
      } catch (e) { }
    });
  }

  public async initialize(
    sessionId: string,
    role: "user" | "developer",
    isHost: boolean = false
  ): Promise<boolean> {
    console.log("[Video Call Step 1] Initializing WebRTC service", {
      sessionId,
      role,
      isHost,
    });
    try {
      const currentRole = localStorage.getItem("user-role");
      if (currentRole !== role) {
        console.log(
          `[Video Call Step 2] Role mismatch, updating role from ${currentRole} to ${role}`
        );
        localStorage.setItem("user-role", role);
      }

      this.setupSocketListeners();
      console.log("[Video Call Step 2] Socket listeners setup complete");

      if (!socketService.isConnected()) {
        console.log("[Video Call Step 3] Waiting for socket connection...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const currentSocketRole = socketService.getCurrentRole?.();
      if (currentSocketRole && currentSocketRole !== role) {
        console.log(`[Video Call Step 4] Role mismatch detected`, {
          current: currentSocketRole,
          requested: role,
        });

        const token = localStorage.getItem("access-token");
        const reconnected = await socketService.connect(token, role);
        if (!reconnected) {
          console.log(
            "[Video Call Step 4.1] Failed to reconnect with correct role"
          );
          throw new Error("Failed to reconnect socket with correct role");
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (this.isInitialized) {
        if (this.roomId === sessionId && this.participantRole === role) {
          console.log(
            "[Video Call Step 5] Already initialized with same session and role"
          );
          return true;
        }
        console.log(
          "[Video Call Step 6] Cleaning up previous initialization (preserve session info)"
        );
        this.cleanup(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      this.roomId = sessionId;
      this.participantRole = role;

      const userId = localStorage.getItem("user-id");
      if (!userId) {
        console.log("[Video Call Step 7] No user ID found");
        throw new Error("No user ID found");
      }
      this.userId = userId;
      console.log("[Video Call Step 8] User ID set", { userId });

      const reloadingFlag = localStorage.getItem(this.isReloadingFlagKey);
      if (reloadingFlag) {
        console.log(
          "[Video Call] Detected reload flag, attempting soft-reconnect"
        );
        try {
          localStorage.removeItem(this.isReloadingFlagKey);

          socketService.emit("webrtc:reconnect", {
            roomId: sessionId,
            userId: this.userId,
            role: this.participantRole,
            isHost,
          });

          await new Promise((resolve) => setTimeout(resolve, 800));

          this.isInitialized = true;
          console.log(
            "[Video Call] Soft-reconnect attempted (waiting for session-info)."
          );
          return true;
        } catch (err) {
          console.warn(
            "[Video Call] Soft-reconnect failed, proceeding with normal join",
            err
          );
        }
      }

      console.log("[Video Call Step 9] Joining room");
      socketService.emit("webrtc:join-room", {
        roomId: sessionId,
        userId: this.userId,
        role: this.participantRole,
        isHost,
      });

      this.isInitialized = true;
      console.log("[Video Call Step 10] Initialization complete");
      return true;
    } catch (error) {
      console.error("[Video Call Step 11] Error initializing WebRTC:", error);
      toast.error("Failed to initialize video call");
      return false;
    }
  }

  public async reconnect(sessionId: string): Promise<void> {
    console.log("[WebRTC] Soft reconnect triggered");

    if (!this.userId || !this.participantRole) {
      console.warn("[WebRTC] reconnect() aborted — service not initialized");
      return;
    }

    try {
      this.suppressErrorsDuringReconnect = true;

      socketService.emit("webrtc:reconnect", {
        roomId: sessionId,
        userId: this.userId,
        role: this.participantRole,
      });

      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("[WebRTC] Soft reconnect sent — waiting for session-info");

      setTimeout(() => {
        this.suppressErrorsDuringReconnect = false;
      }, 3000);
    } catch (err) {
      console.warn("[WebRTC] reconnect() failed silently", err);
      this.suppressErrorsDuringReconnect = false;
    }
  }

  public async startLocalStream(
    options: {
      audio: boolean | MediaTrackConstraints;
      video: boolean | MediaTrackConstraints;
    } = { audio: true, video: true }
  ): Promise<MediaStream | null> {
    console.log("[Local Stream Step 1] Starting local stream", { options });
    try {
      if (this.localStream) {
        console.log(
          "[Local Stream Step 2] Replacing existing local stream tracks"
        );
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: options.audio,
          video: options.video,
        });
        for (const [_peerId, peerData] of this.peerConnections.entries()) {
          const senders = peerData.connection.getSenders();
          for (const sender of senders) {
            if (!sender.track) continue;
            const kind = sender.track.kind;
            const newTrack = newStream.getTracks().find((t) => t.kind === kind);
            if (newTrack) {
              try {
                await sender.replaceTrack(newTrack);
                if (kind === "video") {
                  peerData.cameraSender = sender;
                }
              } catch (e) {
                console.warn(
                  "[Local Stream] replaceTrack failed, will remove/add instead",
                  e
                );
                try {
                  peerData.connection.removeTrack(sender);
                } catch (err) {}
              }
            }
          }
        }

        this.localStream.getTracks().forEach((track) => track.stop());
        this.localStream = newStream;
        this.onLocalStreamCallbacks.forEach((cb) => cb(newStream));
        console.log(
          "[Local Stream Step 2.1] Local stream replaced and callbacks executed"
        );
        return this.localStream;
      }

      const constraints = {
        audio: options.audio,
        video: options.video,
      };

      console.log(
        "[Local Stream Step 3] Requesting media with constraints:",
        constraints
      );
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      console.log("[Local Stream Step 4] Media stream obtained:", {
        audioTracks: stream.getAudioTracks().length,
        videoTracks: stream.getVideoTracks().length,
        trackInfo: stream.getTracks().map((t) => ({
          kind: t.kind,
          label: t.label,
          enabled: t.enabled,
        })),
      });

      this.localStream = stream;
      console.log("[Local Stream Step 5] Local stream stored");

      this.onLocalStreamCallbacks.forEach((callback) => callback(stream));
      console.log("[Local Stream Step 6] Local stream callbacks executed");

      if (this.isOfferer() && this.peerConnections.size > 0) {
        this.updateTracksOnAllPeers();
        await this.renegotiateAllPeers();
      }

      return stream;
    } catch (error) {
      console.error("[Local Stream Step 8] Error getting local stream:", error);
      if (error instanceof DOMException) {
        console.error(
          `[Local Stream Step 8.1] DOMException type: ${error.name}, Message: ${error.message}`
        );
      }
      return null;
    }
  }

  public async toggleAudio(enabled: boolean): Promise<boolean> {
    if (!this.localStream) return false;

    try {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
      return true;
    } catch (error) {
      console.error("Error toggling audio:", error);
      return false;
    }
  }

  public async toggleVideo(enabled: boolean): Promise<boolean> {
    if (!this.localStream) return false;

    try {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
      return true;
    } catch (error) {
      console.error("Error toggling video:", error);
      return false;
    }
  }

  public async startScreenSharing(): Promise<MediaStream | null> {
    console.log("[WebRTC] startScreenSharing called");
    if (!this.roomId || !this.userId) {
      console.error("[WebRTC] Not initialized");
      return null;
    }

    try {
      if (this.localScreenStream) {
        this.localScreenStream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      this.localScreenStream = stream;
      this.isScreenSharing = true;

      const screenTrack = stream.getVideoTracks()[0];
      if (screenTrack) {
        console.log(
          "[WebRTC] Got screen track:",
          screenTrack.label,
          screenTrack.id
        );
        this.addScreenTrackToAllPeers(screenTrack, stream);

        if (this.isOfferer()) {
          await this.renegotiateAllPeers();
        } else {
          socketService.emit("webrtc:request-renegotiation", {
            roomId: this.roomId,
            from: this.userId,
          });
        }

        screenTrack.onended = () => {
          console.log("[WebRTC] Screen share track ended");
          this.stopScreenSharing();
        };
      } else {
        console.warn("[WebRTC] No video track found in screen share stream");
      }

      socketService.emit("webrtc:screen-sharing-started", {
        roomId: this.roomId,
        userId: this.userId,
      });

      return stream;
    } catch (error) {
      console.error("[WebRTC] Error starting screen sharing:", error);
      return null;
    }
  }

  public async stopScreenSharing(): Promise<void> {
    console.log("[WebRTC] stopScreenSharing called");
    if (!this.localScreenStream || !this.isScreenSharing) return;

    this.localScreenStream.getTracks().forEach((track) => track.stop());
    this.localScreenStream = null;
    this.isScreenSharing = false;

    this.removeScreenTrackFromAllPeers();

    if (this.isOfferer()) {
      await this.renegotiateAllPeers();
    } else {
      socketService.emit("webrtc:request-renegotiation", {
        roomId: this.roomId,
        from: this.userId,
      });
    }

    if (this.roomId && this.userId) {
      socketService.emit("webrtc:screen-sharing-stopped", {
        roomId: this.roomId,
        userId: this.userId,
      });
    }
  }

  public onTrack(
    callback: (stream: MediaStream, peerId: string) => void
  ): void {
    this.onTrackCallbacks.push(callback);
  }

  public onParticipantDisconnected(callback: (peerId: string) => void): void {
    this.onParticipantDisconnectedCallbacks.push(callback);
  }

  public onLocalStream(callback: (stream: MediaStream) => void): void {
    if (this.localStream) {
      callback(this.localStream);
    }
    this.onLocalStreamCallbacks.push(callback);
  }

  public leaveRoom(): void {
    if (!this.roomId || !this.userId) return;

    socketService.emit("webrtc:leave-room", {
      roomId: this.roomId,
      userId: this.userId,
      role: this.participantRole,
    });

    this.cleanup(false);
  }

  public cleanup(preserveSession: boolean = false): void {
    console.log("[Cleanup Step 1] Starting cleanup", { preserveSession });
    try {
      if (!preserveSession) {
        if (this.localStream) {
          console.log("[Cleanup Step 2] Stopping local stream tracks");
          this.localStream.getTracks().forEach((track) => track.stop());
          this.localStream = null;
        }

        if (this.localScreenStream) {
          console.log("[Cleanup Step 3] Stopping screen share stream tracks");
          this.localScreenStream.getTracks().forEach((track) => track.stop());
          this.localScreenStream = null;
        }
      } else {
        if (this.localStream) {
          console.log("[Cleanup] Preserving local stream for potential rejoin");
        }
      }

      console.log("[Cleanup Step 4] Closing peer connections");
      this.peerConnections.forEach((peerData, peerId) => {
        console.log(`[Cleanup Step 5] Closing connection with ${peerId}`);
        try {
          peerData.connection.close();
        } catch (e) { }
      });

      this.peerConnections.clear();

      this.isScreenSharing = false;
      this.isInitialized = false;

      if (!preserveSession) {
        this.roomId = null;
        this.userId = null;
        this.participantRole = null;
      }

      console.log("[Cleanup Step 6] Cleanup complete", { preserveSession });
    } catch (e) {
      console.warn("[Cleanup] Exception during cleanup", e);
    }
  }

  private async handleSessionInfo(data: any): Promise<void> {
    if (this.suppressErrorsDuringReconnect) {
      console.log(
        "[WebRTC] Received session-info — clearing reconnect suppress flag"
      );
      this.suppressErrorsDuringReconnect = false;
    }

    const { participants, roomId } = data;
    console.log(
      `[Session Info Step 1] Received session info for room ${roomId}:`,
      participants
    );

    if (roomId !== this.roomId) {
      console.log("[Session Info Step 1.1] Room ID mismatch, skipping");
      return;
    }

    console.log("[Session Info Step 2] Cleaning up existing peer connections");
    this.peerConnections.forEach((peerData, _peerId) => {
      try {
        peerData.connection.close();
      } catch (e) {}
    });
    this.peerConnections.clear();

    for (const participant of participants) {
      if (participant.userId === this.userId) {
        console.log("[Session Info Step 3] Skipping self-connection");
        continue;
      }

      console.log(
        `[Session Info Step 4] Creating peer connection for ${participant.userId}`
      );
      const peerConnection = await this.createPeerConnection(
        participant.userId,
        this.isOfferer()
      );
      if (!peerConnection) {
        console.log(
          `[Session Info Step 4.1] Failed to create peer connection for ${participant.userId}`
        );
        continue;
      }
      console.log(
        `[Session Info Step 4.2] Peer connection created for ${participant.userId}`
      );
    }

    if (this.isOfferer() && this.localStream && this.peerConnections.size > 0) {
      console.log("[Session Info] Developer renegotiating");
      this.updateTracksOnAllPeers();
      await this.renegotiateAllPeers();
    }
  }

  private async handleRequestRenegotiation({ roomId }: any): Promise<void> {
    if (this.roomId === roomId && this.isOfferer()) {
      console.log("[WebRTC] Renegotiation requested by peer");
      this.updateTracksOnAllPeers();
      await this.renegotiateAllPeers();
    }
  }

  private async handleRemoteOffer(data: SDPOffer): Promise<void> {
    const { from, sdp, sessionId } = data;
    console.log(`[Remote Offer Step 1] Received offer from ${from}`, {
      sessionId,
      currentRoomId: this.roomId,
      signalingState: this.peerConnections.get(from)?.connection.signalingState,
    });

    if (sessionId !== this.roomId || from === this.userId) {
      console.log("[Remote Offer Step 1.1] Invalid offer, skipping");
      return;
    }

    try {
      console.log(
        "[Remote Offer Step 2] Creating or retrieving peer connection"
      );
      const peerConnection = await this.createPeerConnection(from, false);
      if (!peerConnection) {
        console.log("[Remote Offer Step 2.1] Failed to create peer connection");
        return;
      }

      const state = peerConnection.connection.signalingState as string;

      if (state === "have-local-offer" || state === "have-remote-offer") {
        console.log(
          `[Remote Offer Step 3] In ${state}, rolling back and setting new remote offer`
        );
        try {
          await peerConnection.connection.setLocalDescription({
            type: "rollback",
          } as any);
        } catch (e) {
          console.warn(
            "[Remote Offer] rollback setLocalDescription may not be supported",
            e
          );
        }
        await peerConnection.connection.setRemoteDescription(
          new RTCSessionDescription(sdp)
        );
      } else {
        console.log(
          `[Remote Offer Step 3] In ${state}, setting remote description directly`
        );
        await peerConnection.connection.setRemoteDescription(
          new RTCSessionDescription(sdp)
        );
      }

      if (
        peerConnection.pendingCandidates &&
        peerConnection.pendingCandidates.length > 0
      ) {
        console.log("[Remote Offer Step 6] Processing pending ICE candidates", {
          count: peerConnection.pendingCandidates.length,
        });
        for (const candidate of peerConnection.pendingCandidates) {
          try {
            await peerConnection.connection.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } catch (e) {
            console.warn("[Remote Offer] adding pending candidate failed", e);
          }
        }
        peerConnection.pendingCandidates = [];
      }

      console.log("[Remote Offer Step 7] Creating answer");
      const answer = await peerConnection.connection.createAnswer();
      console.log("[Remote Offer Step 8] Setting local description");
      await peerConnection.connection.setLocalDescription(answer);
      console.log(
        `[Remote Offer Step 9] Created and set local answer for ${from}`
      );

      socketService.emit("webrtc:answer", {
        sdp: answer,
        to: from,
        from: this.userId,
        sessionId: this.roomId,
      });
    } catch (error) {
      console.error(
        "[Remote Offer Step 10] Error handling remote offer:",
        error
      );
      if (!this.suppressErrorsDuringReconnect) {
        // toast.error('Failed to establish connection');
      } else {
        console.log(
          "[WebRTC] suppressed toast during reconnect: Failed to establish connection"
        );
      }
    }
  }

  private async handleRemoteAnswer(data: SDPOffer): Promise<void> {
    const { from, sdp, sessionId } = data;
    console.log(`[Remote Answer Step 1] Received answer from ${from}`, {
      sessionId,
      currentRoomId: this.roomId,
    });

    if (sessionId !== this.roomId || from === this.userId) {
      console.log("[Remote Answer Step 1.1] Invalid answer, skipping");
      return;
    }

    try {
      const peerData = this.peerConnections.get(from);
      if (!peerData) {
        console.log("[Remote Answer Step 2] No peer connection found");
        throw new Error(`No peer connection found for ${from}`);
      }

      console.log("[Remote Answer Step 3] Checking signaling state", {
        state: peerData.connection.signalingState,
      });

      if (peerData.connection.signalingState === "stable") {
        console.log(
          "[Remote Answer Step 3.1] Connection already stable, skipping answer"
        );
        return;
      }

      console.log("[Remote Answer Step 4] Setting remote description");
      await peerData.connection.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );
      console.log(`[Remote Answer Step 5] Set remote description from ${from}`);
    } catch (error) {
      console.error(
        "[Remote Answer Step 6] Error handling remote answer:",
        error
      );
      if (!this.suppressErrorsDuringReconnect) {
        toast.error("Failed to complete connection");
      } else {
        console.log(
          "[WebRTC] suppressed toast during reconnect: Failed to complete connection"
        );
      }
    }
  }

  private async handleRemoteICECandidate(data: ICECandidate): Promise<void> {
    const { from, candidate } = data;

    if (from === this.userId) return;

    try {
      const peerData = this.peerConnections.get(from);
      if (!peerData) {
        console.warn(`No peer connection found for ${from}`);
        return;
      }

      if (!peerData.connection.remoteDescription) {
        console.log("Remote description not set, queuing ICE candidate");
        if (!peerData.pendingCandidates) {
          peerData.pendingCandidates = [];
        }
        if (candidate) {
          peerData.pendingCandidates.push(candidate);
        }
        return;
      }

      if (candidate) {
        await peerData.connection.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
        console.log(`Added ICE candidate from ${from}`);
      }
    } catch (error) {
      console.error("Error handling remote ICE candidate:", error);
      if (!this.suppressErrorsDuringReconnect) {
        // toast.error('Failed to establish connection');
      } else {
        console.log(
          "[WebRTC] suppressed toast during reconnect: Failed to establish connection"
        );
      }
    }
  }

  private handleUserDisconnected(data: {
    userId: string;
    roomId: string;
  }): void {
    const { userId, roomId } = data;

    if (roomId !== this.roomId) return;

    console.log(`User ${userId} disconnected from room ${roomId}`);

    const peerData = this.peerConnections.get(userId);
    if (peerData) {
      try {
        peerData.connection.close();
      } catch (e) {}
      this.peerConnections.delete(userId);
    }

    this.onParticipantDisconnectedCallbacks.forEach((callback) =>
      callback(userId)
    );
  }

  private async createPeerConnection(
    peerId: string,
    isInitiator: boolean
  ): Promise<PeerConnection | null> {
    console.log(
      `[Step 1] Creating peer connection for ${peerId}, isInitiator: ${isInitiator}`
    );

    if (peerId === this.userId) {
      console.warn("[Step 1.1] Attempted to create peer connection with self");
      return null;
    }

    let peerData = this.peerConnections.get(peerId);
    if (peerData) {
      console.log(`[Step 1.2] Existing peer connection found for ${peerId}`);
      return peerData;
    }

    console.log("[Step 2] Creating new RTCPeerConnection");
    const peerConnection = new RTCPeerConnection({
      iceServers: this.iceServers,
      iceCandidatePoolSize: 10,
    });

    peerData = {
      connection: peerConnection,
      streams: [],
    };

    this.peerConnections.set(peerId, peerData);
    console.log(`[Step 3] Peer connection created and stored for ${peerId}`);

    peerConnection.onconnectionstatechange = async () => {
      console.log(
        `[Connection State] ${peerId}: ${peerConnection.connectionState}`
      );
      console.log(
        `[Signaling State] ${peerId}: ${peerConnection.signalingState}`
      );

      switch (peerConnection.connectionState) {
        case "disconnected":
        case "failed":
          console.log(
            `[Step 4.1] Connection with ${peerId} ${peerConnection.connectionState}, attempting recovery...`
          );
          await this.handleConnectionRecovery(peerId);
          break;
        case "closed":
          console.log(
            `[Step 4.2] Connection with ${peerId} closed, removing from connections`
          );
          this.peerConnections.delete(peerId);
          break;
        case "connected":
          console.log(
            `[Step 4.3] Connection with ${peerId} established successfully`
          );
          break;
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (this.roomId && this.userId) {
        console.log(`[Step 5] New ICE candidate for ${peerId}:`, {
          candidate: event.candidate,
          state: peerConnection.connectionState,
          signalingState: peerConnection.signalingState,
        });
        socketService.emit("webrtc:ice-candidate", {
          candidate: event.candidate,
          to: peerId,
          from: this.userId,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      console.log(`[WebRTC] ontrack: Received track from ${peerId}`, {
        streams: event.streams,
        track: event.track,
        kind: event.track.kind,
        label: event.track.label,
        state: peerConnection.connectionState,
        signalingState: peerConnection.signalingState,
      });

      const [remoteStream] = event.streams;

      if (remoteStream) {
        console.log(`[WebRTC] ontrack: Adding remote stream for ${peerId}`, {
          audioTracks: remoteStream.getAudioTracks().length,
          videoTracks: remoteStream.getVideoTracks().length,
          streamId: remoteStream.id,
        });
        peerData!.streams.push(remoteStream);
        this.onTrackCallbacks.forEach((callback) =>
          callback(remoteStream, peerId)
        );
      }
    };

    console.log("[Step 7] Adding local tracks to peer connection");
    this.addLocalTracks(peerConnection, peerData);

    if (isInitiator && this.roomId && this.userId) {
      try {
        console.log("[Step 8] Creating offer as initiator");
        const offer = await peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });

        console.log("[Step 9] Setting local description");
        await peerConnection.setLocalDescription(offer);
        console.log(
          `[Step 10] Created and set local description for ${peerId}`,
          {
            type: offer.type,
            sdp: offer.sdp,
          }
        );

        socketService.emit("webrtc:offer", {
          sdp: offer,
          to: peerId,
          from: this.userId,
          sessionId: this.roomId,
        });
      } catch (error) {
        console.error("[Step 8.1] Error creating offer:", error);
        if (!this.suppressErrorsDuringReconnect) {
          toast.error("Failed to create connection offer");
        } else {
          console.log(
            "[WebRTC] suppressed toast during reconnect: Failed to create connection offer"
          );
        }
      }
    }

    return peerData;
  }

  private async handleConnectionRecovery(peerId: string): Promise<void> {
    const peerData = this.peerConnections.get(peerId);
    if (!peerData) return;

    try {
      await peerData.connection.restartIce();

      if (peerData.connection.connectionState === "failed") {
        this.peerConnections.delete(peerId);
        await this.createPeerConnection(peerId, true);
      }
    } catch (error) {
      console.error("Error recovering connection:", error);
      toast.error("Connection recovery failed");
    }
  }

  private addLocalTracks(
    peerConnection: RTCPeerConnection,
    peerData: PeerConnection
  ): void {
    if (!this.localStream) return;
    const existingSenders = peerData.connection.getSenders();
    for (const track of this.localStream.getTracks()) {
      if (track.kind === "video") {
        const existingVideoSender = existingSenders.find(
          (s) => s.track?.kind === "video"
        );
        if (existingVideoSender) {
          try {
            existingVideoSender.replaceTrack(track);
            peerData.cameraSender = existingVideoSender;
            continue;
          } catch (e) {
            console.warn(
              "[addLocalTracks] replaceTrack failed, falling back to addTrack",
              e
            );
          }
        }
        try {
          peerData.cameraSender = peerConnection.addTrack(
            track,
            this.localStream
          );
        } catch (e) {
          console.warn("[addLocalTracks] addTrack(video) failed", e);
        }
      } else if (track.kind === "audio") {
        try {
          peerConnection.addTrack(track, this.localStream);
        } catch (e) {
          console.warn("[addLocalTracks] addTrack(audio) failed", e);
        }
      }
    }
  }

  private updateTracksOnAllPeers(): void {
    console.log("[Update Tracks Step 1] Updating tracks on all peers");
    this.peerConnections.forEach((peerData, peerId) => {
      console.log(`[Update Tracks Step 2] Updating tracks for peer ${peerId}`);

      const senders = peerData.connection.getSenders();

      for (const sender of senders) {
        try {
          const kind = sender.track?.kind;
          if (!kind) continue;
          const replacement = this.localStream
            ?.getTracks()
            .find((t) => t.kind === kind);
          if (replacement) {
            try {
              sender.replaceTrack(replacement);
              if (kind === "video") {
                peerData.cameraSender = sender;
              }
            } catch (e) {
              try {
                peerData.connection.removeTrack(sender);
              } catch (err) {}
            }
          } else {
            try {
              peerData.connection.removeTrack(sender);
            } catch (e) {}
          }
        } catch (e) {
          console.warn("[updateTracksOnAllPeers] sender handling error", e);
        }
      }

      this.addLocalTracks(peerData.connection, peerData);
    });
  }

  public isConnected(): boolean {
    return this.isInitialized && this.peerConnections.size > 0;
  }

  public getParticipantCount(): number {
    return this.peerConnections.size;
  }

  public getPeerStates(): string[] {
    const states: string[] = [];
    this.peerConnections.forEach((peer) => {
      if (peer.connection?.iceConnectionState) {
        states.push(peer.connection.iceConnectionState);
      }
    });
    return states;
  }

  private isOfferer(): boolean {
    return this.participantRole === "developer";
  }

  private addScreenTrackToAllPeers(
    screenTrack: MediaStreamTrack,
    screenStream: MediaStream
  ) {
    console.log("[WebRTC] addScreenTrackToAllPeers called");
    this.peerConnections.forEach((peerData, peerId) => {
      if (!peerData.screenSender) {
        try {
          console.log(`[WebRTC] Adding screen track to peer ${peerId}`);
          peerData.screenSender = peerData.connection.addTrack(
            screenTrack,
            screenStream
          );
        } catch (e) {
          console.warn("[addScreenTrackToAllPeers] addTrack failed", e);
        }
      } else {
        console.log(`[WebRTC] Screen sender already exists for peer ${peerId}`);
      }
    });
  }

  private removeScreenTrackFromAllPeers() {
    console.log("[WebRTC] removeScreenTrackFromAllPeers called");
    this.peerConnections.forEach((peerData, peerId) => {
      if (peerData.screenSender) {
        try {
          console.log(`[WebRTC] Removing screen track from peer ${peerId}`);
          peerData.connection.removeTrack(peerData.screenSender);
        } catch (e) {
          console.warn("[removeScreenTrackFromAllPeers] removeTrack failed", e);
        }
        peerData.screenSender = undefined;
      }
    });
  }

  public async renegotiateAllPeers() {
    for (const [peerId, peerData] of this.peerConnections.entries()) {
      const pc = peerData.connection;

      if (pc.signalingState !== "stable") {
        console.log(
          `[WebRTC] Skip renegotiation for ${peerId}, signalingState=${pc.signalingState}`
        );
        continue;
      }

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socketService.emit("webrtc:offer", {
          sdp: offer,
          to: peerId,
          from: this.userId,
          sessionId: this.roomId,
        });

        console.log(`[WebRTC] Renegotiation offer sent to ${peerId}`);
      } catch (err) {
        console.error(`[WebRTC] Error renegotiating with ${peerId}:`, err);
      }
    }
  }

  private async handleSocketDisconnect() {
    console.log(
      "[WebRTC] Socket disconnected — waiting for potential reconnect..."
    );
    if (this.socketDisconnectTimer) {
      clearTimeout(this.socketDisconnectTimer);
    }
    this.socketDisconnectTimer = setTimeout(() => {
      if (!socketService.isConnected?.()) {
        console.log(
          "[WebRTC] Socket still disconnected after timeout, performing full cleanup"
        );
        this.cleanup(false);
      }
    }, this.socketDisconnectFallbackTimeout);
  }
}

export const webRTCService = new WebRTCService();
