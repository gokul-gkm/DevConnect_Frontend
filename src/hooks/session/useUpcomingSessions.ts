import { useQuery } from '@tanstack/react-query';
import SessionApi from '@/service/Api/SessionApi';
import { useMemo } from 'react';

export const useUpcomingSessions = (searchValue: string, statusFilter: string, page: number = 1) => {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['upcoming-sessions', page],
    queryFn: () => SessionApi.getUpcomingSessions(page)
  });

  const sessions = data?.data || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

  const filteredSessions = useMemo(() => {
    if (!sessions) return [];
    
    return sessions.filter(session => {
      const matchesStatus = statusFilter === 'all' ? true : session.status === statusFilter;
      
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
      upcoming: 0,
      pending: 0,
      totalCost: 0
    };

    return {
      total: pagination.totalItems,
      upcoming: sessions.filter(s => s.status === 'scheduled').length,
      pending: sessions.filter(s => s.status === 'pending').length,
      totalCost: sessions.reduce((acc, curr) => acc + curr.cost, 0)
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