import axiosClient from "../axiosinstance/axios";
import { paymentRoutes } from "@/utils/constants";
import { CreatePaymentSessionResponse, Wallet } from "@/types/payment";

const PaymentApi = {
    async createPaymentSession(sessionId: string): Promise<CreatePaymentSessionResponse> {
        const response = await axiosClient.post<CreatePaymentSessionResponse>(
            `${paymentRoutes.createSession}/${sessionId}/payment`
        );
        return response.data;
    },

    async getWallet(): Promise<Wallet> {
        const response = await axiosClient.get<Wallet>(paymentRoutes.wallet);
        return response.data;
    },

    async getAdminWallet(): Promise<Wallet> {
        const response = await axiosClient.get<Wallet>(paymentRoutes.adminWallet);
        return response.data;
    },

    async getWalletTransactions(page: number = 1, limit: number = 10) {
        const response = await axiosClient.get(paymentRoutes.transactions, {
            params: { page, limit }
        });
        return response.data;
    }
};

export default PaymentApi;
