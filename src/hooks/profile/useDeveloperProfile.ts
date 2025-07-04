import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DeveloperApi from '@/service/Api/DeveloperApi';

export const useDeveloperProfile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['developerProfile'],
    queryFn: () => DeveloperApi.getProfile(),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true 
  });

  const {
    mutate: updateProfile,
    isPending: isUpdating,
  } = useMutation({
    mutationFn: (formData: FormData) => DeveloperApi.updateProfile(formData),
    onSuccess: async (_updatedProfile) => {
      await queryClient.invalidateQueries({ queryKey: ['developerProfile'] });
      
      toast.success('Profile updated successfully');
      navigate('/developer/profile', { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile,
    isUpdating,
  };
};