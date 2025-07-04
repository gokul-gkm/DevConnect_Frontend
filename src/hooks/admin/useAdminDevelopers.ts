import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminApi from '@/service/Api/AdminApi';
import { toast } from 'react-hot-toast';

interface QueryParams {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  status: string;
}

export const useAdminDevelopers = (initialParams = {}) => {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    status: 'approved',
    ...initialParams
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['developers', queryParams],
    queryFn: async () => {
      try {
        const response = await AdminApi.getDevelopers(queryParams);
        return response;
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error fetching developers');
        throw error;
      }
    }
  });

  const queryClient = useQueryClient();

  const toggleStatusMutation = useMutation({
    mutationFn: (developerId: string) => AdminApi.updateUserStatus(developerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developers'] });
      toast.success('Developer status updated successfully', {
        style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }
      });
    },
    onError: () => {
      toast.error('Failed to update developer status', {
        style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }
      });
    }
  });

  const updateParams = (newParams: Partial<QueryParams>) => {
    setQueryParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    developers: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    queryParams,
    updateParams,
    toggleStatusMutation
  };
};