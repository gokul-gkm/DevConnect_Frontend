import { Button } from "@/components/ui/Button";
import { useCreatePaymentSession } from "@/hooks/payments/usePaymentSession"
import { Loader2 } from "lucide-react";

interface PaymentButtonProps {
    sessionId: string,
    amount: number,
    disabled?: boolean,
    className?: string
}

export const PaymentButton = ({
    sessionId,
    amount,
    disabled = false,
    className = ''
}: PaymentButtonProps) => {
    const { createPaymentSession, isLoading } = useCreatePaymentSession(sessionId);

    return (
        <Button
            onClick={() => createPaymentSession()}
            disabled={isLoading || disabled}
            className={`inline-flex items-center justify-center flex-1 h-12 gap-2 rounded-xl dark:bg-purple-950/50 hover:dark:bg-purple-900/50 dark:text-purple-400 border dark:border-purple-400/20 ${className}`}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Pay ${amount.toFixed(2)}
        </Button>
    )
}