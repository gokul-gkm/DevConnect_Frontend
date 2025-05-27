import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Video, VideoOff, ArrowLeft, 
  Zap, Shield, Camera, Users, Sparkles,
  Settings, Check, Activity, Sliders,
  MonitorSmartphone, Info
} from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { webRTCService } from '@/service/webrtc/webRTCService';
import { useSessionDetails } from '@/hooks/session/useSessionDetails';
import SessionApi from '@/service/Api/SessionApi';
import { useVideoCallState } from '@/hooks/videoCall/useVideoCallState';
import VideoSessionApi from '@/service/Api/VideoSessionApi';

interface MobileAudioSettingsProps {
  isMuted: boolean;
  toggleMute: () => void;
  audioInputDevices: MediaDeviceInfo[];
  selectedAudioDevice: string;
  changeAudioDevice: (deviceId: string) => void;
  audioLevel: number;
}

interface MobileVideoSettingsProps {
  isVideoEnabled: boolean;
  toggleVideo: () => void;
  videoInputDevices: MediaDeviceInfo[];
  selectedVideoDevice: string;
  changeVideoDevice: (deviceId: string) => void;
}

export default function VideoCallLobby() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isReadyToJoin, setIsReadyToJoin] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const audioAnalyser = useRef<AnalyserNode | null>(null);
  const audioDataArray = useRef<Uint8Array | null>(null);
  const [isHost, setIsHost] = useState(false);
  
  const { data: session } = useSessionDetails(sessionId);
  const { isConnected, error: videoCallError, isInitializing, endCall } = useVideoCallState({
    sessionId,
    isHost
  });
  
  useEffect(() => {
    if (videoCallError) {
      toast.error(videoCallError);
    }
  }, [videoCallError]);
  
  useEffect(() => {

    const searchParams = new URLSearchParams(window.location.search);
    const mode = searchParams.get('mode');
    setIsHost(mode === 'host');

    const initCamera = async () => {
      try {
        setIsLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: true 
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        setLocalStream(stream);
        
        setupAudioVisualization(stream);
        
        await getAvailableDevices();
        
        setIsLoading(false);
        
        setTimeout(() => {
          setIsReadyToJoin(true);
        }, 800);
      } catch (err: any) {
        console.error('Error accessing camera/microphone:', err);
        setError(err.message || 'Could not access your camera and microphone');
        setIsLoading(false);
        
        toast.error('Could not access your camera and microphone. Please check your permissions.', {
          duration: 5000,
          style: { background: '#991b1b', color: '#fff', border: '1px solid #ef4444' }
        });
      }
    };
    
    initCamera();
    
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);
  
  const setupAudioVisualization = (stream: MediaStream) => {
    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;
    
    try {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.current.createMediaStreamSource(stream);
      audioAnalyser.current = audioContext.current.createAnalyser();
      audioAnalyser.current.fftSize = 256;
      source.connect(audioAnalyser.current);
      
      const bufferLength = audioAnalyser.current.frequencyBinCount;
      audioDataArray.current = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (!audioAnalyser.current || !audioDataArray.current) return;
        
        audioAnalyser.current.getByteFrequencyData(audioDataArray.current);
        const average = audioDataArray.current.reduce((acc, val) => acc + val, 0) / audioDataArray.current.length;
        setAudioLevel(average);
        
        if (!isMuted) {
          requestAnimationFrame(updateAudioLevel);
        } else {
          setAudioLevel(0);
        }
      };
      
      updateAudioLevel();
    } catch (err) {
      console.error('Error setting up audio visualization:', err);
    }
  };
  
  const getAvailableDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      setAudioInputDevices(audioDevices);
      setVideoInputDevices(videoDevices);
      
      if (audioDevices.length > 0) {
        setSelectedAudioDevice(audioDevices[0].deviceId);
      }
      
      if (videoDevices.length > 0) {
        setSelectedVideoDevice(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error getting available devices:', err);
    }
  };
  
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      
      setIsMuted(!isMuted);
      
      if (isMuted && audioAnalyser.current && audioDataArray.current) {
        requestAnimationFrame(() => {
          if (audioAnalyser.current && audioDataArray.current) {
            audioAnalyser.current.getByteFrequencyData(audioDataArray.current);
            const average = audioDataArray.current.reduce((acc, val) => acc + val, 0) / audioDataArray.current.length;
            setAudioLevel(average);
            
            if (!isMuted) {
              requestAnimationFrame(() => {});
            }
          }
        });
      }
    }
  };
  
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      
      setIsVideoEnabled(!isVideoEnabled);
    }
  };
  
  const changeAudioDevice = async (deviceId: string) => {
    try {
      if (localStream) {
        localStream.getAudioTracks().forEach(track => track.stop());
        
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } },
          video: false
        });
        
        const videoTracks = localStream.getVideoTracks();
        videoTracks.forEach(track => {
          newStream.addTrack(track);
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = newStream;
        }
        
        setLocalStream(newStream);
        setSelectedAudioDevice(deviceId);
        
        setupAudioVisualization(newStream);
      }
    } catch (err) {
      console.error('Error changing audio device:', err);
      toast.error('Could not switch audio device. Please try again.', {
        duration: 3000
      });
    }
  };
  
  const changeVideoDevice = async (deviceId: string) => {
    try {
      if (localStream) {
        localStream.getVideoTracks().forEach(track => track.stop());
        
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { deviceId: { exact: deviceId } }
        });
        
        const audioTracks = localStream.getAudioTracks();
        audioTracks.forEach(track => {
          newStream.addTrack(track);
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = newStream;
        }
        
        setLocalStream(newStream);
        setSelectedVideoDevice(deviceId);
        
        localStorage.setItem('preferred-video-device', deviceId);
      }
    } catch (err) {
      console.error('Error changing video device:', err);
      toast.error('Could not switch video device. Please try again.', {
        duration: 3000
      });
    }
  };
  
  const handleStartCall = () => {
    if (isInitializing) return;
    
    if (isHost) {
      startVideoSession();
    } else {
      if (!isConnected) {
        toast.error('Not connected to video call');
        return;
      }
      localStorage.setItem('call-role', 'user');
      localStorage.setItem('active-session-id', sessionId);
      navigate(`/video-call/${sessionId}?role=user`);
    }
  };
  
  const startVideoSession = async () => {
    try {
 
      await SessionApi.startSession(sessionId);

      await VideoSessionApi.initSession(sessionId)
      
     
      localStorage.setItem('call-role', 'developer');
      localStorage.setItem('active-session-id', sessionId);
      
      navigate(`/video-call/${sessionId}?host=true&role=developer`);
      
      toast.success('Session started successfully. Waiting for user to join.', {
        duration: 5000
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session. Please try again.', {
        duration: 4000
      });
    }
  };
  
  const handleBackToDetails = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (audioContext.current) {
      audioContext.current.close();
    }
    
    navigate(-1);
  };
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex flex-col items-center justify-center z-50">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <div className="relative flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border-[3px] border-zinc-800/80 shadow-[0_0_25px_rgba(0,0,0,0.3)]"></div>
            <div className="w-28 h-28 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin absolute"></div>
            <div className="w-28 h-28 rounded-full border-2 border-transparent border-b-purple-500/70 animate-spin absolute" style={{ animationDuration: '1.5s' }}></div>
            <div className="absolute flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-indigo-400/90" />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-medium text-white mb-3">Preparing Your Call</h2>
        <p className="text-zinc-400 text-sm flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          Setting up camera and microphone...
        </p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex flex-col items-center justify-center z-50 p-4">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl blur-2xl"></div>
          <div className="relative bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-800/80 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)] text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-full blur-xl"></div>
              <div className="relative bg-zinc-900/80 rounded-full w-full h-full flex items-center justify-center border border-zinc-700/50">
                <VideoOff className="w-8 h-8 text-red-400" />
              </div>
            </div>
            
            <h2 className="text-xl font-medium text-white mb-2">
              Camera/Microphone Access Denied
            </h2>
            
            <p className="text-zinc-400 mb-6 text-sm">
              {error}
            </p>
            
            <Button 
              onClick={handleBackToDetails}
              className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl py-2 px-6 mx-auto border border-zinc-700/50 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.3)]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Session Details
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex flex-col overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-3xl opacity-20"></div>
        </div>
        
        <div className="p-4 border-b border-zinc-800/30 bg-black/60 backdrop-blur-sm z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="rounded-full h-9 w-9 p-0 flex items-center justify-center bg-zinc-900/80 border border-zinc-800/50"
                onClick={handleBackToDetails}
              >
                <ArrowLeft className="h-5 w-5 text-zinc-400" />
              </Button>
              
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                  Call Preparation
                  {isReadyToJoin && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                      className="bg-emerald-500/20 text-emerald-400 text-xs font-normal px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/20"
                    >
                      <Check className="w-3 h-3" />
                      Ready
                    </motion.div>
                  )}
                </h1>
                <p className="text-xs text-zinc-400 max-w-md truncate">
                  {session?.title ? `Session: ${session.title}` : 'Check your settings before joining'}
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-indigo-950/80 border border-indigo-500/30">
                <Shield className="h-4 w-4 text-indigo-400" />
              </div>
              <span className="text-sm text-zinc-400">Secure Connection</span>
            </div>
          </div>
        </div>
        

        <div className="flex-grow flex flex-col md:flex-row p-4 max-w-7xl mx-auto">
          <div className="md:flex-1 p-1 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-black/40 shadow-[0_8px_30px_rgba(0,0,0,0.7)] border border-zinc-800/50 aspect-video flex items-center justify-center">
              {isVideoEnabled ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/60 backdrop-blur-sm">
                  <Avatar className="h-20 w-20 mb-3 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white text-xl border-2 border-indigo-500/30">
                      {localStorage.getItem('user-name')?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-zinc-400 text-sm mt-2">Camera Off</span>
                </div>
              )}
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-sm flex items-center gap-2 border border-zinc-800/80"
              >
                <Camera className="h-4 w-4 text-indigo-400" />
                Camera Preview
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-sm flex items-center gap-2 border border-zinc-800/80"
              >
                <Users className="h-4 w-4 text-indigo-400" />
                {session?.userId?.username || session?.developerId?.username ? 
                  `Meeting with ${session?.userId?.username || session?.developerId?.username}` : 
                  'Meeting Preview'}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: !isMuted ? 1 : 0 }}
                className="absolute bottom-16 left-4 right-4 flex items-center gap-2"
              >
                <div className="flex-grow h-1 bg-black/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(audioLevel / 2, 100)}%` }}
                    transition={{ type: "spring", damping: 10 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
              </motion.div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "h-14 w-14 rounded-full backdrop-blur-md shadow-lg",
                      isMuted ? 
                        "bg-red-900/20 text-red-400 border border-red-500/30" : 
                        "bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70"
                    )}
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                  <p>{isMuted ? 'Unmute' : 'Mute'}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "h-14 w-14 rounded-full backdrop-blur-md shadow-lg",
                      isVideoEnabled ? 
                        "bg-zinc-800/70 text-white border border-zinc-700/50 hover:bg-zinc-700/70" : 
                        "bg-red-900/20 text-red-400 border border-red-500/30" 
                    )}
                    onClick={toggleVideo}
                  >
                    {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/90 text-zinc-300 border-zinc-700/50">
                  <p>{isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ 
                opacity: isReadyToJoin ? 1 : 0, 
                y: isReadyToJoin ? 0 : 20,
                scale: isReadyToJoin ? 1 : 0.9
              }}
              transition={{ type: "spring", damping: 12, delay: 0.4 }}
              className="flex justify-center mt-3 mb-6"
            >
              <Button
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl py-3 px-8 mx-auto h-14 text-lg gap-2 border border-emerald-500/30 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.3)]"
                onClick={handleStartCall}
                disabled={!isReadyToJoin}
              >
                <Zap className="w-5 h-5" />
                {isHost ? 'Start Session' : 'Join Call Now'}
              </Button>
            </motion.div>

            <div className="md:hidden mt-4">
              <Tabs defaultValue="audio" className="w-full">
                <TabsList className="grid grid-cols-2 h-12 mb-4 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl">
                  <TabsTrigger value="audio" className="rounded-lg data-[state=active]:bg-indigo-950/80 data-[state=active]:border data-[state=active]:border-indigo-500/30 data-[state=active]:shadow-sm">
                    <Mic className="w-4 h-4 mr-2" />
                    Audio
                  </TabsTrigger>
                  <TabsTrigger value="video" className="rounded-lg data-[state=active]:bg-indigo-950/80 data-[state=active]:border data-[state=active]:border-indigo-500/30 data-[state=active]:shadow-sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Video
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="audio" className="bg-black/50 backdrop-blur-md rounded-xl border border-zinc-800/40 p-5 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.7)]">
                  <MobileAudioSettings 
                    isMuted={isMuted} 
                    toggleMute={toggleMute}
                    audioInputDevices={audioInputDevices}
                    selectedAudioDevice={selectedAudioDevice}
                    changeAudioDevice={changeAudioDevice}
                    audioLevel={audioLevel}
                  />
                </TabsContent>
                
                <TabsContent value="video" className="bg-black/50 backdrop-blur-md rounded-xl border border-zinc-800/40 p-5 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.7)]">
                  <MobileVideoSettings 
                    isVideoEnabled={isVideoEnabled} 
                    toggleVideo={toggleVideo}
                    videoInputDevices={videoInputDevices}
                    selectedVideoDevice={selectedVideoDevice}
                    changeVideoDevice={changeVideoDevice}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="hidden md:block md:w-80 md:ml-6 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/50 backdrop-blur-md rounded-xl border border-zinc-800/40 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-medium text-white">Audio Settings</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="microphone" className="text-zinc-400 text-sm">Microphone</Label>
                  <select 
                    id="microphone"
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={selectedAudioDevice}
                    onChange={(e) => changeAudioDevice(e.target.value)}
                    disabled={audioInputDevices.length === 0}
                  >
                    {audioInputDevices.length === 0 ? (
                      <option value="">No microphones found</option>
                    ) : (
                      audioInputDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Microphone ${audioInputDevices.indexOf(device) + 1}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="micToggle" className="text-zinc-400 text-sm">Microphone</Label>
                    <div className="flex items-center gap-2">
                      {isMuted ? <MicOff className="h-4 w-4 text-red-400" /> : <Mic className="h-4 w-4 text-emerald-400" />}
                      <Switch 
                        id="micToggle" 
                        checked={!isMuted}
                        onCheckedChange={(checked) => {
                          if (checked !== !isMuted) {
                            toggleMute();
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${Math.min(audioLevel / 2, 100)}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-100"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="noiseCancel" className="text-zinc-400 text-sm">Noise Suppression</Label>
                    <Switch id="noiseCancel" defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Label htmlFor="echoCancel" className="text-zinc-400 text-sm">Echo Cancellation</Label>
                    <Switch id="echoCancel" defaultChecked />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/50 backdrop-blur-md rounded-xl border border-zinc-800/40 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <MonitorSmartphone className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-medium text-white">Video Settings</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="camera" className="text-zinc-400 text-sm">Camera</Label>
                  <select 
                    id="camera"
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={selectedVideoDevice}
                    onChange={(e) => changeVideoDevice(e.target.value)}
                    disabled={videoInputDevices.length === 0}
                  >
                    {videoInputDevices.length === 0 ? (
                      <option value="">No cameras found</option>
                    ) : (
                      videoInputDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${videoInputDevices.indexOf(device) + 1}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="videoToggle" className="text-zinc-400 text-sm">Camera</Label>
                    <div className="flex items-center gap-2">
                      {isVideoEnabled ? <Video className="h-4 w-4 text-emerald-400" /> : <VideoOff className="h-4 w-4 text-red-400" />}
                      <Switch 
                        id="videoToggle" 
                        checked={isVideoEnabled}
                        onCheckedChange={(checked) => {
                          if (checked !== isVideoEnabled) {
                            toggleVideo();
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="hdVideo" className="text-zinc-400 text-sm">HD Video</Label>
                    <Switch id="hdVideo" defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Label htmlFor="mirrorVideo" className="text-zinc-400 text-sm">Mirror View</Label>
                    <Switch id="mirrorVideo" defaultChecked />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/50 backdrop-blur-md rounded-xl border border-zinc-800/40 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-medium text-white">Session Info</h2>
              </div>
              
              {session ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                    <p className="text-sm text-zinc-400 mb-1">Title</p>
                    <p className="text-white font-medium">{session.title}</p>
                  </div>
                  
                  {(session.userId || session.developerId) && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <Avatar className="h-10 w-10 ring-2 ring-indigo-500/20">
                        <AvatarImage src={session.userId?.profilePicture || session.developerId?.profilePicture} />
                        <AvatarFallback className="bg-indigo-900/80 text-white">
                          {(session.userId?.username || session.developerId?.username || 'U')[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white">{session.userId?.username || session.developerId?.username}</p>
                        <p className="text-xs text-zinc-400">{session.userId ? 'User' : 'Developer'}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-zinc-500">Session information not available</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function MobileAudioSettings({ 
  isMuted, 
  toggleMute,
  audioInputDevices,
  selectedAudioDevice,
  changeAudioDevice,
  audioLevel
}: MobileAudioSettingsProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Label htmlFor="mobileMicrophone" className="text-zinc-400 text-sm">Microphone Device</Label>
        <select 
          id="mobileMicrophone"
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={selectedAudioDevice}
          onChange={(e) => changeAudioDevice(e.target.value)}
          disabled={audioInputDevices.length === 0}
        >
          {audioInputDevices.length === 0 ? (
            <option value="">No microphones found</option>
          ) : (
            audioInputDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${audioInputDevices.indexOf(device) + 1}`}
              </option>
            ))
          )}
        </select>
      </div>
      
      <div className="pt-2 space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center gap-2">
            {isMuted ? <MicOff className="h-5 w-5 text-red-400" /> : <Mic className="h-5 w-5 text-emerald-400" />}
            <span className="text-white text-sm">{isMuted ? 'Microphone Off' : 'Microphone On'}</span>
          </div>
          <Switch 
            checked={!isMuted}
            onCheckedChange={(checked) => {
              if (checked !== !isMuted) {
                toggleMute();
              }
            }}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 text-sm">Audio Level</span>
            <Activity className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${Math.min(audioLevel / 2, 100)}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-100"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-2 space-y-3">
        <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <span className="text-white text-sm">Noise Suppression</span>
          <Switch defaultChecked />
        </div>
        
        <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <span className="text-white text-sm">Echo Cancellation</span>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );
}

function MobileVideoSettings({ 
  isVideoEnabled, 
  toggleVideo,
  videoInputDevices,
  selectedVideoDevice,
  changeVideoDevice
}: MobileVideoSettingsProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Label htmlFor="mobileCamera" className="text-zinc-400 text-sm">Camera Device</Label>
        <select 
          id="mobileCamera"
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={selectedVideoDevice}
          onChange={(e) => changeVideoDevice(e.target.value)}
          disabled={videoInputDevices.length === 0}
        >
          {videoInputDevices.length === 0 ? (
            <option value="">No cameras found</option>
          ) : (
            videoInputDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${videoInputDevices.indexOf(device) + 1}`}
              </option>
            ))
          )}
        </select>
      </div>
      
      <div className="pt-2 space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center gap-2">
            {isVideoEnabled ? <Video className="h-5 w-5 text-emerald-400" /> : <VideoOff className="h-5 w-5 text-red-400" />}
            <span className="text-white text-sm">{isVideoEnabled ? 'Camera On' : 'Camera Off'}</span>
          </div>
          <Switch 
            checked={isVideoEnabled}
            onCheckedChange={(checked) => {
              if (checked !== isVideoEnabled) {
                toggleVideo();
              }
            }}
          />
        </div>
      </div>
      
      <div className="mt-2 space-y-3">
        <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <span className="text-white text-sm">HD Video</span>
          <Switch defaultChecked />
        </div>
        
        <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <span className="text-white text-sm">Mirror View</span>
          <Switch defaultChecked />
        </div>
        
        <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <span className="text-white text-sm">Optimize for Low Light</span>
          <Switch />
        </div>
      </div>
    </div>
  );
}
