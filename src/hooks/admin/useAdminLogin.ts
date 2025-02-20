import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../useAppSelector";
import { useMutation } from "@tanstack/react-query";
import AdminApi from "@/service/Api/AdminApi";
import { setAdminCredentials } from "@/redux/slices/adminSlice";
import toast from "react-hot-toast";


export const useAdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        mutate: login,
        isPending: isLoading,
        error
    } = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const response = await AdminApi.adminLogin(email, password);
            return response
        },
        onSuccess: (data) => {
            if (data.success && data.admin) {
                dispatch(
                    setAdminCredentials({
                        email: data.admin.email,
                    })
                );
                toast.success("Admin Login successful!");
                navigate('/admin/dashboard')
            }
        },
        onError: (error: any) => {
            console.error("Login failed : ", error);
            toast.error(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        }

    });

    return {
        login,
        isLoading,
        error
    }
}