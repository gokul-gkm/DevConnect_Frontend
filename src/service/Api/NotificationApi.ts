import axiosClient from "@/service/axiosinstance/axios";
import { notificationRoutes } from "@/utils/constants";

const NotificationApi = {
    getNotifications: async () => {
        try {
            const response = await axiosClient.get(notificationRoutes.getAll);
            return response.data;
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error);
            throw error;
        }
    },

    getUnreadCount: async () => {
        try {
            const response = await axiosClient.get(notificationRoutes.unreadCount);
            return response.data;
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error);
            throw error;
        }
    },

    markAsRead: async (notificationId: string) => {
        try {
            const response = await axiosClient.patch(`${notificationRoutes.markRead}/${notificationId}/read`);
            return response.data;
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error);
            throw error;
        }
    },

    markAllAsRead: async () => {
        try {
            const response = await axiosClient.patch(notificationRoutes.markAllRead);
            return response.data;
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error);
            throw error;
        }
    },
    
    deleteNotification: async (notificationId: string) => {
        try {
            const response = await axiosClient.delete(`${notificationRoutes.delete}/${notificationId}`);
            return response.data;
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error);
            throw error;
        }
    }
};

export default NotificationApi;


