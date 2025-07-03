import axiosClient from "@/service/axiosinstance/axios";
import { userRoutes } from "@/utils/constants";
import { ChangePasswordFormData } from "@/utils/validation/userValidation";
import publicAxios from "../axiosinstance/publicAxios";

const UserApi = {
  getProfile: async () => {
      try {
        const response = await axiosClient.get(userRoutes.getProfile);
        return response.data;
      } catch (error: any) {
        console.error('API Error:', error.response?.data || error)
          throw error
      }
        
    },

    updateProfile: async (formData: FormData) => {
        try {
            const response = await axiosClient.put(userRoutes.updateProfile, formData);
            return response.data;
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error);
            throw error;
        }
    },
    
  changePassword: async (data: ChangePasswordFormData) => {
    try {
      const response = await axiosClient.put(userRoutes.changePassword, data);
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
        if (params.location) queryString.append('location', params.location);
        
        if (params.skills?.length > 0) {
            params.skills.forEach((skill: string) => {
                queryString.append('skills[]', skill);
            });
        }

        if (params.languages?.length > 0) {
            params.languages.forEach((language: string) => {
                queryString.append('languages[]', language);
            });
        }

        if (params.priceRange) {
            if (params.priceRange.min !== undefined) {
                queryString.append('priceRange[min]', params.priceRange.min.toString());
            }
            if (params.priceRange.max !== undefined) {
                queryString.append('priceRange[max]', params.priceRange.max.toString());
            }
        }

        const response = await publicAxios.get(`${userRoutes.searchDevelopers}?${queryString.toString()}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
},

  getPublicProfile: async (developerId: string) => {
    try {
        const response = await publicAxios.get(`${userRoutes.getPublicProfile}/${developerId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}
  
}

export default UserApi

