import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthApi from '@/service/Api/AuthApi';

export const useOTP = () => {
  const navigate = useNavigate();

  const {
    mutate: verifyOtp,
    isPending: isVerifying
  } = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      try {
        const response = await AuthApi.verifyOtp(email, otp);
        return response;
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("OTP verified successfully!");
      navigate("/auth/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    }
  });

  const {
    mutate: resendOtp,
    isPending: isResending
  } = useMutation({
    mutationFn: async (email: string) => {
      try {
        const response = await AuthApi.resendOtp(email);
        return response;
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("New OTP sent successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  });

  return {
    verifyOtp,
    isVerifying,
    resendOtp,
    isResending
  };
};