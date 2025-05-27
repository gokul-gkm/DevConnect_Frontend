import { socketService } from '../socket/socketService';
import { toast } from 'react-hot-toast';

interface PeerConnection {
  connection: RTCPeerConnection;
  streams: MediaStream[];
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
    try {
      this.setupSocketListeners();

      if (!socketService.isConnected()) {
        console.log('Waiting for socket connection to stabilize...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const currentSocketRole = socketService.getCurrentRole();
      if (currentSocketRole && currentSocketRole !== role) {
        console.log(`Role mismatch in WebRTC (socket: ${currentSocketRole}, requested: ${role})`);
        
        const token = localStorage.getItem('access-token');
        const reconnected = await socketService.connect(token, role);
        
        if (!reconnected) {
          throw new Error('Failed to reconnect socket with correct role');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (this.isInitialized) {
        if (this.roomId === sessionId && this.participantRole === role) {
          return true;
        }
        
        this.cleanup();
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      this.roomId = sessionId;
      this.participantRole = role;
      
      const userId = localStorage.getItem('user-id');
      if (!userId) {
        throw new Error('No user ID found');
      }
      this.userId = userId;

      socketService.emit('webrtc:join-room', { 
        roomId: sessionId, 
        userId: this.userId,
        role: this.participantRole,
        isHost
      });

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      toast.error('Failed to initialize video call');
      return false;
    }
  }

  public async startLocalStream(options: { 
    audio: boolean | MediaTrackConstraints; 
    video: boolean | MediaTrackConstraints 
  } = { audio: true, video: true }): Promise<MediaStream | null> {
    try {
      
      if (this.localStream) {
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

      console.log('Requesting media with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Media stream obtained:', {
        audioTracks: stream.getAudioTracks().length,
        videoTracks: stream.getVideoTracks().length,
        trackInfo: stream.getTracks().map(t => ({
          kind: t.kind,
          label: t.label,
          enabled: t.enabled
        }))
      });
      
      this.localStream = stream;
      
      this.onLocalStreamCallbacks.forEach(callback => callback(stream));

      if (this.peerConnections.size > 0) {
        this.updateTracksOnAllPeers();
      }
      
      return stream;
    } catch (error) {
      console.error('Error getting local stream:', error);
      if (error instanceof DOMException) {
        console.error(`DOMException type: ${error.name}, Message: ${error.message}`);
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
    if (!this.roomId || !this.userId) {
      console.error('WebRTC not initialized');
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
      
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        this.stopScreenSharing();
      });
      
      this.peerConnections.forEach((peerData, peerId) => {
        this.shareScreenWithPeer(peerId, stream);
      });
      
      socketService.emit('webrtc:screen-sharing-started', {
        roomId: this.roomId,
        userId: this.userId
      });
      
      return stream;
    } catch (error) {
      console.error('Error starting screen sharing:', error);
      return null;
    }
  }

  public stopScreenSharing(): void {
    if (!this.localScreenStream || !this.isScreenSharing) return;

    this.localScreenStream.getTracks().forEach(track => track.stop());
    this.localScreenStream = null;
    this.isScreenSharing = false;

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
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.localScreenStream) {
      this.localScreenStream.getTracks().forEach(track => track.stop());
      this.localScreenStream = null;
    }
    
    this.peerConnections.forEach((peerData, peerId) => {
      peerData.connection.close();
    });
    
    this.peerConnections.clear();
    this.isInitialized = false;
    this.isScreenSharing = false;
    this.roomId = null;
  }

  private async handleSessionInfo(data: any): Promise<void> {
    const { participants, roomId } = data;
    console.log(`Session info received for room ${roomId}:`, participants);
    
    if (roomId !== this.roomId) return;
    
    this.peerConnections.forEach((peerData, peerId) => {
        peerData.connection.close();
    });
    this.peerConnections.clear();

    for (const participant of participants) {
        if (participant.userId === this.userId) {
            console.log('Skipping self-connection');
            continue;
        }
        
        const peerConnection = await this.createPeerConnection(participant.userId, true);
        if (!peerConnection) continue;
    }
  }

  private async handleRemoteOffer(data: SDPOffer): Promise<void> {
    const { from, sdp, sessionId } = data;
    
    if (sessionId !== this.roomId || from === this.userId) return;
    
    console.log(`Received offer from ${from}`);
    
    try {
        const peerConnection = await this.createPeerConnection(from, false);
        if (!peerConnection) return;

        if (peerConnection.connection.signalingState === 'stable' || 
            peerConnection.connection.signalingState === 'have-local-offer') {
            console.log(`Connection with ${from} already stable or processing offer, skipping`);
            return;
        }

        await peerConnection.connection.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log(`Set remote description from ${from}`);

        if (peerConnection.pendingCandidates) {
            for (const candidate of peerConnection.pendingCandidates) {
                await peerConnection.connection.addIceCandidate(new RTCIceCandidate(candidate));
            }
            peerConnection.pendingCandidates = [];
        }

        const answer = await peerConnection.connection.createAnswer();
        await peerConnection.connection.setLocalDescription(answer);
        console.log(`Created and set local answer for ${from}`);

        socketService.emit('webrtc:answer', {
            sdp: answer,
            to: from,
            from: this.userId,
            sessionId: this.roomId
        });
    } catch (error) {
        console.error('Error handling remote offer:', error);
        toast.error('Failed to establish connection');
    }
  }

  private async handleRemoteAnswer(data: SDPOffer): Promise<void> {
    const { from, sdp, sessionId } = data;
    
    if (sessionId !== this.roomId || from === this.userId) return;
    
    console.log(`Received answer from ${from}`);
    
    try {
        const peerData = this.peerConnections.get(from);
        if (!peerData) {
            throw new Error(`No peer connection found for ${from}`);
        }

        if (peerData.connection.signalingState === 'stable') {
            console.log('Connection already stable, skipping answer');
            return;
        }
        
        await peerData.connection.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log(`Set remote description from ${from}`);
    } catch (error) {
        console.error('Error handling remote answer:', error);
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
    if (peerId === this.userId) {
        console.warn('Attempted to create peer connection with self');
        return null;
    }

    let peerData = this.peerConnections.get(peerId);
    if (peerData) {
        return peerData;
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: this.iceServers,
      iceCandidatePoolSize: 10
    });
    
    peerData = {
      connection: peerConnection,
      streams: []
    };
    
    this.peerConnections.set(peerId, peerData);

    peerConnection.onconnectionstatechange = async () => {
      console.log(`Connection state with ${peerId}: ${peerConnection.connectionState}`);
      
      switch (peerConnection.connectionState) {
        case 'disconnected':
          console.log(`Connection with ${peerId} disconnected, attempting recovery...`);
          await this.handleConnectionRecovery(peerId);
          break;
        case 'failed':
          console.log(`Connection with ${peerId} failed, attempting reconnection...`);
          await this.handleConnectionRecovery(peerId);
          break;
        case 'closed':
          this.peerConnections.delete(peerId);
          break;
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (this.roomId && this.userId) {
        console.log(`New ICE candidate for ${peerId}:`, event.candidate);
        socketService.emit('webrtc:ice-candidate', {
          candidate: event.candidate,
          to: peerId,
          from: this.userId
        });
      }
    };
    
    peerConnection.ontrack = (event) => {
      console.log(`Received track from ${peerId}`, event.streams);
      
      const [remoteStream] = event.streams;
      
      if (remoteStream) {
        peerData!.streams.push(remoteStream);
        this.onTrackCallbacks.forEach(callback => callback(remoteStream, peerId));
      }
    };

    this.addLocalTracks(peerConnection);

    if (isInitiator && this.roomId && this.userId) {
      try {
        const offer = await peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        
        await peerConnection.setLocalDescription(offer);
        console.log(`Created and set local description for ${peerId}`);
        
        socketService.emit('webrtc:offer', {
          sdp: offer,
          to: peerId,
          from: this.userId,
          sessionId: this.roomId
        });
      } catch (error) {
        console.error('Error creating offer:', error);
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

  private addLocalTracks(peerConnection: RTCPeerConnection): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }
  }

  private updateTracksOnAllPeers(): void {
    this.peerConnections.forEach((peerData, peerId) => {
      const senders = peerData.connection.getSenders();
      senders.forEach(sender => {
        peerData.connection.removeTrack(sender);
      });
 
      this.addLocalTracks(peerData.connection);
    });
  }

  private shareScreenWithPeer(peerId: string, stream: MediaStream): void {
    const peerData = this.peerConnections.get(peerId);
    if (!peerData || !stream) return;
    
    stream.getTracks().forEach(track => {
      peerData.connection.addTrack(track, stream);
    });
  }

  public isConnected(): boolean {
    return this.isInitialized && this.peerConnections.size > 0;
  }

  public getParticipantCount(): number {
    return this.peerConnections.size;
  }
}
export const webRTCService = new WebRTCService();

