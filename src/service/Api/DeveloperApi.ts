import axiosClient from "@/service/axiosinstance/axios";
import { DeveloperProfile, Project } from "@/types/types";
import { DeveloperRoutes } from "@/utils/constants";

const DeveloperApi = {
    getProfile: async () => {
        const response = await axiosClient.get(`${DeveloperRoutes.getProfile}`)
        return response.data.data;
    },
    updateProfile: async (formData: FormData): Promise<DeveloperProfile> => {
        const response = await axiosClient.put(`${DeveloperRoutes.updateProfile}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
  },
    
  getProjects: async (page: number = 1) => {
    const response = await axiosClient.get(`${DeveloperRoutes.getProjects}?page=${page}&limit=5`);
    return response.data.data
  },
  
  addProject: async (formData: FormData): Promise<Project> => {
    const response = await axiosClient.post(`${DeveloperRoutes.addProject}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data.data
  },

  getProjectById: async (projectId: string) => {
    const response = await axiosClient.get(`${DeveloperRoutes.getProject}/${projectId}`);
    return response.data.data;
  },
  
  updateProject: async (formData: FormData) => {
    const projectId = formData.get('projectId');
    const response = await axiosClient.put(
        `${DeveloperRoutes.editProject}/${projectId}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
  },
  
  deleteProject: async (projectId: string) => {
    try {
        const response = await axiosClient.delete(`${DeveloperRoutes.deleteProject}/${projectId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
    
},
  
    
}

export default DeveloperApi

