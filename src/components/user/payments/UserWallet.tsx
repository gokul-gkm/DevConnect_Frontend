import { motion } from 'framer-motion';
import { useWallet } from '@/hooks/payments/useWallet';
import { DollarSign, RefreshCw, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { formatCurrency } from '@/lib/formatters';
import { UserTransactionHistory } from './UserTransactionHistory';
import { cn } from '@/lib/utils';
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

  const stats = [
    {
      label: 'Total Income',
      value: formatCurrency(0),
      icon: ArrowDownLeft,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Total Spent',
      value: formatCurrency( 0),
      icon: ArrowUpRight,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/50 backdrop-blur-lg rounded-xl border border-slate-800/50 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className={cn("text-xl font-semibold mt-1", stat.color)}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <UserTransactionHistory />
      </div>
    </div>
  );
};