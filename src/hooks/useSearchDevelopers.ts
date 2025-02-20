import { useQuery } from '@tanstack/react-query';
import UserApi from '@/service/Api/UserApi';

interface SearchParams {
    search?: string;
    skills?: string[];
    experience?: string;
    availability?: string;
    location?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

export const useSearchDevelopers = (params: SearchParams) => {
    return useQuery({
        queryKey: ['developers', params],
        queryFn: () => UserApi.searchDevelopers(params),
        refetchOnMount: 'always' 
    });
};