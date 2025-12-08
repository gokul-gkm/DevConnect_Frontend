import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthApi from '@/service/Api/AuthApi';
import { IRegisterData } from '@/types/types';

export const useRegister = () => {
  const navigate = useNavigate();

  const {
    mutate: register,
    isPending: isRegistering,
    error
  } = useMutation({
    mutationFn: async (data: IRegisterData) => {
      try {
        const response = await AuthApi.register({
          username: data.username.trim(),
          email: data.email.toLowerCase().trim(),
          contact: data.contact.trim(),
          password: data.password,
          confirmPassword: data.confirmPassword
        });
        return response;
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: (response, variables) => {
      toast.success("Registration successful! Please verify your email.");
      if (response?.expiresAt) {
        localStorage.setItem("otp_expires_at", response.expiresAt);
      }
      navigate(`/auth/verify-otp`, { state: { email: variables.email } });
    },
    onError: (error: any) => {
      if (error.response?.data?.message === "Please verify your existing registration. A new OTP has been sent to your email.") {
        toast.error(error.response.data.message);
        navigate(`/auth/verify-otp`, { 
          state: { 
            email: error.response.data.email || error.response.data.user.email 
          } 
        });
      } else {
        toast.error(
          error.message || "Registration failed. Please try again."
        );
      }
    }
  });

  return {
    register,
    isRegistering,
    error
  };
};