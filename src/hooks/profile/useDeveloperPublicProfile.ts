import { useQuery } from '@tanstack/react-query';
import UserApi from '@/service/Api/UserApi';

export const useDeveloperPublicProfile = (developerId: string | undefined) => {
  const {
    data: profile,
    isLoading,
    error
  } = useQuery({
    queryKey: ['developerPublicProfile', developerId],
    queryFn: () => UserApi.getPublicProfile(developerId as string),
    enabled: !!developerId,
  });

  return {
    profile,
    isLoading,
    error
  };
};