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
      localStorage.removeItem("dev_otp_expires_at");
      navigate("/developer/auth/dev-request");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to verify OTP");
    }
  });

  const {
    mutateAsync: resendOtp,
    isPending: isResending,
    error: resendError
  } = useMutation({
    mutationFn: async (email: string) => {
      const response = await DevAuthApi.resendOtp(email);
      return response;
    },
    onSuccess: (data) => {
      if (data?.expiresAt) {
        localStorage.setItem("dev_otp_expires_at", data.expiresAt);
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
    verifyError,
    resendOtp,
    isResending,
    resendError
  };
};