import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import SessionApi from '@/service/Api/SessionApi';

interface UserInfo {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

interface SessionDetails {
  _id: string;
  title: string;
  description: string;
  sessionDate: string;
  startTime: string;
  duration: number;
  price: number;
  status: 'pending' | 'approved' | 'rejected' | 'scheduled';
  topics: string[];
  userId: UserInfo;
  rejectionReason?: string;
}

export const useSessionRequestDetails = (sessionId: string) => {
  const queryClient = useQueryClient();
  
  const {
    data: session,
    isLoading,
    error,
    refetch
  } = useQuery<SessionDetails>({
    queryKey: ['session-request-details', sessionId],
    queryFn: async () => {
      if (!sessionId) {
        throw new Error('Session ID is required');
      }
      
      const response = await SessionApi.getSessionRequestDetails(sessionId);
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        console.log("No valid data found in response");
        throw new Error('No session data returned');
      }
    },
    enabled: !!sessionId,
    retry: 1
  });

  const acceptMutation = useMutation({
    mutationFn: () => SessionApi.acceptSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-request-details', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['session-requests'] });
      toast.success('Session accepted', {
        style: {
          background: '#041411',
          border: '1px solid #05966940',
          color: '#34d399'
        }
      });
    },
    onError: () => {
      toast.error('Failed to accept session', {
        style: {
          background: '#1a0d0f',
          border: '1px solid #dc262640',
          color: '#f87171'
        }
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => SessionApi.rejectSession(sessionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-request-details', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['session-requests'] });
      toast.success('Session rejected', {
        style: {
          background: '#041411',
          border: '1px solid #05966940',
          color: '#34d399'
        }
      });
    },
    onError: () => {
      toast.error('Failed to reject session', {
        style: {
          background: '#1a0d0f',
          border: '1px solid #dc262640',
          color: '#f87171'
        }
      });
    },
  });

  return {
    session,
    isLoading,
    error,
    refetch,
    acceptSession: acceptMutation.mutate,
    rejectSession: rejectMutation.mutate,
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};
