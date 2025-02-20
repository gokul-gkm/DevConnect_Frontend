import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminApi from '@/service/Api/AdminApi';
import toast from 'react-hot-toast';

interface QueryParams {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  status: string;
}

export const useDevRequests = (initialParams = {}) => {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    status: 'pending',
    ...initialParams
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['developer-requests', queryParams],
    queryFn: async () => {
      try {
        const response = await AdminApi.getDevelopers(queryParams);
        return response;
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error fetching developer requests');
        throw error;
      }
    }
  });

  const approveMutation = useMutation({
    mutationFn: (developerId: string) => AdminApi.approveDeveloperRequest(developerId),
    onSuccess: () => {
      toast.success('Developer request approved successfully');
      queryClient.invalidateQueries({ queryKey: ['developer-requests'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ developerId, reason }: { developerId: string; reason: string }) => 
      AdminApi.rejectDeveloperRequest(developerId, reason),
    onSuccess: () => {
      toast.success('Developer request rejected successfully');
      queryClient.invalidateQueries({ queryKey: ['developer-requests'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  });

  const updateParams = (newParams: Partial<QueryParams>) => {
    setQueryParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    developers: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    queryParams,
    updateParams,
    approveDeveloper: approveMutation.mutate,
    rejectDeveloper: rejectMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending
  };
};