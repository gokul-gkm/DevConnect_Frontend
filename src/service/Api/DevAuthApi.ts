import { IAuthResponse, IRegisterData } from "@/types/types"
import axiosClient from "../axiosinstance/axios"
import { devAuthRoutes } from "@/utils/constants";

export interface IDevRequestFormData {
    username: string;
    email: string;
    phoneCode: string;
    phoneNumber: string;
    bio: string;
    sessionCost: number;
    expertise: string[];
    languages: string[];
    degree: string;
    institution: string;
    year: string;
    jobTitle: string;
    company: string;
    experience: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
    profilePicture?: File;
    resume?: File;
}

const DevAuthApi = {
    async register(data: IRegisterData): Promise<IAuthResponse> {
        const response = await axiosClient.post(devAuthRoutes.register, data);
        return response.data
    },
    verifyOtp: async (email: string, otp: string): Promise<IAuthResponse> => {
        const response = await axiosClient.post(devAuthRoutes.verifyOtp, { email, otp });
        return response.data;
    },
    resendOtp: async (email: string): Promise<{ message: string, expiresAt: string }> => {
        const response = await axiosClient.post(devAuthRoutes.resendOtp, { email });
        return response.data;
    },
    login: async (email: string, password: string): Promise<IAuthResponse> => {
        const response = await axiosClient.post(devAuthRoutes.login, { email, password })
        return response.data;
    },
    googleLogin: async(token: string): Promise<IAuthResponse> => {
        const response = await axiosClient.post(devAuthRoutes.googleLogin, { token }, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          });
        return response.data;
    },
    devRequest: async (formData: FormData): Promise<any> => {
        try {
           
            const response = await axiosClient.post(devAuthRoutes.devRequest, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });
            
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    logOut: async (): Promise<void> => {
        await axiosClient.post(devAuthRoutes.logout);
    },
}

export default DevAuthApi