import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminApi from '@/service/Api/AdminApi';
import toast from 'react-hot-toast';

export const useUserDetails = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userDetails', userId],
    queryFn: () => userId ? AdminApi.getUserDetails(userId) : Promise.reject('No user ID provided'),
    enabled: !!userId,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (userId: string) => AdminApi.updateUserStatus(userId),
    onSuccess: () => {
      toast.success('User status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['userDetails'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  });

  return {
    userData,
    isLoading,
    error,
    refetch,
    toggleStatus: toggleStatusMutation.mutate,
    isUpdating: toggleStatusMutation.isPending
  };
};