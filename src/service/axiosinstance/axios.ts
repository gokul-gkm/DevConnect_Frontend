import axios from 'axios';
import store from '@/redux/store/store';
import { logout } from '@/redux/slices/authSlice';
import toast from 'react-hot-toast';
import { StatusCodes } from 'http-status-codes';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

axiosClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response.status === StatusCodes.FORBIDDEN) {
            toast.error("Your account has been blocked. Logging out...");
            store.dispatch(logout());
            localStorage.removeItem("access-token");
            return Promise.reject(new Error("User blocked by admin"));
          }
    
        
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
            console.error('Unauthorized, please log in.');
        }
        
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            const customError = new Error(errorMessage);
            return Promise.reject(customError);
        }
        
        return Promise.reject(error);
    }
);

export default axiosClient;