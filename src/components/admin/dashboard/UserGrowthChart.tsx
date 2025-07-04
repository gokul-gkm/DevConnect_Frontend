import { Card, Title } from "@tremor/react";
import { Line, LineChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface UserGrowthChartProps {
  data: {
    date: string;
    users: number;
    developers: number;
  }[];
}

export const UserGrowthChart = ({ data }: UserGrowthChartProps) => {
  return (
    <Card className="bg-slate-900/60 border-slate-700/30 shadow-xl backdrop-blur-lg rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <Title className="text-white text-lg font-semibold">User Growth</Title>
        <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">
          Last 6 months
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              stroke="#475569"
              tick={{ fill: '#94a3b8' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#475569"
              tick={{ fill: '#94a3b8' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(51, 65, 85, 0.5)',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#f8fafc', fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ paddingTop: '10px' }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#a78bfa"
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#a78bfa' }}
              name="Users"
            />
            <Line
              type="monotone"
              dataKey="developers"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#22c55e' }}
              name="Developers"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
