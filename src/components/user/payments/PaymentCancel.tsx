import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import toast from 'react-hot-toast';

export default function PaymentCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    toast.error('Payment was cancelled');
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-8 max-w-md w-full text-center"
      >
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          Payment Cancelled
        </h2>
        <p className="text-slate-400 mb-6">
          Your payment was cancelled. No charges were made.
        </p>
        
        <div className="space-x-4">
          <Button
            onClick={() => navigate(`/sessions/${sessionId}`)}
            className="bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/sessions/upcoming')}
          >
            View Sessions
          </Button>
        </div>
      </motion.div>
    </div>
  );
}