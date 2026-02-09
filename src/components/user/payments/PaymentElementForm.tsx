import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function PaymentElementForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || isLoading) return;

    setIsLoading(true);
    
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      setIsLoading(false)
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: {
            type: "accordion",
          },
        }}
      />
      <Button type="submit" className="h-12 w-full rounded-xl dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 dark:text-emerald-400 border dark:border-emerald-500/30 shadow-lg dark:shadow-emerald-900/5 dark:hover:shadow-emerald-900/10 transition-all duration-300">
        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        Pay now
      </Button>
    </form>
  );
}
