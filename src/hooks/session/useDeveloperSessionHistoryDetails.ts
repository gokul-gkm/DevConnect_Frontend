import { useQuery } from '@tanstack/react-query';
import SessionApi from '@/service/Api/SessionApi';

export const useDeveloperSessionHistoryDetails = (sessionId: string) => {
  return useQuery({
    queryKey: ['developerSessionHistoryDetails', sessionId],
    queryFn: () => SessionApi.getDeveloperSessionHistoryDetails(sessionId),
    enabled: !!sessionId,
  });
};
