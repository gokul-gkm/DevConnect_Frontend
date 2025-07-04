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
    onSuccess: async (response) => {
      if (response.success && response.user) {
        const role = response.user.role || 'user';
        localStorage.setItem("access-token", response.token!);
        localStorage.setItem("user-role", role);
        localStorage.setItem('user-id', response.user._id);
        
        dispatch(
          setCredentials({
            username: response.user.username,
            email: response.user.email,
            role: role,
            _id: response.user._id
          })
        );
        
        try {
          await socketService.connect(response.token!, 'user');
          
          if (role === 'developer') {
            socketService.emit('developer:set-online', { developerId: response.user._id });
          } else {
            socketService.emit('user:set-online', { userId: response.user._id });
          }
        } catch (error) {
          console.error("Error connecting socket:", error);
        }
        
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