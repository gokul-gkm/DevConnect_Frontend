import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { useAppSelector } from '@/hooks/useAppSelector';

type OnlineStatusDotProps = {
  userId?: string;
  developerId?: string;
  pulseAnimation?: boolean;
  className?: string;
};

const dotVariants = cva(
  "w-2.5 h-2.5 rounded-full border border-zinc-900",
  {
    variants: {
      status: {
        online: "bg-green-500",
        offline: "bg-zinc-500",
      },
    },
    defaultVariants: {
      status: "offline",
    },
  }
);

export const OnlineStatusDot = ({ 
  userId, 
  developerId, 
  pulseAnimation = true,
  className = ''
}: OnlineStatusDotProps) => {
  const onlineStatus = useAppSelector(state => state.chat.onlineStatus);
  const id = userId || developerId;
  
  const isOnline = id && id in onlineStatus ? onlineStatus[id] : false;
  
  return (
    <div className={`relative w-2.5 h-2.5 ${className}`}>
      <div className={dotVariants({ status: isOnline ? 'online' : 'offline' })} />
      
      {isOnline && pulseAnimation && (
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500 pointer-events-none"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
}; 