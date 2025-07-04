import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  gradient?: string;
  className?: string;
  delay?: number;
  iconClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export const StatsCard = ({
  label,
  value,
  icon: Icon,
  gradient = 'from-gray-900 to-black',
  className,
  delay = 0,
  iconClassName,
  labelClassName,
  valueClassName,
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "p-4 min-h-[110px]",
        "bg-gradient-to-br",
        gradient,
        "border border-white/5 hover:border-white/10",
        "transition-all duration-300",
        "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50",
        "flex items-center",
        className
      )}
    >
      <div className="flex items-center gap-3 w-full">
        <div className={cn(
          "p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0",
          iconClassName
        )}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className={cn(
            "text-xs text-gray-400 truncate",
            labelClassName
          )}>
            {label}
          </span>
          <span className={cn(
            "text-xl font-bold text-white truncate",
            valueClassName
          )}>
            {value}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
