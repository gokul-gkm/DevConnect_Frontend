import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { PaymentElementForm } from "./PaymentElementForm";
import { useCreatePaymentSession } from "@/hooks/payments/usePaymentSession";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import { darkStripeAppearance } from "@/lib/stripeAppearance";

export const PaymentSection = ({
  sessionId,
  amount,
}: {
  sessionId: string;
  amount: number;
}) => {
  const {
    createPaymentSession,
    clientSecret,
    isLoading,
  } = useCreatePaymentSession(sessionId);

  if (!clientSecret) {
    return (
      <Button
        onClick={() => createPaymentSession()}
        disabled={isLoading}
            className="h-12 w-full rounded-xl dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 dark:text-emerald-400 border dark:border-emerald-500/30 shadow-lg dark:shadow-emerald-900/5 dark:hover:shadow-emerald-900/10 transition-all duration-300"

      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Pay ${amount.toFixed(2)}
      </Button>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: darkStripeAppearance,
      }}
    >
      <PaymentElementForm />
    </Elements>
  );
};
