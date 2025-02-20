import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DeveloperApi from "@/service/Api/DeveloperApi";


export const useAddProject = () => {
    const navigate = useNavigate();

    const {
        mutate: addProject,
        isPending: isSubmitting,
        error
    } = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await DeveloperApi.addProject(formData);
            return response;
        },
        onSuccess: () => {
            toast.success('Project added successfully');
            navigate('/developer/portfolio');
        },
        onError: (error: any) => {
            console.error('Error adding project : ', error);
            toast.error(error.response?.data?.message || 'Failed to add project');
        }
    });

    return {
        addProject,
        isSubmitting,
        error
    }

}