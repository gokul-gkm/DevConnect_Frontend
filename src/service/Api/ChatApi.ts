import axiosClient from "@/service/axiosinstance/axios";
import { chatRoutes } from "@/utils/constants";

interface CacheItem {
  data: any;
  timestamp: number;
}

export class ChatApi {
  private static cache: Map<string, CacheItem> = new Map();
  private static CACHE_DURATION = 5000; 

  static async createChat(developerId: string) {
    const response = await axiosClient.post(chatRoutes.create, { developerId });
    return response.data;
  }


  static async getUserChats() {
    const cacheKey = 'userChats';
    const now = Date.now();
    const cachedData = this.cache.get(cacheKey);

    if (cachedData && (now - cachedData.timestamp < this.CACHE_DURATION)) {
        return cachedData.data;
    }

    try {
        const response = await axiosClient.get(chatRoutes.userChats);
        
        this.cache.set(cacheKey, {
            data: response.data,
            timestamp: now
        });

        return response.data;
    } catch (error) {
        console.error("ChatApi getUserChats error:", error);
        throw error;
    }
  }
  
  static clearUserChatsCache() {
    this.cache.delete('userChats');
  }

 static async getDeveloperChats() {
    const cacheKey = 'developerChats';
    const now = Date.now();
    const cachedData = this.cache.get(cacheKey);

    if (cachedData && (now - cachedData.timestamp < this.CACHE_DURATION)) {
        return cachedData.data;
    }

    try {
        const response = await axiosClient.get(chatRoutes.developerChats);
        
        this.cache.set(cacheKey, {
            data: response.data,
            timestamp: now
        });

        return response.data;
    } catch (error) {
        console.error("ChatApi getDeveloperChats error:", error);
        throw error;
    }
}

  static clearDeveloperChatsCache() {
    this.cache.delete('developerChats');
  }

  static async getChatMessages(chatId: string, page: number) {
    try {
        const response = await axiosClient.get(`${chatRoutes.messages}/${chatId}/messages?page=${page}`);
        return response.data;
    } catch (error) {
        console.error("ChatApi getChatMessages error:", error);
        throw error;
    }
}

  static async sendMessage(formData: FormData) {
    try {
        const response = await axiosClient.post(chatRoutes.sendMessage, formData);
        return response.data;
    } catch (error) {
        console.error("Error sending message with media:", error);
        throw error;
    }
  }

  static getMediaType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'pdf';
    return 'document';
  }

  static async markMessagesAsRead(chatId: string) {
    const response = await axiosClient.patch(`${chatRoutes.markRead}/${chatId}/read`);
    return response.data;
  }
}