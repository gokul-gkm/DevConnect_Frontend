import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DevAuthApi from '@/service/Api/DevAuthApi';

export const useDevRequest = () => {
  const navigate = useNavigate();

  const {
    mutate: submitRequest,
    isPending: isSubmitting,
    error
  } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await DevAuthApi.devRequest(formData);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Profile submitted successfully!');
        navigate('/developer/auth/login');
      }
    },
    onError: (error: any) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to submit profile');
      }
    }
  });

  return {
    submitRequest,
    isSubmitting,
    error
  };
};