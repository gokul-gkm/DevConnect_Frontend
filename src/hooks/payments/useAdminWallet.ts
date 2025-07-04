import PaymentApi from "@/service/Api/PaymentApi"
import { useQuery } from "@tanstack/react-query"

export const useAdminWallet = () => {
    const {
        data: wallet,
        isLoading: isLoadingWallet,
        error: walletError,
        refetch: refetchWallet
    } = useQuery({
        queryKey: ['wallet'],
        queryFn: PaymentApi.getAdminWallet,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true
    });

    return {
        wallet,
        isLoading: isLoadingWallet,
        error: walletError,
        refetchWallet
    }
}