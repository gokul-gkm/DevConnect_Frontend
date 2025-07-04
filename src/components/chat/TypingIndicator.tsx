import { motion } from 'framer-motion';

type TypingIndicatorProps = {
  isTyping?: boolean;
  inline?: boolean;
  className?: string;
};

export const TypingIndicator = ({ isTyping = false, inline = false, className = '' }: TypingIndicatorProps) => {
  if (!isTyping) return null;
  
  return (
    <div className={`flex items-center ${inline ? 'inline-flex' : ''} ${className}`}>
      <div className="flex space-x-1">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
          className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
          className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
          className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
        />
      </div>
      {inline && <span className="ml-2 text-xs text-zinc-400">typing...</span>}
    </div>
  );
}; 