import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthApi from '@/service/Api/AuthApi';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { setCredentials } from '@/redux/slices/authSlice';
import { socketService } from '@/service/socket/socketService';

export interface ILoginData {
    email: string,
    password: string
}

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    mutate: login,
    isPending: isLogging,
    error
  } = useMutation({
    mutationFn: async (data: ILoginData) => {
      try {
        const response = await AuthApi.login(data.email.toLowerCase().trim(), data.password);
        return response;
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: (response) => {
      if (response.success && response.user) {
        localStorage.setItem("access-token", response.token!);
        dispatch(
          setCredentials({
            username: response.user.username,
            email: response.user.email,
            role: response.user.role,
            _id: response.user.id
          })
        );
        socketService.connect(response.token!);
        toast.success("Login successful!");
        navigate("/");
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || error.message ||"Login failed. Please check your credentials."
      );
    }
  });

  return {
    login,
    isLogging,
    error
  };
};