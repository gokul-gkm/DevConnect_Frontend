import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

axiosClient.interceptors.request.use(
    (config) => {
        return config
    },
    (error)=> Promise.reject(error)
)

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthrozed , please log in.');
        }
        return Promise.reject(error)
    }
)

export default axiosClient;