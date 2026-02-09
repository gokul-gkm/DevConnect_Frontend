import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, colorClass = '' }) => (
  <div
    className={`flex items-center gap-4 bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-xl p-4 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all group min-w-[180px] ${colorClass}`}
    style={{ minHeight: 64 }}
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-white/5">
      {icon}
    </div>
    <div className="flex flex-col justify-center flex-1">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-xl font-semibold text-white leading-tight">{value}</span>
    </div>
  </div>
);
