"use client";
import React, { ButtonHTMLAttributes } from 'react';

interface HoverButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function HoverButton({ 
  children = 'Learn more',
  className = '',
  size = 'md',
  ...props
}: HoverButtonProps) {
  const sizeClasses = {
    sm: 'h-10 pl-4 pr-12 text-sm',
    md: 'h-12 pl-5 pr-14 text-base',
    lg: 'h-14 pl-6 pr-16 text-lg'
  };

  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <button
      className={`group relative inline-flex items-center justify-center rounded-full bg-black py-1 font-medium text-neutral-50 transition-colors duration-300 border border-neutral-900 hover:bg-neutral-800 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <span className="z-10 pr-2 transition-transform duration-300 group-hover:translate-x-1">
        {children}
      </span>
      <div 
        className={`absolute right-1 inline-flex items-center justify-end rounded-full bg-neutral-900 transition-all duration-300 ease-out group-hover:w-[calc(100%-8px)] group-hover:bg-neutral-800 ${iconSizes[size]}`}
      >
        <div className="mr-3 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-neutral-50 transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <path
              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}

export default HoverButton;