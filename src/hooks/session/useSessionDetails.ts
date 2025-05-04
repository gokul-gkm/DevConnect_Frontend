import { useQuery } from '@tanstack/react-query';
import SessionApi from '@/service/Api/SessionApi';

export interface DeveloperProfile {
  experience: number;
  hourlyRate: number;
  skills: string[];
  bio: string;
}

export interface Developer {
  _id: string
  username: string;
  email: string;
  profilePicture: string;
  developerProfile: DeveloperProfile;
}

export interface Session {
  title: string;
  description: string;
  status: string;
  sessionDate: string;
  startTime: string;
  duration: number;
  price: number;
  topics: string[];
  paymentStatus: string;
  developerId: Developer;
  rejectionReason?: string;
  feedback?: string;
  rating?: number;
  _id: string;
}

export const useSessionDetails = (sessionId: string | undefined) => {
  return useQuery<Session>({
    queryKey: ['session', sessionId],
    queryFn: () => {
      if (!sessionId) throw new Error('Session ID is required');
      return SessionApi.getSessionDetails(sessionId);
    },
    enabled: !!sessionId,
  });
};