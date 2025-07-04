import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DevAuthApi from '@/service/Api/DevAuthApi';

export const useDevOTP = () => {
  const navigate = useNavigate();

  const {
    mutate: verifyOtp,
    isPending: isVerifying,
    error: verifyError
  } = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const response = await DevAuthApi.verifyOtp(email, otp);
      return response;
    },
    onSuccess: () => {
      toast.success("OTP verified successfully!");
      navigate("/developer/auth/dev-request");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    }
  });

  const {
    mutate: resendOtp,
    isPending: isResending,
    error: resendError
  } = useMutation({
    mutationFn: async (email: string) => {
      const response = await DevAuthApi.resendOtp(email);
      return response;
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
    verifyError,
    resendOtp,
    isResending,
    resendError
  };
};