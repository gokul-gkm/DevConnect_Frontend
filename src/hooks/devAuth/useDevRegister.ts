import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DevAuthApi from '@/service/Api/DevAuthApi';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { setCredentials } from '@/redux/slices/authSlice';
import { IRegisterData } from '@/types/types';

export const useDevRegister = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    mutate: register,
    isPending: isLoading,
    error
  } = useMutation({
    mutationFn: async (data: IRegisterData) => {
      const response = await DevAuthApi.register({
        username: data.username.trim(),
        email: data.email.toLowerCase().trim(),
        contact: data.contact.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      return response;
    },
    onSuccess: (response, variables) => {
      toast.success("Registration successful! Please verify your email.");
      if (response?.expiresAt) {
        localStorage.setItem("dev_otp_expires_at", response.expiresAt);
      }
      navigate(`/developer/auth/verify-otp`, { state: { email: variables.email } });
    },
    onError: (error: any, variables) => {
      if (error.response?.data?.message === "Please verify your existing registration. A new OTP has been sent to your email.") {
        toast.error(error.response.data.message);
        navigate(`/developer/auth/verify-otp`, { state: { email: variables.email } });
      } else {
        toast.error(
          error.response?.data?.message || "Registration failed. Please try again."
        );
      }
    }
  });

  const {
    mutate: googleLogin,
    isPending: isGoogleLoading
  } = useMutation({
    mutationFn: async (credential: string) => {
      const response = await DevAuthApi.googleLogin(credential);
      return response;
    },
    onSuccess: (data) => {
      if (data.success && data.user) {
        dispatch(
          setCredentials({
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
            _id: data.user._id
          })
        );
        toast.success("Login successful!");
        navigate("/");
      }
    },
    onError: (error: any) => {
      console.error("Google login failed:", error);
    }
  });

  return {
    register,
    isLoading,
    googleLogin,
    isGoogleLoading,
    error
  };
};