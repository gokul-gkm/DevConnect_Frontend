import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import UserApi from '@/service/Api/UserApi';

export const useProfile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        const response = await UserApi.getProfile();
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch profile');
        }
        return response.data;
      } catch (error: any) {
        toast.error(error.response?.data?.message || error.message || 'Failed to fetch profile');
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true
  });

  const {
    mutate: updateProfile,
    isPending: isUpdating
  } = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await UserApi.updateProfile(formData);
        if (!response.success) {
          throw new Error(response.message || 'Failed to update profile');
        }
        return response.data;
      } catch (error: any) {
        toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
        throw error;
      }
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      await refetch();
      toast.success('Profile updated successfully');
      navigate('/profile', { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  return {
    profile,
    isLoading,
    error,
    isError,
    refetch,
    updateProfile,
    isUpdating
  };
};


