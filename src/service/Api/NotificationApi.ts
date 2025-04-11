import axiosClient from "@/service/axiosinstance/axios";

const NotificationApi = {
    getNotifications: async () => {
        try {
            const response = await axiosClient.get(`/notifications`)
            return response.data;
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error)
            throw error
        }
        
    },
    getUnreadCount: async () => {
        try {
            const response = await axiosClient.get(`/notifications/unread-count`)
            return response.data;
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error)
            throw error
        }
        
    },

    markAsRead: async (notificationId: string) => {
        try {
    
            const response = await axiosClient.patch(`/notifications/${notificationId}/read`)
    
            return response.data
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error)
            throw error
        }
    },
    markAllAsRead: async () => {
        try {
    
            const response = await axiosClient.patch(`/notifications/read-all`)
    
            return response.data
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error)
            throw error
        }
    },
    
    deleteNotification: async (notificationId: string) => {
        try {
            const response = await axiosClient.delete(`/notifications/${notificationId}`);
            return response.data;
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error)
            throw error
        }
    },
};

export default  NotificationApi


