import axiosClient from "@/service/axiosinstance/axios";
import { DeveloperProfile, Project } from "@/types/types";
import { developerRoutes } from "@/utils/constants";
import { format } from 'date-fns';

const DeveloperApi = {
    getProfile: async () => {
        const response = await axiosClient.get(developerRoutes.getProfile);
        return response.data.data;
    },
    updateProfile: async (formData: FormData): Promise<DeveloperProfile> => {
        const response = await axiosClient.put(developerRoutes.updateProfile, formData);
        return response.data;
    },
    
    getProjects: async (page: number = 1) => {
        const response = await axiosClient.get(`${developerRoutes.getProjects}?page=${page}&limit=5`);
        return response.data.data
    },
    
    addProject: async (formData: FormData): Promise<Project> => {
        const response = await axiosClient.post(developerRoutes.addProject, formData);
        return response.data.data;
    },

    getProjectById: async (projectId: string) => {
        const response = await axiosClient.get(`${developerRoutes.getProjects}/${projectId}`);
        return response.data.data;
    },
    
    updateProject: async (formData: FormData) => {
        const projectId = formData.get('projectId');
        const response = await axiosClient.put(
            `${developerRoutes.editProject}/${projectId}`,
            formData
        );
        return response.data;
    },
    
    deleteProject: async (projectId: string) => {
        try {
            const response = await axiosClient.delete(`${developerRoutes.deleteProject}/${projectId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    async updateAvailability(date: Date, unavailableSlots: string[]) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const response = await axiosClient.post(developerRoutes.availability, {
            date: formattedDate,
            unavailableSlots
        });
        return response.data;
    },

    async getUnavailableSlots(date: Date) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const response = await axiosClient.get(`${developerRoutes.availability}?date=${formattedDate}`);
        return response.data.data;
    },

    async updateDefaultAvailability(unavailableSlots: string[]) {
        const response = await axiosClient.post(developerRoutes.defaultAvailability, {
            unavailableSlots
        });
        return response.data;
    },

    async getDefaultUnavailableSlots() {
        const response = await axiosClient.get(developerRoutes.defaultAvailability);
        return response.data.data;
    },

    async getMyReviews(page = 1, limit = 10, search = '', sortOrder = 'newest') {
        const response = await axiosClient.get(developerRoutes.reviews, {
            params: { page, limit, search, sortOrder }
        });
        return response.data.data;
    },

    async getDashboardStats(year: number) {
        const response = await axiosClient.get(`${developerRoutes.dashboardStats}?year=${year}`);
        return response.data.data;
    },

    async getUpcomingSessionsPreview(limit = 2) {
        const response = await axiosClient.get(`${developerRoutes.upcomingSessions}?limit=${limit}`);
        return response.data.data;
    }
}

export default DeveloperApi

