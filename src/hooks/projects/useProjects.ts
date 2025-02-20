import { useQuery } from '@tanstack/react-query';
import DeveloperApi from '@/service/Api/DeveloperApi';

export const useProjects = (page: number = 1) => {
  return useQuery({
    queryKey: ['projects', page],
    queryFn: () => DeveloperApi.getProjects(page),
    refetchOnMount: 'always', 
  });
};