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
      const response = await AuthApi.verifyOtp(email, otp);
      return response;
    },
    onSuccess: () => {
      toast.success("OTP verified successfully!");
      localStorage.removeItem("otp_expires_at");
      navigate("/auth/login");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to verify OTP");
    }
  });

  const {
    mutateAsync: resendOtp,
    isPending: isResending
  } = useMutation({
    mutationFn: async (email: string) => {
      const response = await AuthApi.resendOtp(email);
      return response;
    },
    onSuccess: (data) => {
      if (data?.expiresAt) {
        localStorage.setItem("otp_expires_at", data.expiresAt);
      }
      toast.success("New OTP sent successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to resend OTP");
    }
  });

  return {
    verifyOtp,
    isVerifying,
    resendOtp,
    isResending
  };
};
