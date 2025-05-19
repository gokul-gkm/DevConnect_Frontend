import { useQuery } from '@tanstack/react-query';
import SessionApi from '@/service/Api/SessionApi';
import { useMemo } from 'react';

export const useSessionHistory = (searchValue: string, statusFilter: string, page: number = 1) => {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['session-history', page],
    queryFn: () => SessionApi.getSessionHistory(page)
  });
    
  const sessions = data?.data || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

  const filteredSessions = useMemo(() => {
    if (!sessions) return [];
    
    return sessions.filter((session: any) => {
      const matchesStatus = statusFilter === 'all' 
        ? true 
        : session.status === statusFilter;
      
      if (!searchValue) return matchesStatus;

      const searchLower = searchValue.toLowerCase();
      return matchesStatus && (
        session.developer.name.toLowerCase().includes(searchLower) ||
        session.id.toLowerCase().includes(searchLower) ||
        session.status.toLowerCase().includes(searchLower)
      );
    });
  }, [sessions, searchValue, statusFilter]);

  const stats = useMemo(() => {
    if (!sessions) return {
      total: 0,
      completed: 0,
      cancelled: 0,
      totalSpent: 0
    };

    return {
      total: pagination.totalItems,
      completed: sessions.filter((s: any) => s.status === 'completed').length,
      cancelled: sessions.filter((s: any) => s.status === 'cancelled').length,
      totalSpent: sessions.reduce((acc: any, curr: any) => 
        curr.status === 'completed' ? acc + curr.cost : acc, 0)
    };
  }, [sessions, pagination]);

  return {
    sessions,
    isLoading,
    error,
    filteredSessions,
    stats,
    pagination
  };
};
