import { useQuery } from '@tanstack/react-query';
import AdminApi from '@/service/Api/AdminApi';

interface UseLeaderboardParams {
  page: number;
  limit?: number;
  sortBy?: 'combined' | 'rating' | 'earnings' | 'sessions';
}

export function useLeaderboard({ page, limit = 10, sortBy = 'combined' }: UseLeaderboardParams) {
  return useQuery({
    queryKey: ['developerLeaderboard', page, limit, sortBy],
    queryFn: () => AdminApi.getDeveloperLeaderboard(page, limit, sortBy),
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
  });
}
