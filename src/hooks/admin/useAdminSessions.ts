import { useQuery } from '@tanstack/react-query';
import AdminApi from '@/service/Api/AdminApi';

interface UseSessionsParams {
  page: number;
  limit: number;
  status: string[];
  search?: string;
}

export const useAdminSessions = ({ page, limit, status, search }: UseSessionsParams) => {
  return useQuery({
    queryKey: ['admin-sessions', page, limit, ...status, search],
    queryFn: () => AdminApi.getSessions({
      page,
      limit,
      status,
      search
    }),
  });
};
