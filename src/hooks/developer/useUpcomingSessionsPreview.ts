import { useQuery } from '@tanstack/react-query';
import DeveloperApi from '@/service/Api/DeveloperApi';

export const useUpcomingSessionsPreview = (limit = 2) => {
    return useQuery({
        queryKey: ['upcoming-sessions-preview', limit], 
        queryFn:  () => DeveloperApi.getUpcomingSessionsPreview(limit),
      });
};


