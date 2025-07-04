import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import SessionApi from '@/service/Api/SessionApi';
import { useState, useEffect } from 'react';

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  scheduled: number;
}

export const useSessionRequests = () => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5
  });
  
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    scheduled: 0
  });

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['session-requests', pagination.currentPage, pagination.itemsPerPage],
    queryFn: () => SessionApi.getDeveloperSessionRequests(pagination.currentPage, pagination.itemsPerPage)
  });

  useEffect(() => {
    if (data) {
      if (data.pagination) {
        setPagination(data.pagination);
      }
      if (data.stats) {
        setStats(data.stats);
      }
    }
  }, [data]);

  const sessions = data?.data || [];

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

  const updatePage = (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  return {
    sessions,
    pagination,
    stats,
    isLoading,
    error,
    acceptSession: acceptMutation.mutate,
    rejectSession: rejectMutation.mutate,
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
    updatePage,
  };
};