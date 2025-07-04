import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminApi from "@/service/Api/AdminApi";
import toast from "react-hot-toast";

interface UseDevelopersParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: 'pending' | 'approved' | 'rejected';
}

export function useDevelopers(initialParams: UseDevelopersParams = {}) {
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
        status: "approved",
        ...initialParams
    });

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['developers', queryParams],
        queryFn: async () => {
            try {
                const response = await AdminApi.getDevelopers(queryParams);
                return response;
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Error fetching developers');
                throw error;
            }
        }
    });

    const updateParams = (newParams: Partial<UseDevelopersParams>) => {
        setQueryParams(prev => ({ ...prev, ...newParams }));
    };

    return {
        developers: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        error,
        queryParams,
        updateParams,
        refetch
    };
}