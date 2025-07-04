import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatsCardGridProps {
  children: ReactNode;
  className?: string;
  cols?: number;
}

export const StatsCardGrid = ({ 
  children, 
  className,
  cols = 4
}: StatsCardGridProps) => {
  const colsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
  }[cols] || 'grid-cols-2 md:grid-cols-4';

  return (
    <div className={cn(
      `max-w-5xl mx-auto grid ${colsClass} gap-4`,
      className
    )}>
      {children}
    </div>
  );
}; 