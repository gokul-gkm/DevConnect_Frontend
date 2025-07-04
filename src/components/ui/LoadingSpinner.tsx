import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  text?: string;
  textSize?: 'xs' | 'sm' | 'base' | 'lg';
  color?: 'default' | 'blue' | 'green' | 'red' | 'purple' | 'indigo' | string;
  bgColor?: 'default' | 'blue' | 'green' | 'red' | 'purple' | 'indigo' | 'black' | string;
  fullScreen?: boolean;
  className?: string;
  textClassName?: string;
  spinnerClassName?: string;
}

const sizeMap = {
  sm: { spinner: 'h-8 w-8', border: 'border-2' },
  md: { spinner: 'h-10 w-10', border: 'border-2' },
  lg: { spinner: 'h-12 w-12', border: 'border-t-2 border-b-2' },
  xl: { spinner: 'h-16 w-16', border: 'border-3' },
};

const colorMap = {
  default: 'border-slate-500',
  blue: 'border-blue-500',
  green: 'border-green-500',
  red: 'border-red-500',
  purple: 'border-purple-500',
  indigo: 'border-indigo-500',
};

const bgColorMap = {
  default: 'bg-gradient-to-br from-slate-950 to-slate-900',
  blue: 'bg-gradient-to-br from-blue-950 to-blue-900',
  green: 'bg-gradient-to-br from-green-950 to-green-900',
  red: 'bg-gradient-to-br from-red-950 to-red-900',
  purple: 'bg-gradient-to-br from-purple-950 to-purple-900',
  indigo: 'bg-gradient-to-br from-indigo-950 to-indigo-900',
  black: 'bg-gradient-to-br from-black to-gray-900',
  dark:'bg-gradient-to-b from-black to-bg-black'
};

const textSizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'lg',
  text = 'Loading...',
  textSize = 'sm',
  color = 'indigo',
  bgColor = 'default',
  fullScreen = true,
  className,
  textClassName,
  spinnerClassName,
}) => {
  const sizeClasses = typeof size === 'string' ? sizeMap[size] : { 
    spinner: `h-${typeof size === 'number' ? Math.min(Math.round(size/4), 64) : 12} w-${typeof size === 'number' ? Math.min(Math.round(size/4), 64) : 12}`,
    border: 'border-2'
  };

  const colorClass = color in colorMap ? colorMap[color as keyof typeof colorMap] : color;
  const backgroundClass = bgColor in bgColorMap ? bgColorMap[bgColor as keyof typeof bgColorMap] : bgColor;
  
  const textSizeClass = textSizeMap[textSize];
  
  const spinnerContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex flex-col items-center gap-4",
        className
      )}
    >
      <div 
        className={cn(
          "animate-spin rounded-full",
          sizeClasses.spinner,
          sizeClasses.border,
          colorClass,
          spinnerClassName
        )} 
      />
      {text && (
        <div 
          className={cn(
            "text-slate-400 animate-pulse",
            textSizeClass,
            textClassName
          )}
        >
          {text}
        </div>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className={cn("flex items-center justify-center min-h-screen", backgroundClass)}>
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;