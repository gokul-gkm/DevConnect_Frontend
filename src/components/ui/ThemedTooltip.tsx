"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
  disabled?: boolean;
}

export function Tooltip({ 
  children, 
  content, 
  position = "top", 
  delay = 0,
  className = "",
  disabled = false 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled) {
    return <>{children}</>;
  }

  const showTooltip = () => {
    if (delay > 0) {
      setTimeout(() => setIsVisible(true), delay);
    } else {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return {
          tooltipPosition: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
          arrowPosition: "top-full left-1/2 transform -translate-x-1/2",
          arrowBorder: "border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black/90"
        };
      case "bottom":
        return {
          tooltipPosition: "top-full left-1/2 transform -translate-x-1/2 mt-2",
          arrowPosition: "bottom-full left-1/2 transform -translate-x-1/2",
          arrowBorder: "border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-black/90"
        };
      case "left":
        return {
          tooltipPosition: "right-full top-1/2 transform -translate-y-1/2 mr-2",
          arrowPosition: "left-full top-1/2 transform -translate-y-1/2",
          arrowBorder: "border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-black/90"
        };
      case "right":
        return {
          tooltipPosition: "left-full top-1/2 transform -translate-y-1/2 ml-2",
          arrowPosition: "right-full top-1/2 transform -translate-y-1/2",
          arrowBorder: "border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-black/90"
        };
      default:
        return {
          tooltipPosition: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
          arrowPosition: "top-full left-1/2 transform -translate-x-1/2",
          arrowBorder: "border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black/90"
        };
    }
  };

  const getAnimationProps = () => {
    switch (position) {
      case "top":
        return { y: 10, originY: 1 };
      case "bottom":
        return { y: -10, originY: 0 };
      case "left":
        return { x: 10, originX: 1 };
      case "right":
        return { x: -10, originX: 0 };
      default:
        return { y: 10, originY: 1 };
    }
  };

  const { tooltipPosition, arrowPosition, arrowBorder } = getPositionStyles();
  const animationProps = getAnimationProps();

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.8, 
              ...animationProps 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0, 
              y: 0 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              ...animationProps 
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              duration: 0.15,
            }}
            className={`absolute ${tooltipPosition} z-50 pointer-events-none`}
          >
            <div className="relative">
              <div className="relative bg-black/80 backdrop-blur-xl text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-2xl border border-white/5 whitespace-nowrap max-w-xs overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/20 pointer-events-none" />
                <div className="absolute inset-0 rounded-xl shadow-inner shadow-white/5 pointer-events-none" />
                <span className="relative z-10">{content}</span>
              </div>
              <div className={`absolute ${arrowPosition}`}>
                <div className="relative">
 
                  <div className={`w-0 h-0 ${arrowBorder.replace('border-t-black/90', 'border-t-black/80').replace('border-b-black/90', 'border-b-black/80').replace('border-l-black/90', 'border-l-black/80').replace('border-r-black/90', 'border-r-black/80')}`}></div>
                  <div className={`absolute ${position === 'top' ? '-top-[1px] left-1/2 transform -translate-x-1/2' : position === 'bottom' ? '-bottom-[1px] left-1/2 transform -translate-x-1/2' : position === 'left' ? '-left-[1px] top-1/2 transform -translate-y-1/2' : '-right-[1px] top-1/2 transform -translate-y-1/2'}`}>
                    <div className={`w-0 h-0 ${position === 'top' ? 'border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-white/10' : position === 'bottom' ? 'border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-white/10' : position === 'left' ? 'border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-white/10' : 'border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-white/10'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}