import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthApi from '@/service/Api/AuthApi';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { setCredentials } from '@/redux/slices/authSlice';

export const useLinkedInLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { mutate: linkedinLogin } = useMutation({
    mutationFn: async (code: string) => {
      return await AuthApi.linkedinLogin(code);
    },
    onSuccess: (response) => {
      if (response.success && response.user) {
        dispatch(
          setCredentials({
            username: response.user.username,
            email: response.user.email,
            role: response.user.role,
          })
        );
        toast.success("Login successful!");
        navigate("/");
      }
    },
    onError: (error: any) => {
      console.error("LinkedIn login failed:", error);
      toast.error(
        error.response?.data?.message || "LinkedIn login failed. Please try again."
      );
    }
  });

  const handleLinkedInSuccess = (code: string) => {
    linkedinLogin(code);
  };

  const handleLinkedInError = (error: any) => {
    console.error("LinkedIn login error:", error);
    toast.error("LinkedIn login failed. Please try again.");
  };

  return {
    handleLinkedInSuccess,
    handleLinkedInError
  };
};