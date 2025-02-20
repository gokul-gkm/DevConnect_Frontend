import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthApi from '@/service/Api/AuthApi';

interface ResetPasswordData {
  token: string;
  password: string;
}

export const useResetPassword = () => {
  const navigate = useNavigate();

  const {
    mutate: resetPassword,
    isPending: isResetting,
    error
  } = useMutation({
    mutationFn: async ({ token, password }: ResetPasswordData) => {
      try {
        const response = await AuthApi.resetPassword(token, password);
        return response;
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Password reset successful!");
      navigate("/auth/login");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to reset password. Please try again."
      );
    }
  });

  return {
    resetPassword,
    isResetting,
    error
  };
};