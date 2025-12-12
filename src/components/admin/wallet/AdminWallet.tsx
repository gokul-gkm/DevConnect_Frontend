import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { AdminTransactionHistory } from './AdminTransactionHistroy';
import { cn } from '@/lib/utils';
import { useAdminWallet } from '@/hooks/payments/useAdminWallet';


export const AdminWallet = () => {
  const { wallet, isLoading } = useAdminWallet();
  let totalIncome = undefined;
  let totalPlatformFees = undefined;
  if (wallet) {
    
    const completed = wallet.transactions.filter(t => t.status === 'completed');

     totalIncome = completed.filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

     totalPlatformFees = completed
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount * 0.20, 0);
  }


  const stats = [
    {
      label: 'Total Income',
      value: `$${totalIncome}`,
      icon: ArrowDownLeft,
      gradient: 'from-green-500/20 to-green-500/5'
    },
    {
      label: 'Total Platform Fee',
      value: `$${totalPlatformFees}`,
      icon: ArrowUpRight,
      gradient: 'from-red-500/20 to-red-500/5'
    },
  ];
   

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-950 p-6">
      <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto space-y-8 mb-4"
            >
        <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-sm shadow-xl"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                            Admin Wallet
                        </h1>
                       
                    </div>

                    
        </motion.div>
        </motion.div>
      
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 via-slate-900/50 to-slate-900/90 border border-purple-500/10 p-8 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
          <div className="relative">
            <h2 className="text-lg font-medium text-slate-400 mb-2">Available Balance</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">
                {formatCurrency(wallet?.balance || 0)}
              </span>
              <span className="text-sm text-slate-400">USD</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative overflow-hidden rounded-xl p-6",
                "bg-gradient-to-br",
                stat.gradient,
                "backdrop-blur-lg",
                "border border-white/5 hover:border-white/10",
                "transition-all duration-300",
                "shadow-lg shadow-black/40"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <AdminTransactionHistory wallet={wallet || null} />
      </div>
      </div>
      </>
  );
};