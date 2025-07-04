import React from 'react';
import { motion } from 'framer-motion';
import { BookMarked, Clock, CheckCircle, Calendar, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  stats: any;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats, currentTab, setCurrentTab }) => {
  const statItems = [
    { label: 'All', value: stats?.total || 0, status: 'all', icon: BookMarked },
    { label: 'Pending', value: stats?.pending || 0, status: 'pending', icon: Clock },
    { label: 'Approved', value: stats?.approved || 0, status: 'approved', icon: CheckCircle },
    { label: 'Scheduled', value: stats?.scheduled || 0, status: 'scheduled', icon: Calendar },
    { label: 'Rejected', value: stats?.rejected || 0, status: 'rejected', icon: XCircle },
  ];

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
    >
      {statItems.map((stat, index) => (
        <StatCard 
          key={stat.status}
          stat={stat}
          isActive={currentTab === stat.status}
          onClick={() => setCurrentTab(stat.status)}
          index={index}
        />
      ))}
    </motion.div>
  );
};

interface StatCardProps {
  stat: {
    label: string;
    value: number;
    status: string;
    icon: React.ElementType;
  };
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, isActive, onClick, index }) => {
  const Icon = stat.icon;
  
  return (
    <motion.button
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all duration-300",
        isActive 
          ? "bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-indigo-900/5 border border-purple-500/20" 
          : "bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 hover:border-purple-800/20",
        isActive ? "shadow-[0_0_20px_rgba(168,85,247,0.15)]" : "shadow-lg"
      )}
    >
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
        isActive ? "opacity-10" : "group-hover:opacity-5",
        stat.status === 'pending' ? "from-amber-600 to-amber-900" :
        stat.status === 'approved' ? "from-emerald-600 to-emerald-900" :
        stat.status === 'scheduled' ? "from-blue-600 to-blue-900" :
        stat.status === 'rejected' ? "from-rose-600 to-rose-900" :
        "from-purple-600 to-indigo-900"
      )} />
      
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-all duration-300",
        isActive
          ? cn(
              "bg-zinc-800/80 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
              stat.status === 'pending' ? "text-amber-400" :
              stat.status === 'approved' ? "text-emerald-400" :
              stat.status === 'scheduled' ? "text-blue-400" :
              stat.status === 'rejected' ? "text-rose-400" :
              "text-purple-400"
            )
          : "bg-zinc-800/50 text-zinc-500 group-hover:text-zinc-300"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      
      <motion.span 
        className={cn(
          "text-2xl font-bold transition-colors duration-300",
          isActive ? "text-white" : "text-zinc-300 group-hover:text-white"
        )}
        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {stat.value}
      </motion.span>
      
      <span className={cn(
        "text-xs transition-colors duration-300 mt-1",
        isActive ? "text-purple-300" : "text-zinc-500 group-hover:text-zinc-400"
      )}>
        {stat.label}
      </span>
      
      {isActive && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-500"
          layoutId="activeTab"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};
