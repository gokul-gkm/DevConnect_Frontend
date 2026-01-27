import { useAppSelector } from '@/hooks/useAppSelector';

export const useAuth = () => {
  const user = useAppSelector((state) => state.user);
  return {
    user,
    token: user.token,
    isAuthenticated: user.isAuthenticated
  };
};