import 'chart.js/auto';
import { useState } from 'react';
import { useDashboardStats } from '@/hooks/developer/useDashboardStats';
import { useUpcomingSessionsPreview } from '@/hooks/developer/useUpcomingSessionsPreview';
import { RevenueChart } from '@/components/developer/home/RevenueChart';
import { SessionsChart } from '@/components/developer/home/SessionsChart';
import { UpcomingSessionsPreview } from '@/components/developer/home/UpcomingSessionsPreview';
import { HeroSection } from '@/components/user/home/HeroSection';
const DevDashboard = () => {
  const [year] = useState(new Date().getFullYear());
  const { data: stats} = useDashboardStats(year);
  const { data: upcomingSessions, isLoading: sessionsLoading } = useUpcomingSessionsPreview(2);

  const revenueData = stats?.map((s: any) => s.totalRevenue) || Array(12).fill(0);
  const sessionData = stats?.map((s: any) => s.sessionCount) || Array(12).fill(0);

  return (
    <>
      <HeroSection/>
    <div className="p-6 md:p-16 min-h-screen bg-black">
      
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Developer Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <RevenueChart data={revenueData} year={year} />
        <SessionsChart data={sessionData} year={year} />
      </div>
      <UpcomingSessionsPreview sessions={upcomingSessions || []} loading={sessionsLoading} />
      </div>
      </>
  );
};

export default DevDashboard;
