import axios from 'axios';
import store from '@/redux/store/store';
import { logout } from '@/redux/slices/authSlice';
import toast from 'react-hot-toast';
import { StatusCodes } from 'http-status-codes';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});


axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access-token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        } else if (config.data && typeof config.data === 'object') {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    async(error) => {
        if (error.response?.status === StatusCodes.FORBIDDEN) {
            toast.error("Your account has been blocked. Logging out...");
            store.dispatch(logout());
            localStorage.removeItem("access-token");
            return Promise.reject(new Error("User blocked by admin"));
        }
        
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
            console.error('Unauthorized, please log in.');
        }

        const originalRequest = error.config;

        if (error.response?.status === StatusCodes.UNAUTHORIZED && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await getNewAccessToken();
                if (newAccessToken) {
                    localStorage.setItem("access-token", newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosClient(originalRequest);
                } else {
                    throw new Error("Failed to refresh token");
                }
            } catch (err) {
                toast.error("Session expired, please log in again.");
                store.dispatch(logout());
                localStorage.removeItem("access-token");
                return Promise.reject(err);
            }
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

async function getNewAccessToken() {
    try {
      const response = await axios.get(`${API_URL}/auth/refresh-token`, {
        withCredentials: true,
      });
        
    console.log("resp: ",response)
  
      return response.data.token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  }