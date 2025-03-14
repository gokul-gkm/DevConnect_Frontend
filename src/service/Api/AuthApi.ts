import axiosClient from "@/service/axiosinstance/axios";
import { IRegisterData, IAuthResponse } from "@/types/types";
import { authRoutes } from "@/utils/constants";

const AuthApi = {
    register: async(data: IRegisterData): Promise<IAuthResponse> => {
        const response = await axiosClient.post(authRoutes.register, data);
        return response.data;
    },
    login: async (email: string, password: string): Promise<IAuthResponse> => {
        try {
            const response = await axiosClient.post(authRoutes.login, { email, password })
            return response.data;
        } catch (error: any) {
          console.error('API Error:', error.response?.data || error)
          throw error
        }
        
    },
    verifyOtp: async (email: string, otp: string): Promise<IAuthResponse> => {
        const response = await axiosClient.post(authRoutes.verifyOtp, { email, otp });
        return response.data;
    },
    resendOtp: async (email: string): Promise<{ message: string }> => {
        const response = await axiosClient.post(authRoutes.resendOtp, { email });
        return response.data;
    },
    logOut: async (): Promise<void> => {
        await axiosClient.post(authRoutes.logout);
    },
    forgotPassword: async (email: string): Promise<{ message: string, resetToken?: string }> => {
        const response = await axiosClient.post(authRoutes.forgotPassword, { email })
        return response.data;
    },
    resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
        const response = await axiosClient.post(authRoutes.resetPassword, { token, newPassword });
        return response.data;
    },
    googleLogin: async(token: string): Promise<IAuthResponse> => {
        const response = await axiosClient.post(authRoutes.googleLogin, { token }, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          });
        return response.data;
    },
    linkedinLogin: async (code: string): Promise<IAuthResponse> => {
        const response = await axiosClient.post('/auth/linkedin', { code });
        return response.data
    }
   
}

export default AuthApi