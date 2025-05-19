import axiosClient from "@/service/axiosinstance/axios";
import { BookingFormData, Session } from '@/types/session';
import { HistorySession, UpcomingSession } from "@/types/types";


const SessionApi = {
  async createBooking(developerId: string, data: BookingFormData) {
    const response = await axiosClient.post('/sessions', {
      ...data,
      developerId
    });
    return response.data;
  },

  async getBookedSlots(developerId: string, date: Date) {
    const response = await axiosClient.get('/sessions/booked-slots', {
      params: {
        developerId,
        date: date.toISOString()
      }
    });
    return response.data;
  },
   
  async getUserSessions() {
    const response = await axiosClient.get<{ data: Session[] }>('/sessions/user');
    return response.data.data;
  },
      
    
  async cancelSession(sessionId: string) {
    const response = await axiosClient.delete<{ data: Session }>(`/sessions/${sessionId}`);
    return response.data.data;
  },
    
  async initiatePayment(sessionId: string) {
    const response = await axiosClient.post<{ data: { paymentUrl: string } }>(
      `/sessions/${sessionId}/payment`
    );
    return response.data.data;
  },

  async getUpcomingSessions(page = 1, limit = 10): Promise<{ data: UpcomingSession[], pagination: any }> {
    const response = await axiosClient.get('/sessions/upcoming', {
      params: { page, limit }
    });
    
    return {
      data: response.data.data.map((session: any) => ({
        id: session._id,
        developer: {
          name: session.developerUser.username,
          avatar: session.developerUser.profilePicture || 'https://ui-avatars.com/api/?name=' + session.developerUser.username,
          role: session.developer.workingExperience.jobTitle || 'Developer',
          status: 'offline' 
        },
        date: new Date(session.sessionDate),
        time: new Date(session.startTime).toLocaleTimeString(),
        duration: session.duration,
        cost: session.price,
        status: session.status,
        topic: session.title,
        description: session.description
      })),
      pagination: response.data.pagination
    };
  },


   async getSessionDetails(sessionId: string) {
     const response = await axiosClient.get(`/sessions/${sessionId}`);
     console.log(response.data)
    return response.data;
  },
   

  //Developer side

  async getDeveloperSessionRequests(page = 1, limit = 5) {
    const response = await axiosClient.get('/sessions/developer/requests', {
      params: { page, limit }
    });
    return response.data;
  },

  async getSessionRequestDetails(sessionId: string) {
    try {
      const response = await axiosClient.get(`/sessions/developer/requests/${sessionId}`);
      
      return response;
    } catch (error) {
      console.error("Error fetching session details:", error);
      throw error;
    }
  },

  async acceptSession(sessionId: string) {
    const response = await axiosClient.patch(`/sessions/${sessionId}/accept`);
    return response.data;
  },

  async rejectSession(sessionId: string, reason: string) {
    const response = await axiosClient.patch(`/sessions/${sessionId}/reject`, {
      rejectionReason: reason
    });
    return response.data;
  },

  async getDeveloperScheduledSessions(page = 1, limit = 5) {
    const response = await axiosClient.get('/sessions/developer/scheduled', {
      params: { page, limit }
    });
    return response.data;
  },

  async getScheduledSessionDetails(sessionId: string) {
    try {
      const response = await axiosClient.get(`/sessions/developer/scheduled/${sessionId}`);
      return response;
    } catch (error) {
      console.error("Error fetching scheduled session details:", error);
      throw error;
    }
  },

  async getUnavailableSlots(developerId: string, date: Date) {
    const response = await axiosClient.get(`/sessions/unavailable-slots`, {
      params: {
        developerId,
        date: date.toISOString()
      }
    });
    return response.data;
  },
      
  
  async getSessionHistory(page = 1, limit = 10): Promise<{ data: HistorySession[], pagination: any }> {
    const response = await axiosClient.get('/sessions/history', {
      params: { page, limit }
    });
    
    return {
      data: response.data.data.map((session: any) => ({
        id: session._id,
        developer: {
          name: session.developerUser.username,
          avatar: session.developerUser.profilePicture || 'https://ui-avatars.com/api/?name=' + session.developerUser.username,
          role: session.developer.expertise?.[0] || 'Developer',
          status: 'offline' 
        },
        date: new Date(session.sessionDate),
        time: new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: session.duration,
        cost: session.price,
        status: session.status === 'rejected' ? 'cancelled' : session.status,
        rating: session.rating || 0,
        feedback: session.feedback || ""
      })),
      pagination: response.data.pagination
    };
  },

  async startSession(sessionId: string) {
    const response = await axiosClient.post(`/sessions/${sessionId}/start`);
    return response.data;
  },

  async rateSession(sessionId: string, data: { rating: number; feedback?: string }) {
    const response = await axiosClient.post(`/sessions/${sessionId}/rate`, data);
    return response.data;
  },

  async updateRating(sessionId: string, data: { rating: number; feedback?: string }) {
    const response = await axiosClient.put(`/sessions/${sessionId}/rate`, data);
    return response.data;
  },

  async getDeveloperSessionHistory(page = 1, limit = 5, search = '') {
    const response = await axiosClient.get('/sessions/developer/history', {
      params: { page, limit, search }
    });
    return response.data;
  },

  async getDeveloperSessionHistoryDetails(sessionId: string) {
    const response = await axiosClient.get(`/sessions/developer/history/${sessionId}`);
    return response.data.data;
  },
};

export default SessionApi;