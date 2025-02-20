import { useQuery } from '@tanstack/react-query';
import DeveloperApi from '@/service/Api/DeveloperApi';

export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => DeveloperApi.getProjectById(projectId),
    enabled: !!projectId,
  });
};