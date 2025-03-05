import UserApi from "@/service/Api/UserApi"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast";
import { ChangePasswordFormData } from "@/utils/validation/userValidation";

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async ({ currentPassword, newPassword, confirmPassword }: ChangePasswordFormData) => {
            try {
                const response = UserApi.changePassword({ currentPassword, newPassword, confirmPassword });
                return response
            } catch (error: any) {
                throw error;
            }
        },
        onSuccess: ( ) => {
            toast.success("Password updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update password');
        }
    })
}