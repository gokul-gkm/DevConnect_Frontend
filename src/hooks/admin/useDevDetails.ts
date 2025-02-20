import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminApi from '@/service/Api/AdminApi';
import toast from 'react-hot-toast';

export const useDevDetails = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: developerData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['developer', id],
    queryFn: () => id ? AdminApi.getDeveloperDetails(id) : Promise.reject('No developer ID provided'),
    enabled: !!id
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (userId: string) => AdminApi.updateUserStatus(userId),
    onSuccess: () => {
      toast.success('User status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['developer'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  });

  return {
    developerData,
    isLoading,
    error,
    refetch,
    toggleStatus: toggleStatusMutation.mutate,
    isUpdating: toggleStatusMutation.isPending
  };
};