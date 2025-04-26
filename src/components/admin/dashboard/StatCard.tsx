import { Card } from "@tremor/react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  trend: number;
  className?: string;
}

export const StatCard = ({ title, value, icon: Icon, description, trend, className }: StatCardProps) => {
  return (
    <Card className={`${className} relative overflow-hidden rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-purple-500/20`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full"></div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/80 border border-purple-500/20 shadow-lg">
          <Icon className="w-6 h-6 text-purple-400" />
        </div>
      </div>
      <div className={`flex items-center gap-1 mt-4 text-xs ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        <span className="flex items-center">
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
        <span className="text-slate-500">vs last month</span>
      </div>
    </Card>
  );
};
