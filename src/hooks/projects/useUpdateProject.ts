import { useMutation, useQueryClient } from '@tanstack/react-query';
import DeveloperApi from '@/service/Api/DeveloperApi';
import { toast } from 'react-hot-toast'

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            try {
                const response = await DeveloperApi.updateProject(formData);
                return response.data;
            } catch (error: any) {
                throw new Error(error.response?.data?.message || 'Failed to update project');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['project'] });
            toast.success('Project updated successfully');
        },
        onError: (error: any) => {
            console.error('Update Error:', error);
            toast.error(error.message || 'Failed to update project');
        },
    });
};