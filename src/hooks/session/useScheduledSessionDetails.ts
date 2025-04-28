import { useQuery } from '@tanstack/react-query';
import SessionApi from '@/service/Api/SessionApi';

export const useScheduledSessionDetails = (sessionId: string) => {
  const {
    data: session,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['scheduled-session-details', sessionId],
    queryFn: async () => {
      if (!sessionId) {
        throw new Error('Session ID is required');
      }
      
      const response = await SessionApi.getScheduledSessionDetails(sessionId);
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        console.log("No valid data found in response");
        throw new Error('No session data returned');
      }
    },
    enabled: !!sessionId,
    retry: 1
  });

  return {
    session,
    isLoading,
    error,
    refetch
  };
};
