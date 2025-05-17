import { Card } from "@tremor/react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  className?: string;
}

export const StatCard = ({ title, value, icon: Icon, description, className }: StatCardProps) => {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/30 h-full">
      <Card className={`${className} relative overflow-hidden rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-0 h-full`}>
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
      </Card>
    </div>
  );
};
