import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface UseCustomQueryOptions<T> extends Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'> {
  showToast?: boolean;
}

export function useCustomQuery<T>(
  queryKey: string | string[],
  queryFn: () => Promise<ApiResponse<T>>,
  options?: UseCustomQueryOptions<T>
) {
  const { showToast = true, ...queryOptions } = options || {};

  return useQuery<T, AxiosError>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      try {
        const response = await queryFn();
        if (!response.success) {
          throw new Error(response.message || 'An error occurred');
        }
        return response.data;
      } catch (error: any) {
        if (showToast) {
          toast.error(error.response?.data?.message || error.message || 'An error occurred');
        }
        throw error;
      }
    },
    ...queryOptions,
  });
}