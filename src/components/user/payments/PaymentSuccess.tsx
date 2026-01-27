import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";
import { useQueryClient } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<
    "loading" | "success" | "failed"
  >("loading");

  useEffect(() => {
    const clientSecret = searchParams.get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      setStatus("failed");
      return;
    }

    (async () => {
      const stripe = await stripePromise;
      if (!stripe) return;

      const { paymentIntent } =
        await stripe.retrievePaymentIntent(clientSecret);

      if (paymentIntent?.status === "succeeded") {
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
        setStatus("success");
      } else {
        setStatus("failed");
      }
    })();
  }, [queryClient, searchParams]);

  if (status === "loading") {
    return (
      <LoadingSpinner
        size="lg"
        text="Confirming payment..."
        fullScreen
      />
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-8 max-w-md w-full text-center"
        >
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Payment Failed
          </h2>
          <p className="text-slate-400 mb-6">
            We couldn’t confirm your payment. Please try again.
          </p>

          <Button
            onClick={() => navigate("/sessions/upcoming")}
            className="bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 rounded-xl"
          >
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-8 max-w-md w-full text-center"
      >
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          Payment Successful
        </h2>
        <p className="text-slate-400 mb-6">
          Your session has been booked successfully.
        </p>

        <div className="space-x-4">
          <Button
            onClick={() => navigate("/sessions/upcoming")}
            className="bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 rounded-xl"
          >
            View My Sessions
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/wallet")}
            className="bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 rounded-xl"
          >
            View Wallet
          </Button>
        </div>
      </motion.div>
    </div>
  );
}




