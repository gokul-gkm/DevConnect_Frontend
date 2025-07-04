import { useQuery } from '@tanstack/react-query';
import AdminApi from '@/service/Api/AdminApi';

interface UsePaginationParams {
  page: number;
  limit: number;
}

export const useRevenueStats = ({ page, limit }: UsePaginationParams) => {
  return useQuery({
    queryKey: ['revenue-stats', page, limit],
    queryFn: () => AdminApi.getRevenueStats({
      page,
      limit
    }),
  });
};
