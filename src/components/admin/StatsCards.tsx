import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  borderColor: string;
  onClick?: () => void;
};

type StatsCardsProps = {
  stats: StatCardProps[];
  columns?: number;
};

export default function StatsCards({ stats, columns = 3 }: StatsCardsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 border ${
            stat.borderColor
          } shadow-xl backdrop-blur-sm ${stat.onClick ? "cursor-pointer" : ""}`}
          onClick={stat.onClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm font-medium">
                {stat.title}
              </div>
              <div className="text-3xl font-bold text-slate-100 mt-1">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <stat.icon className="h-5 w-5 text-slate-300" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 