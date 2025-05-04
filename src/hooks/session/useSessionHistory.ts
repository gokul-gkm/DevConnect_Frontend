import { useQuery } from '@tanstack/react-query';
import SessionApi from '@/service/Api/SessionApi';
import { useMemo } from 'react';

export const useSessionHistory = (searchValue: string, statusFilter: string) => {
  const {
    data: sessions,
    isLoading,
    error
  } = useQuery({
    queryKey: ['session-history'],
    queryFn: SessionApi.getSessionHistory
  });
    
    console.log("session hook : ", sessions)

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
      total: sessions.length,
      completed: sessions.filter((s: any) => s.status === 'completed').length,
      cancelled: sessions.filter((s: any) => s.status === 'cancelled').length,
      totalSpent: sessions.reduce((acc: any, curr: any) => 
        curr.status === 'completed' ? acc + curr.cost : acc, 0)
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
