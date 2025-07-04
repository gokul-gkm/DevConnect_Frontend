import { socketService } from '../socket/socketService';
import { toast } from 'react-hot-toast';

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
  private participantRole: 'user' | 'developer' | null = null;
  private onTrackCallbacks: ((stream: MediaStream, peerId: string) => void)[] = [];
  private onParticipantDisconnectedCallbacks: ((peerId: string) => void)[] = [];
  private onLocalStreamCallbacks: ((stream: MediaStream) => void)[] = [];
  private isScreenSharing = false;
  private isInitialized = false;
  private iceServers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    {
      urls: 'turn:numb.viagenie.ca',
      username: 'webrtc@live.com',
      credential: 'muazkh'
    }
  ];

  constructor() {
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    socketService.off('webrtc:offer', this.handleRemoteOffer.bind(this));
    socketService.off('webrtc:answer', this.handleRemoteAnswer.bind(this));
    socketService.off('webrtc:ice-candidate', this.handleRemoteICECandidate.bind(this));
    socketService.off('webrtc:user-disconnected', this.handleUserDisconnected.bind(this));
    socketService.off('webrtc:session-info', this.handleSessionInfo.bind(this));

    socketService.on('webrtc:offer', this.handleRemoteOffer.bind(this));
    socketService.on('webrtc:answer', this.handleRemoteAnswer.bind(this));
    socketService.on('webrtc:ice-candidate', this.handleRemoteICECandidate.bind(this));
    socketService.on('webrtc:user-disconnected', this.handleUserDisconnected.bind(this));
    socketService.on('webrtc:session-info', this.handleSessionInfo.bind(this));
  }

  public async initialize(sessionId: string, role: 'user' | 'developer', isHost: boolean = false): Promise<boolean> {
    console.log('[Video Call Step 1] Initializing WebRTC service', { sessionId, role, isHost });
    try {

      const currentRole = localStorage.getItem('user-role');
      if (currentRole !== role) {
        console.log(`[Video Call Step 2] Role mismatch, updating role from ${currentRole} to ${role}`);
        localStorage.setItem('user-role', role);
      }

      this.setupSocketListeners();
      console.log('[Video Call Step 2] Socket listeners setup complete');

      if (!socketService.isConnected()) {
        console.log('[Video Call Step 3] Waiting for socket connection...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    const currentSocketRole = socketService.getCurrentRole();
      if (currentSocketRole && currentSocketRole !== role) {
        console.log(`[Video Call Step 4] Role mismatch detected`, { 
          current: currentSocketRole, 
          requested: role 
        });
    
      const token = localStorage.getItem('access-token');
      const reconnected = await socketService.connect(token, role);
      
      if (!reconnected) {
          console.log('[Video Call Step 4.1] Failed to reconnect with correct role');
          throw new Error('Failed to reconnect socket with correct role');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
      if (this.isInitialized) {
        if (this.roomId === sessionId && this.participantRole === role) {
          console.log('[Video Call Step 5] Already initialized with same session and role');
      return true;
    }
    
        console.log('[Video Call Step 6] Cleaning up previous initialization');
      this.cleanup();
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.roomId = sessionId;
    this.participantRole = role;
    
      const userId = localStorage.getItem('user-id');
      if (!userId) {
        console.log('[Video Call Step 7] No user ID found');
        throw new Error('No user ID found');
      }
      this.userId = userId;
      console.log('[Video Call Step 8] User ID set', { userId });

      console.log('[Video Call Step 9] Joining room');
      socketService.emit('webrtc:join-room', { 
        roomId: sessionId, 
        userId: this.userId,
        role: this.participantRole,
        isHost
      });

      this.isInitialized = true;
      console.log('[Video Call Step 10] Initialization complete');
      return true;
    } catch (error) {
      console.error('[Video Call Step 11] Error initializing WebRTC:', error);
      toast.error('Failed to initialize video call');
      return false;
    }
  }

  public async startLocalStream(options: { 
    audio: boolean | MediaTrackConstraints; 
    video: boolean | MediaTrackConstraints 
  } = { audio: true, video: true }): Promise<MediaStream | null> {
    console.log('[Local Stream Step 1] Starting local stream', { options });
    try {
      if (this.localStream) {
        console.log('[Local Stream Step 2] Cleaning up existing local stream');
        this.localStream.getTracks().forEach(track => {
          track.stop();
          this.localStream?.removeTrack(track);
        });
        this.localStream = null;
      }

      const constraints = {
        audio: options.audio,
        video: options.video
      };

      console.log('[Local Stream Step 3] Requesting media with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('[Local Stream Step 4] Media stream obtained:', {
        audioTracks: stream.getAudioTracks().length,
        videoTracks: stream.getVideoTracks().length,
        trackInfo: stream.getTracks().map(t => ({
          kind: t.kind,
          label: t.label,
          enabled: t.enabled
        }))
      });
      
      this.localStream = stream;
      console.log('[Local Stream Step 5] Local stream stored');
      
      this.onLocalStreamCallbacks.forEach(callback => callback(stream));
      console.log('[Local Stream Step 6] Local stream callbacks executed');

      if (this.peerConnections.size > 0) {
        console.log('[Local Stream Step 7] Updating tracks on existing peers');
        this.updateTracksOnAllPeers();
      }
      
      return stream;
    } catch (error) {
      console.error('[Local Stream Step 8] Error getting local stream:', error);
      if (error instanceof DOMException) {
        console.error(`[Local Stream Step 8.1] DOMException type: ${error.name}, Message: ${error.message}`);
      }
      return null;
    }
  }

  public async toggleAudio(enabled: boolean): Promise<boolean> {
    if (!this.localStream) return false;
    
    try {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
      return true;
    } catch (error) {
      console.error('Error toggling audio:', error);
      return false;
    }
  }

  public async toggleVideo(enabled: boolean): Promise<boolean> {
    if (!this.localStream) return false;
    
    try {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
      return true;
    } catch (error) {
      console.error('Error toggling video:', error);
      return false;
    }
  }

  public async startScreenSharing(): Promise<MediaStream | null> {
    console.log('[WebRTC] startScreenSharing called');
    if (!this.roomId || !this.userId) {
      console.error('[WebRTC] Not initialized');
      return null;
    }

    try {
      if (this.localScreenStream) {
        this.localScreenStream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: false
      });

      this.localScreenStream = stream;
      this.isScreenSharing = true;

      const screenTrack = stream.getVideoTracks()[0];
      if (screenTrack) {
        console.log('[WebRTC] Got screen track:', screenTrack.label, screenTrack.id);
        this.addScreenTrackToAllPeers(screenTrack, stream);
        await this.renegotiateAllPeers();

        screenTrack.onended = () => {
          console.log('[WebRTC] Screen share track ended');
          this.stopScreenSharing();
        };
      } else {
        console.warn('[WebRTC] No video track found in screen share stream');
      }

      socketService.emit('webrtc:screen-sharing-started', {
        roomId: this.roomId,
        userId: this.userId
      });

      return stream;
    } catch (error) {
      console.error('[WebRTC] Error starting screen sharing:', error);
      return null;
    }
  }

  public async stopScreenSharing(): Promise<void> {
    console.log('[WebRTC] stopScreenSharing called');
    if (!this.localScreenStream || !this.isScreenSharing) return;

    this.localScreenStream.getTracks().forEach(track => track.stop());
    this.localScreenStream = null;
    this.isScreenSharing = false;

    this.removeScreenTrackFromAllPeers();
    await this.renegotiateAllPeers();

    if (this.roomId && this.userId) {
      socketService.emit('webrtc:screen-sharing-stopped', {
        roomId: this.roomId,
        userId: this.userId
      });
    }
  }

  public onTrack(callback: (stream: MediaStream, peerId: string) => void): void {
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
    
    socketService.emit('webrtc:leave-room', {
      roomId: this.roomId,
      userId: this.userId,
      role: this.participantRole
    });
    
    this.cleanup();
  }

  public cleanup(): void {
    console.log('[Cleanup Step 1] Starting cleanup');
    if (this.localStream) {
      console.log('[Cleanup Step 2] Stopping local stream tracks');
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.localScreenStream) {
      console.log('[Cleanup Step 3] Stopping screen share stream tracks');
      this.localScreenStream.getTracks().forEach(track => track.stop());
      this.localScreenStream = null;
    }
    
    console.log('[Cleanup Step 4] Closing peer connections');
    this.peerConnections.forEach((peerData, peerId) => {
      console.log(`[Cleanup Step 5] Closing connection with ${peerId}`);
      peerData.connection.close();
    });
    
    this.peerConnections.clear();
    this.isInitialized = false;
    this.isScreenSharing = false;
    this.roomId = null;
    console.log('[Cleanup Step 6] Cleanup complete');
  }

  private async handleSessionInfo(data: any): Promise<void> {
    const { participants, roomId } = data;
    console.log(`[Session Info Step 1] Received session info for room ${roomId}:`, participants);
    
    if (roomId !== this.roomId) {
      console.log('[Session Info Step 1.1] Room ID mismatch, skipping');
      return;
    }
    
    console.log('[Session Info Step 2] Cleaning up existing peer connections');
    this.peerConnections.forEach((peerData, _peerId) => {
      peerData.connection.close();
    });
    this.peerConnections.clear();

    for (const participant of participants) {
      if (participant.userId === this.userId) {
        console.log('[Session Info Step 3] Skipping self-connection');
        continue;
      }
      
      console.log(`[Session Info Step 4] Creating peer connection for ${participant.userId}`);
      const peerConnection = await this.createPeerConnection(participant.userId, true);
      if (!peerConnection) {
        console.log(`[Session Info Step 4.1] Failed to create peer connection for ${participant.userId}`);
        continue;
      }
      console.log(`[Session Info Step 4.2] Peer connection created for ${participant.userId}`);
    }
  }

  private async handleRemoteOffer(data: SDPOffer): Promise<void> {
    const { from, sdp, sessionId } = data;
    console.log(`[Remote Offer Step 1] Received offer from ${from}`, {
        sessionId,
        currentRoomId: this.roomId,
        signalingState: this.peerConnections.get(from)?.connection.signalingState
    });
    
    if (sessionId !== this.roomId || from === this.userId) {
        console.log('[Remote Offer Step 1.1] Invalid offer, skipping');
        return;
    }
    
    try {
        console.log('[Remote Offer Step 2] Creating peer connection');
      const peerConnection = await this.createPeerConnection(from, false);
        if (!peerConnection) {
            console.log('[Remote Offer Step 2.1] Failed to create peer connection');
            return;
        }

        const state = peerConnection.connection.signalingState as string;
        // if (state === 'stable' || state === 'have-local-offer') {
        //     console.log(`[Remote Offer Step 3] Connection with ${from} already stable or processing offer, skipping`);
        //     return;
        // }

        if (state === 'have-local-offer' || state === 'have-remote-offer') {
            console.log(`[Remote Offer Step 3] In ${state}, rolling back and setting new remote offer`);
            await peerConnection.connection.setLocalDescription({ type: 'rollback' });
            await peerConnection.connection.setRemoteDescription(new RTCSessionDescription(sdp));
        } else if (state === 'stable') {
            console.log(`[Remote Offer Step 3] In stable, setting remote description directly`);
            await peerConnection.connection.setRemoteDescription(new RTCSessionDescription(sdp));
        } else {
            console.log(`[Remote Offer Step 3] In ${state}, setting remote description directly`);
            await peerConnection.connection.setRemoteDescription(new RTCSessionDescription(sdp));
        }

        if (peerConnection.pendingCandidates) {
            console.log('[Remote Offer Step 6] Processing pending ICE candidates', {
                count: peerConnection.pendingCandidates.length
            });
            for (const candidate of peerConnection.pendingCandidates) {
                await peerConnection.connection.addIceCandidate(new RTCIceCandidate(candidate));
            }
            peerConnection.pendingCandidates = [];
        }

        console.log('[Remote Offer Step 7] Creating answer');
      const answer = await peerConnection.connection.createAnswer();
        console.log('[Remote Offer Step 8] Setting local description');
      await peerConnection.connection.setLocalDescription(answer);
        console.log(`[Remote Offer Step 9] Created and set local answer for ${from}`);

      socketService.emit('webrtc:answer', {
        sdp: answer,
        to: from,
        from: this.userId,
        sessionId: this.roomId
      });
    } catch (error) {
        console.error('[Remote Offer Step 10] Error handling remote offer:', error);
        toast.error('Failed to establish connection');
    }
  }

  private async handleRemoteAnswer(data: SDPOffer): Promise<void> {
    const { from, sdp, sessionId } = data;
    console.log(`[Remote Answer Step 1] Received answer from ${from}`, {
        sessionId,
        currentRoomId: this.roomId
    });
    
    if (sessionId !== this.roomId || from === this.userId) {
        console.log('[Remote Answer Step 1.1] Invalid answer, skipping');
        return;
    }
    
    try {
      const peerData = this.peerConnections.get(from);
      if (!peerData) {
            console.log('[Remote Answer Step 2] No peer connection found');
            throw new Error(`No peer connection found for ${from}`);
        }

        console.log('[Remote Answer Step 3] Checking signaling state', {
            state: peerData.connection.signalingState
        });

        if (peerData.connection.signalingState === 'stable') {
            console.log('[Remote Answer Step 3.1] Connection already stable, skipping answer');
        return;
      }
      
        console.log('[Remote Answer Step 4] Setting remote description');
      await peerData.connection.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log(`[Remote Answer Step 5] Set remote description from ${from}`);
    } catch (error) {
        console.error('[Remote Answer Step 6] Error handling remote answer:', error);
        toast.error('Failed to complete connection');
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
            console.log('Remote description not set, queuing ICE candidate');
            if (!peerData.pendingCandidates) {
                peerData.pendingCandidates = [];
            }
            if (candidate) {
                peerData.pendingCandidates.push(candidate);
            }
            return;
        }
      
      if (candidate) {
        await peerData.connection.addIceCandidate(new RTCIceCandidate(candidate));
            console.log(`Added ICE candidate from ${from}`);
      }
    } catch (error) {
      console.error('Error handling remote ICE candidate:', error);
        toast.error('Failed to establish connection');
    }
  }

  private handleUserDisconnected(data: { userId: string; roomId: string }): void {
    const { userId, roomId } = data;
    
    if (roomId !== this.roomId) return;
    
    console.log(`User ${userId} disconnected from room ${roomId}`);

    const peerData = this.peerConnections.get(userId);
    if (peerData) {
      peerData.connection.close();
      this.peerConnections.delete(userId);
    }

    this.onParticipantDisconnectedCallbacks.forEach(callback => callback(userId));
  }

  private async createPeerConnection(peerId: string, isInitiator: boolean): Promise<PeerConnection | null> {
    console.log(`[Step 1] Creating peer connection for ${peerId}, isInitiator: ${isInitiator}`);
    
    if (peerId === this.userId) {
        console.warn('[Step 1.1] Attempted to create peer connection with self');
        return null;
    }

    let peerData = this.peerConnections.get(peerId);
    if (peerData) {
        console.log(`[Step 1.2] Existing peer connection found for ${peerId}`);
      return peerData;
    }

    console.log('[Step 2] Creating new RTCPeerConnection');
    const peerConnection = new RTCPeerConnection({
        iceServers: this.iceServers,
        iceCandidatePoolSize: 10
    });
    
    peerData = {
      connection: peerConnection,
      streams: []
    };
    
    this.peerConnections.set(peerId, peerData);
    console.log(`[Step 3] Peer connection created and stored for ${peerId}`);

    peerConnection.onconnectionstatechange = async () => {
        console.log(`[Connection State] ${peerId}: ${peerConnection.connectionState}`);
        console.log(`[Signaling State] ${peerId}: ${peerConnection.signalingState}`);
        
        switch (peerConnection.connectionState) {
            case 'disconnected':
            case 'failed':
                console.log(`[Step 4.1] Connection with ${peerId} ${peerConnection.connectionState}, attempting recovery...`);
                await this.handleConnectionRecovery(peerId);
                break;
            case 'closed':
                console.log(`[Step 4.2] Connection with ${peerId} closed, removing from connections`);
                this.peerConnections.delete(peerId);
                break;
            case 'connected':
                console.log(`[Step 4.3] Connection with ${peerId} established successfully`);
                break;
        }
    };

    peerConnection.onicecandidate = (event) => {
      if (this.roomId && this.userId) {
            console.log(`[Step 5] New ICE candidate for ${peerId}:`, {
                candidate: event.candidate,
                state: peerConnection.connectionState,
                signalingState: peerConnection.signalingState
            });
        socketService.emit('webrtc:ice-candidate', {
          candidate: event.candidate,
          to: peerId,
          from: this.userId
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
        signalingState: peerConnection.signalingState
      });

      const [remoteStream] = event.streams;

      if (remoteStream) {
        console.log(`[WebRTC] ontrack: Adding remote stream for ${peerId}`, {
          audioTracks: remoteStream.getAudioTracks().length,
          videoTracks: remoteStream.getVideoTracks().length,
          streamId: remoteStream.id
        });
        peerData!.streams.push(remoteStream);
        this.onTrackCallbacks.forEach(callback => callback(remoteStream, peerId));
      }
    };

    console.log('[Step 7] Adding local tracks to peer connection');
    this.addLocalTracks(peerConnection, peerData);

    if (isInitiator && this.roomId && this.userId) {
        try {
            console.log('[Step 8] Creating offer as initiator');
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
            console.log('[Step 9] Setting local description');
      await peerConnection.setLocalDescription(offer);
            console.log(`[Step 10] Created and set local description for ${peerId}`, {
                type: offer.type,
                sdp: offer.sdp
            });
      
      socketService.emit('webrtc:offer', {
        sdp: offer,
        to: peerId,
        from: this.userId,
        sessionId: this.roomId
      });
        } catch (error) {
            console.error('[Step 8.1] Error creating offer:', error);
            toast.error('Failed to create connection offer');
        }
    }
    
    return peerData;
  }

  private async handleConnectionRecovery(peerId: string): Promise<void> {
    const peerData = this.peerConnections.get(peerId);
    if (!peerData) return;

    try {
      await peerData.connection.restartIce();
      
      if (peerData.connection.connectionState === 'failed') {
        this.peerConnections.delete(peerId);
        await this.createPeerConnection(peerId, true);
      }
    } catch (error) {
      console.error('Error recovering connection:', error);
      toast.error('Connection recovery failed');
    }
  }

  private addLocalTracks(peerConnection: RTCPeerConnection, peerData: PeerConnection): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        if (track.kind === 'video' && !peerData.cameraSender) {
          peerData.cameraSender = peerConnection.addTrack(track, this.localStream!);
        } else if (track.kind === 'audio') {
          peerConnection.addTrack(track, this.localStream!);
        }
      });
    }
  }

  private updateTracksOnAllPeers(): void {
    console.log('[Update Tracks Step 1] Updating tracks on all peers');
    this.peerConnections.forEach((peerData, peerId) => {
      console.log(`[Update Tracks Step 2] Updating tracks for peer ${peerId}`);
      const senders = peerData.connection.getSenders();
      senders.forEach(sender => {
        console.log(`[Update Tracks Step 3] Removing track:`, {
          kind: sender.track?.kind,
          label: sender.track?.label
        });
        peerData.connection.removeTrack(sender);
      });
 
      this.addLocalTracks(peerData.connection, peerData);
    });
  }

  // private shareScreenWithPeer(peerId: string, stream: MediaStream): void {
  //   const peerData = this.peerConnections.get(peerId);
  //   if (!peerData || !stream) return;
    
  //   stream.getTracks().forEach(track => {
  //     peerData.connection.addTrack(track, stream);
  //   });
  // }

  public isConnected(): boolean {
    return this.isInitialized && this.peerConnections.size > 0;
  }

  public getParticipantCount(): number {
    return this.peerConnections.size;
  }

  private addScreenTrackToAllPeers(screenTrack: MediaStreamTrack, screenStream: MediaStream) {
    console.log('[WebRTC] addScreenTrackToAllPeers called');
    this.peerConnections.forEach((peerData, peerId) => {
      if (!peerData.screenSender) {
        console.log(`[WebRTC] Adding screen track to peer ${peerId}`);
        peerData.screenSender = peerData.connection.addTrack(screenTrack, screenStream);
      } else {
        console.log(`[WebRTC] Screen sender already exists for peer ${peerId}`);
      }
    });
  }

  private removeScreenTrackFromAllPeers() {
    console.log('[WebRTC] removeScreenTrackFromAllPeers called');
    this.peerConnections.forEach((peerData, peerId) => {
      if (peerData.screenSender) {
        console.log(`[WebRTC] Removing screen track from peer ${peerId}`);
        peerData.connection.removeTrack(peerData.screenSender);
        peerData.screenSender = undefined;
      }
    });
  }

  private async renegotiateAllPeers() {
    for (const [peerId, peerData] of this.peerConnections.entries()) {
      try {
        const offer = await peerData.connection.createOffer();
        await peerData.connection.setLocalDescription(offer);
        socketService.emit('webrtc:offer', {
          sdp: offer,
          to: peerId,
          from: this.userId,
          sessionId: this.roomId
        });
        console.log(`[WebRTC] Renegotiation offer sent to ${peerId}`);
      } catch (err) {
        console.error(`[WebRTC] Error renegotiating with ${peerId}:`, err);
      }
    }
  }
}
export const webRTCService = new WebRTCService();

