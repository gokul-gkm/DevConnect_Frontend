import { useQuery } from '@tanstack/react-query';
import SessionApi from '@/service/Api/SessionApi';

export const useDeveloperSessionHistory = (page: number, search: string) => {
  return useQuery({
    queryKey: ['developerSessionHistory', page, search],
    queryFn: () => SessionApi.getDeveloperSessionHistory(page, 5, search),
  });
};
