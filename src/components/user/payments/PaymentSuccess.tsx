import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { useQueryClient } from '@tanstack/react-query';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const sessionId = localStorage.getItem('pending_payment_session');
    if (sessionId) {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      localStorage.removeItem('pending_payment_session');
    }
  }, [queryClient]);

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
            onClick={() => navigate('/sessions/upcoming')}
            className="bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 rounded-xl"
          >
            View My Sessions
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/wallet')}
            className="bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 rounded-xl"
          >
            View Wallet
          </Button>
        </div>
      </motion.div>
    </div>
  );
}