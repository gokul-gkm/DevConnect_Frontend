import { useQuery } from '@tanstack/react-query';
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
  scheduled: number;
}

export const useScheduledSessions = () => {
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5
  });
  
  const [stats, setStats] = useState<Stats>({
    total: 0,
    scheduled: 0
  });

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['scheduled-sessions', pagination.currentPage, pagination.itemsPerPage],
    queryFn: () => SessionApi.getDeveloperScheduledSessions(pagination.currentPage, pagination.itemsPerPage)
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
    updatePage,
  };
};
