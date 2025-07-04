import { useQuery } from '@tanstack/react-query';
import SessionApi from '@/service/Api/SessionApi';
import { useMemo } from 'react';

export const useUpcomingSessions = (searchValue: string, statusFilter: string) => {
  const {
    data: sessions,
    isLoading,
    error
  } = useQuery({
    queryKey: ['upcoming-sessions'],
    queryFn: SessionApi.getUpcomingSessions
  });

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
      total: sessions.length,
      upcoming: sessions.filter(s => s.status === 'scheduled').length,
      pending: sessions.filter(s => s.status === 'pending').length,
      totalCost: sessions.reduce((acc, curr) => acc + curr.cost, 0)
    };
  }, [sessions]);

  return {
    sessions,
    isLoading,
    error,
    filteredSessions,
    stats
  };
};