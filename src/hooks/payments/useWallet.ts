import PaymentApi from "@/service/Api/PaymentApi"
import { useQuery } from "@tanstack/react-query"

export const useWallet = () => {
    const {
        data: wallet,
        isLoading: isLoadingWallet,
        error: walletError,
        refetch: refetchWallet
    } = useQuery({
        queryKey: ['wallet'],
        queryFn: PaymentApi.getWallet,
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