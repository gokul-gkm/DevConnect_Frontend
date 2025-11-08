import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast";
import { ChangePasswordFormData } from "@/utils/validation/userValidation";
import { useNavigate } from "react-router-dom";
import DeveloperApi from "@/service/Api/DeveloperApi";

export const useDeveloperChangePassword = () => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ currentPassword, newPassword, confirmPassword }: ChangePasswordFormData) => {
            try {
                const response = DeveloperApi.changePassword({ currentPassword, newPassword, confirmPassword });
                return response
            } catch (error: any) {
                throw error;
            }
        },
        onSuccess: ( ) => {
            toast.success("Password updated successfully");
            navigate('/developer/profile')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update password');
        }
    })
}