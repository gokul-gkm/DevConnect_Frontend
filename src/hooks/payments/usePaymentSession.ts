import PaymentApi from "@/service/Api/PaymentApi";
import { useMutation } from "@tanstack/react-query";
import {toast} from "react-hot-toast";



export const useCreatePaymentSession = ( sessionId: string) => {

    const { mutate: createPaymentSession, isPending: isLoading } = useMutation({
        mutationFn: () => PaymentApi.createPaymentSession(sessionId),
        onSuccess: (data) => {
            localStorage.setItem('pending_payment_session', sessionId);
            window.location.href = data.url;
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create payment session. Please try again.');
        }
    })

    return {
        createPaymentSession,
        isLoading
    }
}
