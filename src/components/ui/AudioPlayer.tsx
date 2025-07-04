import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  src: string;
  className?: string;
}

export const AudioPlayer = ({ src, className }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    if (!progressBar || !audioRef.current) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "bg-gradient-to-r from-black/30 to-blue-900/10 p-2.5 rounded-xl flex items-center space-x-3 shadow-lg max-w-full w-full", 
      className
    )}>
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-full transition shadow-md"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-white" />
        ) : (
          <Play className="w-4 h-4 text-white ml-0.5" />
        )}
      </motion.button>

      <div className="flex-1 flex flex-col min-w-0">
        <div 
          ref={progressBarRef}
          className="h-1.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden shadow-inner"
          onClick={handleProgressChange}
        >
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            transition={{ type: "tween" }}
          />
        </div>
        <div className="flex justify-between items-center mt-1.5 text-xs text-white/70">
          <span>{formatTime(currentTime)}</span>
          <span className='mx-1'>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex-shrink-0 bg-blue-600/30 p-2 rounded-full shadow-md hidden sm:block">
        <Volume2 className="w-4 h-4 text-blue-300" />
      </div>
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
    </div>
  );
}; 