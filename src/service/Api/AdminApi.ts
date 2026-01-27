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

interface RevenueStats {
    totalRevenue: number;
    platformFees: number;
    developerEarnings: number;
    sessions: number;
    monthlyRevenue: Array<{
        date: string;
        revenue: number;
    }>;
    topEarningDevelopers: Array<{
        id: string;
        name: string;
        email: string;
        profilePicture: string;
        sessions: number;
        averageRating: number;
        totalEarnings: number;
        ratings: number[];
    }>;
    topicBasedRevenue: Array<{
        topic: string;
        totalRevenue: number;
        sessionCount: number;
        averageRating: number;
    }>;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        topicPagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
        };
    };
}

interface AdminSessionsResponse {
    sessions: Array<{
        _id: string;
        title: string;
        description: string;
        sessionDate: string;
        startTime: string;
        duration: number;
        price: number;
        status: string;
        paymentStatus: string;
        formattedDate: string;
        formattedTime: string;
        user: {
            _id: string;
            username: string;
            email: string;
            profilePicture: string;
        };
        developer: {
            _id: string;
            username: string;
            email: string;
            profilePicture: string;
        };
    }>;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}

const AdminApi = {
    adminLogin: async (email: string, password: string): Promise<IAdminAuthResponse> => {
        const response = await axiosClient.post(adminRoutes.login, { email, password });
        return response.data;
    },

    adminLogOut: async (): Promise<void> => {
        await axiosClient.post(adminRoutes.logout);
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
        const response = await axiosClient.put(`${adminRoutes.updateUserStatus}${userId}`);
        return response.data;
    },

    getUserDetails: async (userId: string): Promise<{ user: User }> => {
        const response = await axiosClient.get(`${adminRoutes.getUserDetails}${userId}`);
        return response.data;
    },

    getDevelopers: async (params: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        status?: string;
    }) => {
        const response = await axiosClient.get(adminRoutes.getDevelopers, { params });
        return response.data;
    },

    getDeveloperRequests: async (params: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => {
        const response = await axiosClient.get(adminRoutes.getDeveloperRequests, { params });
        return response.data;
    },

    approveDeveloperRequest: async (developerId: string) => {
        const response = await axiosClient.patch(`${adminRoutes.approveDeveloper}/${developerId}/approve`);
        return response.data;
    },

    rejectDeveloperRequest: async (developerId: string, reason: string) => {
        const response = await axiosClient.patch(`${adminRoutes.rejectDeveloper}/${developerId}/reject`, { reason });
        return response.data;
    },

    async getDeveloperDetails(developerId: string) {
        const response = await axiosClient.get(`${adminRoutes.getDeveloperDetails}/${developerId}`);
        return response.data;
    },

    async getDeveloperRequestDetails(developerId: string) {
        const response = await axiosClient.get(`${adminRoutes.getDeveloperRequestDetails}/${developerId}`);
        return response.data;
    },

    async getDashboardStats(): Promise<DashboardStats> {
        const response = await axiosClient.get<DashboardStats>(adminRoutes.getDashboardStats);
        return response.data;
    },

    async getRevenueStats(params: { page?: number; limit?: number } = {}): Promise<RevenueStats> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        
        const response = await axiosClient.get<RevenueStats>(
            `${adminRoutes.getRevenueStats}?${queryParams.toString()}`
        );
        return response.data;
    },

    async getSessions(params: { 
        page?: number; 
        limit?: number; 
        status?: string[];
        search?: string;
    }): Promise<AdminSessionsResponse> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.status && params.status.length > 0) {
            queryParams.append('status', params.status.join(','));
        }
        if (params.search) queryParams.append('search', params.search);
        
        const response = await axiosClient.get<AdminSessionsResponse>(
            `${adminRoutes.getSessions}?${queryParams.toString()}`
        );
        return response.data;
    },

    async getDeveloperLeaderboard(page = 1, limit = 10, sortBy = 'combined') {
        const response = await axiosClient.get(adminRoutes.getDeveloperLeaderboard, {
            params: { page, limit, sortBy }
        });
        return response.data.data;
    },


    async downloadSessionsReport(params: {
        from?: string; 
        to?: string;  
        search?: string;
        status?: string[];
        format?: 'csv';
    }) {
        const query = new URLSearchParams();
        if (params.from) query.append('from', params.from);
        if (params.to) query.append('to', params.to);
        if (params.search) query.append('search', params.search);
        if (params.status?.length) query.append('status', params.status.join(','));
        query.append('format', params.format ?? 'csv');
    
        return axiosClient.get(`${adminRoutes.downloadSessionsReport}?${query.toString()}`, {
        responseType: 'blob',
        });
    },
  
};

export default AdminApi;