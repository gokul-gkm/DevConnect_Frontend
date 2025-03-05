import axiosClient from "@/service/axiosinstance/axios";

interface CacheItem {
  data: any;
  timestamp: number;
}

export class ChatApi {
  private static cache: Map<string, CacheItem> = new Map();
    private static CACHE_DURATION = 30000; 

  static async createChat(developerId: string) {
    const response = await axiosClient.post('/chats/create', { developerId });
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
        const response = await axiosClient.get('/chats/user');
        
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
  
  static clearCache() {
    this.cache.clear();
  }

  static async getDeveloperChats() {
    const response = await axiosClient.get('/chats/developer');
    return response.data;
  }

  static async getChatMessages(chatId: string, page: number) {
    try {
        const response = await axiosClient.get(`/chats/${chatId}/messages?page=${page}`);
        return response.data;
    } catch (error) {
        console.error("ChatApi getChatMessages error:", error);
        throw error;
    }
}

  static async sendMessage(chatId: string, content: string) {
    const response = await axiosClient.post('/chats/message', {
      chatId,
      content
    });
    return response.data;
  }

  static async markMessagesAsRead(chatId: string) {
    const response = await axiosClient.patch(`/chats/${chatId}/read`);
    return response.data;
  }
}