import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminApi from "@/service/Api/AdminApi";
import toast from "react-hot-toast";

interface UseDeveloperRequestsParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export function useDeveloperRequests(initialParams: UseDeveloperRequestsParams = {}) {
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
        ...initialParams
    });

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['developer-requests', queryParams],
        queryFn: async () => {
            try {
                const response = await AdminApi.getDeveloperRequests(queryParams);
                return response;
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Error fetching developer requests');
                throw error;
            }
        }
    });

    const updateParams = (newParams: Partial<UseDeveloperRequestsParams>) => {
        setQueryParams(prev => ({ ...prev, ...newParams }));
    };

    return {
        requests: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        error,
        queryParams,
        updateParams,
        refetch
    };
}