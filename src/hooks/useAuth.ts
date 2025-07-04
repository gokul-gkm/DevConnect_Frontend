import { useAppSelector } from '@/hooks/useAppSelector';

export const useAuth = () => {
  const user = useAppSelector((state) => state.user);
  const token = localStorage.getItem('access-token');

  return {
    user,
    token,
    isAuthenticated: user.isAuthenticated
  };
};