import axiosClient from "@/service/axiosinstance/axios";
import { userRoutes } from "@/utils/constants";
import { ChangePasswordFormData } from "@/utils/validation/userValidation";

const UserApi = {
  getProfile: async () => {
      try {
        const response = await axiosClient.get(`${userRoutes.getProfile}`)
        return response.data;
      } catch (error: any) {
        console.error('API Error:', error.response?.data || error)
          throw error
      }
        
    },

    updateProfile: async (formData: FormData) => {
        try {
    
          const response = await axiosClient.put('/users/profile/update', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
    
          return response.data
        } catch (error: any) {
          console.error('API Error:', error.response?.data || error)
          throw error
        }
  },
    
  changePassword: async (data: ChangePasswordFormData) => {
    try {
      const response = await axiosClient.put('/users/change-password', data);
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error)
          throw error
    }
  },
    
  searchDevelopers: async (params: any) => {
    try {
        const queryString = new URLSearchParams();
        
        if (params.search) queryString.append('search', params.search);
        if (params.sort) queryString.append('sort', params.sort);
        if (params.page) queryString.append('page', params.page.toString());
        if (params.limit) queryString.append('limit', params.limit.toString());
        if (params.experience) queryString.append('experience', params.experience);
        if (params.availability) queryString.append('availability', params.availability);
        if (params.location) queryString.append('location', params.location);
        if (params.skills?.length > 0) {
            params.skills.forEach((skill: string) => {
                queryString.append('skills', skill);
            });
        }

      const response = await axiosClient.get(`/users/developers/search?${queryString.toString()}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
  },

  getPublicProfile: async (developerId: string) => {
    try {
        const response = await axiosClient.get(`/users/dev-profile/${developerId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}
  
}

export default UserApi

