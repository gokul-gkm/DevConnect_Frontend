import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Title, Text } from '@tremor/react';
import { User, DollarSign, Wallet, Users } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AdminTable from '@/components/admin/AdminTable';
import { ColumnDef } from '@tanstack/react-table';
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { useRevenueStats } from '@/hooks/revenue/useRevenueStats'

interface Developer {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  sessions: number;
  averageRating: number;
  totalEarnings: number;
}

const RevenuePage = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });

  const { data: revenueStats, isLoading } = useRevenueStats({
    page: pagination.page,
    limit: pagination.limit
  });

  const updateParams = (params: { page?: number; limit?: number }) => {
    setPagination(prev => ({
      ...prev,
      ...params
    }));
  };

  const columns: ColumnDef<Developer>[] = [
    {
      accessorKey: 'name',
      header: 'Developer',
      cell: ({ row }) => {
        const dev = row.original;
        return (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-purple-500/20">
              <img 
                src={dev.profilePicture || '/assets/default-avatar.png'} 
                alt={dev.name} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/default-avatar.png';
                }}
              />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{dev.name}</div>
              <div className="text-xs text-slate-400">{dev.email}</div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'sessions',
      header: 'No of Sessions',
      cell: ({ row }) => <span className="text-slate-300">{row.original.sessions}</span>
    },
    {
      accessorKey: 'averageRating',
      header: 'Average Rating',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="text-yellow-500">★</div>
          <div className="text-sm text-slate-300 ml-1">{row.original.averageRating}</div>
        </div>
      )
    },
    {
      accessorKey: 'totalEarnings',
      header: 'Total Earnings',
      cell: ({ row }) => <span className="text-slate-300">₹ {row.original.totalEarnings}</span>
    }
  ];

  if (isLoading || !revenueStats) {
    return (
      <LoadingSpinner
        size="lg"
        text="Loading Revenue Data..."
        color="indigo"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/60 p-8 rounded-2xl border border-slate-800/50 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Revenue Analytics
            </h1>
            <p className="text-slate-400 mt-1">
              Track revenue, platform fees, and developer earnings
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Financial Overview
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-full">
            <StatCard
              title="Total Revenue"
              value={`₹${revenueStats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              description="Overall platform earnings"
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 shadow-lg backdrop-blur-md"
            />
          </div>
          <div className="h-full">
            <StatCard
              title="Platform Fees"
              value={`₹${revenueStats.platformFees.toLocaleString()}`}
              icon={Wallet}
              description="Revenue from platform fees"
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 shadow-lg backdrop-blur-md"
            />
          </div>
          <div className="h-full">
            <StatCard
              title="Developer Earnings"
              value={`₹${revenueStats.developerEarnings.toLocaleString()}`}
              icon={User}
              description="Paid to developers"
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 shadow-lg backdrop-blur-md"
            />
          </div>
          <div className="h-full">
            <StatCard
              title="Total Sessions"
              value={revenueStats.sessions.toString()}
              icon={Users}
              description="Completed sessions"
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 shadow-lg backdrop-blur-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <RevenueChart data={revenueStats.monthlyRevenue} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="overflow-hidden rounded-xl border border-slate-700/30">
            <Card className="bg-slate-900/60 border-0 shadow-xl backdrop-blur-lg rounded-xl p-6">
              <div className="mb-6">
                <Title className="text-white text-lg font-semibold">Earnings By Developers</Title>
                <Text className="text-slate-400 text-sm">Top performing developers by revenue</Text>
              </div>
              
              <AdminTable
                data={revenueStats.topEarningDevelopers}
                columns={columns}
                pagination={revenueStats.pagination}
                updateParams={updateParams}
                isLoading={isLoading}
                emptyMessage="No developer earnings data available"
              />
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RevenuePage;
