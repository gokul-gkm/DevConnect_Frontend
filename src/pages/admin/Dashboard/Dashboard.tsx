import {motion } from 'framer-motion'
import { StatCard } from '@/components/admin/dashboard/StatCard'
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart'
import { UserGrowthChart } from '@/components/admin/dashboard/UserGrowthChart'
import { TopDevelopers } from '@/components/admin/dashboard/TopDevelopers'
import { Users, Code2, DollarSign, Calendar, TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import AdminApi from '@/service/Api/AdminApi'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const Dashboard = () => {
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: AdminApi.getDashboardStats
  })

  if (isLoading || !dashboardStats) {
    return (
        <LoadingSpinner
        size="lg"
        text="Loading Dashboard..."
        color="indigo"
        fullScreen={true}
      />
    )
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
                            Dashboard Overview
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Monitor and analyze your platform's performance
                        </p>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                        <span className="text-sm font-medium text-purple-300">
                            Analytics Dashboard
                        </span>
                    </div>
                </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={dashboardStats.totalUsers}
            icon={Users}
            description="Active platform users"
            trend={12.5}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-slate-700/30 shadow-lg backdrop-blur-md"
          />
          <StatCard
            title="Total Developers"
            value={dashboardStats.totalDevelopers}
            icon={Code2}
            description="Verified developers"
            trend={8.2}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-slate-700/30 shadow-lg backdrop-blur-md"
          />
          <StatCard
            title="Total Revenue"
            value={`$${dashboardStats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="Platform earnings"
            trend={15.8}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-slate-700/30 shadow-lg backdrop-blur-md"
          />
          <StatCard
            title="Total Sessions"
            value={dashboardStats.totalSessions}
            icon={Calendar}
            description="Completed sessions"
            trend={-2.4}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-slate-700/30 shadow-lg backdrop-blur-md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={dashboardStats.revenueData} />
          <UserGrowthChart data={dashboardStats.userGrowthData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <TopDevelopers developers={dashboardStats.topDevelopers} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
