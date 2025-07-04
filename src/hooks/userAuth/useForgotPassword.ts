import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import AuthApi from '@/service/Api/AuthApi';

export const useForgotPassword = () => {
  const {
    mutate: forgotPassword,
    isPending: isLoading,
    error
  } = useMutation({
    mutationFn: async (email: string) => {
      try {
        const response = await AuthApi.forgotPassword(email.toLowerCase().trim());
        return response;
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Password reset link has been sent to your email");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send password reset link. Please try again."
      );
    }
  });

  return {
    forgotPassword,
    isLoading,
    error
  };
};