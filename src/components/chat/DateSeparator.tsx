import { motion } from 'framer-motion';
import { formatDateSeparator } from '@/utils/date';

interface DateSeparatorProps {
  timestamp: string | Date;
}

export const DateSeparator = ({ timestamp }: DateSeparatorProps) => {
  const dateText = formatDateSeparator(timestamp);
  
  if (!dateText) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center my-4"
    >
      <div className="px-3 py-1.5 rounded-full bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50">
        <span className="text-xs text-zinc-400 font-medium">{dateText}</span>
      </div>
    </motion.div>
  );
};
