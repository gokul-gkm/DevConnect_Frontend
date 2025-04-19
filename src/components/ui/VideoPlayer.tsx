import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
  src: string;
  className?: string;
}

export const VideoPlayer = ({ src, className }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const setVideoData = () => {
      setDuration(video.duration);
    };
    
    const setVideoTime = () => {
      setCurrentTime(video.currentTime);
    };
    
    video.addEventListener('loadeddata', setVideoData);
    video.addEventListener('timeupdate', setVideoTime);
    video.addEventListener('ended', () => setIsPlaying(false));
    
    document.addEventListener('fullscreenchange', () => {
      setIsFullscreen(!!document.fullscreenElement);
    });
    
    return () => {
      video.removeEventListener('loadeddata', setVideoData);
      video.removeEventListener('timeupdate', setVideoTime);
      video.removeEventListener('ended', () => setIsPlaying(false));
      document.removeEventListener('fullscreenchange', () => {
        setIsFullscreen(!!document.fullscreenElement);
      });
    };
  }, []);
  
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };
  
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };
  
  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    if (!progressBar || !videoRef.current) return;
    
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * duration;
  };
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const showControls = () => {
    setIsControlsVisible(true);
    clearTimeout((window as any).controlsTimeout);
    (window as any).controlsTimeout = setTimeout(() => {
      if (isPlaying) setIsControlsVisible(false);
    }, 3000);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative rounded-xl overflow-hidden shadow-lg group max-w-full",
        className
      )}
      onMouseMove={showControls}
      onMouseEnter={() => setIsControlsVisible(true)}
      onTouchStart={() => {
        setIsControlsVisible(true);
        clearTimeout((window as any).controlsTimeout);
        (window as any).controlsTimeout = setTimeout(() => {
          if (isPlaying) setIsControlsVisible(false);
        }, 3000);
      }}
    >
      <video 
        ref={videoRef}
        src={src}
        className="w-full rounded-xl"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: isControlsVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div 
          ref={progressBarRef}
          className="h-1.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden shadow-inner mb-2"
          onClick={handleProgressChange}
        >
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            transition={{ type: "tween" }}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={togglePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-full transition shadow-md"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-white" />
            ) : (
              <Play className="w-3.5 h-3.5 text-white ml-0.5" />
            )}
          </motion.button>
          
          <div className="text-xs text-white/80 w-16">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          
          <motion.button
            onClick={toggleMute}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition backdrop-blur-sm"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-white" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-white" />
            )}
          </motion.button>
          
          <motion.button
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition backdrop-blur-sm ml-auto"
          >
            <Maximize className="w-3.5 h-3.5 text-white" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}; 