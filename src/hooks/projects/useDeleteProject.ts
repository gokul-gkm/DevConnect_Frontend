import { useMutation, useQueryClient } from '@tanstack/react-query';
import DeveloperApi from '@/service/Api/DeveloperApi';
import { toast } from 'react-hot-toast';

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (projectId: string) => DeveloperApi.deleteProject(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete project');
        },
    });
};