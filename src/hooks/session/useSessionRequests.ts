import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import SessionApi from '@/service/Api/SessionApi';

interface Session {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  userId: {
    username: string;
    email: string;
  };
  sessionDate: string;
  startTime: string;
  duration: number;
  price: number;
  topics: string[];
}

export const useSessionRequests = () => {
  const queryClient = useQueryClient();

  const {
    data: sessions,
    isLoading,
    error
  } = useQuery<Session[]>({
    queryKey: ['session-requests'],
    queryFn: SessionApi.getDeveloperSessionRequests,
  });

  const acceptMutation = useMutation({
    mutationFn: (sessionId: string) => SessionApi.acceptSession(sessionId),
    onSuccess: () => {
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
      toast.error('Acceptance failed', {
        style: {
          background: '#1a0d0f',
          border: '1px solid #dc262640',
          color: '#f87171'
        }
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ sessionId, reason }: { sessionId: string; reason: string }) =>
      SessionApi.rejectSession(sessionId, reason),
    onSuccess: () => {
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
      toast.error('Rejection failed', {
        style: {
          background: '#1a0d0f',
          border: '1px solid #dc262640',
          color: '#f87171'
        }
      });
    },
  });

  return {
    sessions,
    isLoading,
    error,
    acceptSession: acceptMutation.mutate,
    rejectSession: rejectMutation.mutate,
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};