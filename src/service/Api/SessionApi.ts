import axiosClient from "@/service/axiosinstance/axios";
import { BookingFormData, Session } from '@/types/session';
import { UpcomingSession } from "@/types/types";


const SessionApi = {
  async createBooking(developerId: string, data: BookingFormData) {
    const response = await axiosClient.post('/sessions/create-session', {
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

  async getUpcomingSessions(): Promise<UpcomingSession[]> {
    const response = await axiosClient.get('/sessions/upcoming-sessions');
    
    return response.data.data.map((session: any) => ({
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
    }));
  },


   async getSessionDetails(sessionId: string) {
    const response = await axiosClient.get(`/sessions/${sessionId}`);
    return response.data;
  },
   

  //Developer side

  async getDeveloperSessionRequests() {
    const response = await axiosClient.get('/sessions/developer/requests');
    return response.data.data;
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
  }
      
};

export default SessionApi;