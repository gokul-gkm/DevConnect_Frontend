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
}

export const useAdminUsers = (initialParams = {}) => {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialParams
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: async () => {
      try {
        const response = await AdminApi.getUsers(queryParams);
        return response;
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error fetching users');
        throw error;
      }
    }
  });

  const queryClient = useQueryClient();

  const toggleStatusMutation = useMutation({
    mutationFn: (userId: string) => AdminApi.updateUserStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User status updated successfully', {
        style: {
          background: '#1e293b',
          color: '#e2e8f0',
          border: '1px solid #334155'
        }
      });
    },
    onError: () => {
      toast.error('Failed to update user status', {
        style: {
          background: '#1e293b',
          color: '#e2e8f0',
          border: '1px solid #334155'
        }
      });
    }
  });

  const updateParams = (newParams: Partial<QueryParams>) => {
    setQueryParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    users: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    queryParams,
    updateParams,
    toggleStatusMutation
  };
};