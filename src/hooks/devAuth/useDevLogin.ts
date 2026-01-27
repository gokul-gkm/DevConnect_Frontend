import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DevAuthApi from '@/service/Api/DevAuthApi';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { setCredentials } from '@/redux/slices/authSlice';


export const useDevLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    mutate: login,
    isPending: isLoading,
    error
  } = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await DevAuthApi.login(email, password);
      return response;
    },
    onSuccess: async (data) => {
      if (data.success && data.user) {
        dispatch(
          setCredentials({
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
            _id: data.user._id,
            token: data.token!
          })
        );
        
        console.log(data.user)
        localStorage.setItem('user-id', data.user._id);
        localStorage.setItem("access-token", data.token!);
        localStorage.setItem("user-role", 'developer');
        
        toast.success("Login successful!");
        navigate("/developer");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message ||
          "Login failed. Please check your credentials."
      );
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
    onSuccess:async (data) => {
      if (data.success && data.user) {
        dispatch(
          setCredentials({
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
            _id: data.user._id,
            token: data.token!
          })
        );   
        toast.success("Login successful!");
        navigate("/developer");
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Google login failed. Please try again."
      );
    }
  });

  return {
    login,
    isLoading,
    googleLogin,
    isGoogleLoading,
    error
  };
};