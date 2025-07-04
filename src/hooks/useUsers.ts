import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminApi from "@/service/Api/AdminApi";
import toast from "react-hot-toast";

interface UseUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export function useUsers(initialParams: UseUsersParams = {}) {
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
        ...initialParams
    });

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            try {
                const response = await AdminApi.getUsers(queryParams);
                return response
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Error fetching users');
                throw error;
            }
        },
        
    });

    const updateParams = (newParams: Partial<UseUsersParams>)=>{
        setQueryParams(prev => ({ ...prev, ...newParams }));
    }

    return {
        users: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        error,
        queryParams,
        updateParams,
        refetch
    }
}