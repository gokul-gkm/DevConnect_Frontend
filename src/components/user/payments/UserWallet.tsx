import { motion } from 'framer-motion';
import { useWallet } from '@/hooks/payments/useWallet';
import { DollarSign, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { formatCurrency } from '@/lib/formatters';
import { UserTransactionHistory } from './UserTransactionHistory';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export const UserWallet = () => {
  const { wallet, isLoading, refetchWallet } = useWallet();

 if (isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        text="Loading wallet..."
        color="white"
        bgColor="dark"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 via-slate-900/50 to-slate-900/90 border border-purple-500/10 p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-lg font-medium text-slate-400">Wallet Balance</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchWallet()}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  {formatCurrency(wallet?.balance || 0)}
                </span>
                <span className="text-sm text-slate-400">USD</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </motion.div>

        <UserTransactionHistory />
      </div>
    </div>
  );
};