import { IAdminAuthResponse, User } from "@/types/types";
import axiosClient from "../axiosinstance/axios";
import { adminRoutes } from "@/utils/constants";
interface QueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}



interface PaginatedResponse {
    success: boolean;
    data: User[];
    pagination: {
        total: number;
        currentPage: number;
        totalPages: number;
        limit: number;
    };
}

interface DashboardStats {
  totalUsers: number;
  totalDevelopers: number;
  totalRevenue: number;
  totalSessions: number;
  revenueData: Array<{
    date: string;
    revenue: number;
  }>;
  userGrowthData: Array<{
    date: string;
    users: number;
    developers: number;
  }>;
  topDevelopers: Array<{
    id: string;
    name: string;
    avatar: string;
    revenue: number;
    sessions: number;
    rating: number;
  }>;
}

const AdminApi = {
    adminLogin: async (email: string, password: string): Promise<IAdminAuthResponse> => {
        const response = await axiosClient.post(adminRoutes.login, { email, password });
        return response.data;
    },
    adminLogOut: async (): Promise<void> => {
        await axiosClient.post(adminRoutes.logout)
    },
    getUsers: async (params: QueryParams): Promise<PaginatedResponse> => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        const response = await axiosClient.get(`${adminRoutes.getUsers}?${queryParams.toString()}`);
        return response.data;
    },

    updateUserStatus: async (userId: string) => {
        const response = await axiosClient.put( `${adminRoutes.updateUserStatus + userId}`);
        return response.data;
    },
    getUserDetails: async (userId: string): Promise<{ user: User }> => {
        const response = await axiosClient.get(`${adminRoutes.getUserDetails + userId}`);
        return response.data
    },
    getDevelopers: async (params: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        status?: string;
    }) => {
        const response = await axiosClient.get('/admin/developers', { params });
        return response.data
    },
    getDeveloperRequests: async (params: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => {
        const response = await axiosClient.get('/admin/developer-requests', { params });
        return response.data;
    },
    approveDeveloperRequest: async (developerId: string) => {
        const response = await axiosClient.patch(`/admin/developers/${developerId}/approve`);
        return response.data;
    },
    rejectDeveloperRequest: async (developerId: string, reason: string) => {
        const response = await axiosClient.patch(`/admin/developers/${developerId}/reject`, { reason });
        return response.data;
    },

    async getDeveloperDetails(developerId: string) {
        const response = await axiosClient.get(`/admin/developers/${developerId}`);
        return response.data;
    },

    async getDeveloperRequestDetails(developerId: string) {
        const response = await axiosClient.get(`/admin/developer-requests/${developerId}`);
        return response.data;
    },

    async getDashboardStats(): Promise<DashboardStats> {
        const response = await axiosClient.get<DashboardStats>('/admin/dashboard/stats');
        return response.data;
    }
}

export default AdminApi