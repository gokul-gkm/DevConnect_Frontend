import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthApi from '@/service/Api/AuthApi';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { setCredentials } from '@/redux/slices/authSlice';
import { socketService } from '@/service/socket/socketService';



export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { mutate: googleLogin } = useMutation({
    mutationFn: async (credential: string) => {
      return await AuthApi.googleLogin(credential);
    },
    onSuccess: (response) => {
      if (response.success && response.user) {
        dispatch(setCredentials({
          username: response.user.username,
          email: response.user.email,
          role: response.user.role,
          _id: response.user.id
        }));
        socketService.connect(response.token!);
        toast.success("Login successful!");
        navigate("/");
      }
    },
    onError: (error: any) => {
      console.error("Google login failed:", error);
      toast.error("Google login failed. Please try again.");
    }
  });

  const handleGoogleSuccess = (credentialResponse: any) => {
    googleLogin(credentialResponse.credential);
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return {
    handleGoogleSuccess,
    handleGoogleError
  };
};