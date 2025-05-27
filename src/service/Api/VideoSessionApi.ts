import axiosClient from "@/service/axiosinstance/axios";
import { videoSessionRoutes } from "@/utils/constants";

const VideoSessionApi = {

    async initSession(sessionId: string) {
        const response = await axiosClient.post(`${videoSessionRoutes.init}/${sessionId}/init`);
        return response.data;
    },

    async getSessionStatus(sessionId: string) {
        const response = await axiosClient.get(`${videoSessionRoutes.status}/${sessionId}/status`);
        console.log(response)
        return response.data;
    },

    async joinSession(sessionId: string, isHost: boolean) {
        const response = await axiosClient.post(`${videoSessionRoutes.join}/${sessionId}/join`, {
            isHost
        });
        return response.data;
    },

    async endSession(sessionId: string) {
        const response = await axiosClient.post(`${videoSessionRoutes.end}/${sessionId}/end`);
        return response.data;
    },

    async getSessionDetails(sessionId: string) {
        const response = await axiosClient.get(`${videoSessionRoutes.details}/${sessionId}`);
        return response.data;
    }
};

export default VideoSessionApi;


