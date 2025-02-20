import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthApi from '@/service/Api/AuthApi';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { setCredentials } from '@/redux/slices/authSlice';

export default function LinkedInCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleLinkedInCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const error_description = searchParams.get('error_description');

      if (error || error_description) {
        console.error('LinkedIn OAuth error:', error, error_description);
        toast.error('LinkedIn login failed: ' + (error_description || error));
        navigate('/auth/login');
        return;
      }

      if (!code) {
        toast.error('No authorization code received');
        navigate('/auth/login');
        return;
      }

      try {
        
        const response = await AuthApi.linkedinLogin(code);
        
        if (response.success && response.user) {
          dispatch(
            setCredentials({
              username: response.user.username,
              email: response.user.email,
              role: response.user.role,
            })
          );
          toast.success('Login successful!');
          navigate('/');
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error: any) {
        console.error('LinkedIn login failed:', error);
        toast.error(error.response?.data?.message || 'LinkedIn login failed');
        navigate('/auth/login');
      }
    };

    handleLinkedInCallback();
  }, [location, navigate, dispatch]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
}