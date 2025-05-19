import { useQuery } from '@tanstack/react-query';
import DeveloperApi from '@/service/Api/DeveloperApi';

export const useDashboardStats = (year: number) => {
  return useQuery({
    queryKey: ['dashboard-stats', year],
    queryFn: () => DeveloperApi.getDashboardStats(year),
  });
};
