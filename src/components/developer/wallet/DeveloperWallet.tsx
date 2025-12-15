import { motion } from 'framer-motion';
import { useWallet } from '@/hooks/payments/useWallet';
import { ArrowDownLeft, ArrowUpRight, Loader2, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/ui/Pagination';
import { useState } from 'react';

export const DeveloperWallet = () => {
  const { wallet, isLoading } = useWallet();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const totalPages = Math.ceil((wallet?.transactions?.length || 0) / itemsPerPage);
  const paginatedTransactions = wallet?.transactions?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              <h2 className="text-lg font-medium text-slate-400 mb-2">Available Balance</h2>
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

    
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-lg rounded-2xl border border-slate-800/50 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-800/50">
            <h3 className="text-lg font-semibold text-white">Transaction History</h3>
          </div>

          <div className="divide-y divide-slate-800/50">
            {paginatedTransactions?.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-slate-800/20 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      transaction.type === 'credit' 
                        ? "bg-green-500/10 text-green-400" 
                        : "bg-red-500/10 text-red-400"
                    )}>
                      {transaction.type === 'credit' 
                        ? <ArrowDownLeft className="w-5 h-5" />
                        : <ArrowUpRight className="w-5 h-5" />
                      }
                    </div>
                    <div>
                      <p className="text-slate-200 font-medium">{transaction.description}</p>
                      <p className="text-sm text-slate-400">{formatDate(transaction.createdAt)}</p>
                       {transaction.sessionId && (
                          <p className="text-xs text-slate-500 mt-1">
                            Session ID: <span className="text-slate-300">{transaction.sessionId}</span>
                          </p>
                       )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-lg font-semibold",
                      transaction.type === 'credit' ? "text-green-400" : "text-red-400"
                    )}>
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <Badge className={cn(
                      "px-2 py-0.5",
                      transaction.status === 'completed' && "bg-green-500/10 text-green-400 border-green-500/20",
                      transaction.status === 'pending' && "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                      transaction.status === 'failed' && "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}

            {(!paginatedTransactions || paginatedTransactions.length === 0) && (
              <div className="p-8 text-center text-slate-400">
                No transactions found
              </div>
            )}
          </div>

          {(wallet?.transactions?.length ?? 0) > itemsPerPage && (
            <div className="p-4 border-t border-slate-800/50">
              <Pagination
                pagination={{
                  currentPage,
                  totalPages
                }}
                updateParams={({ page }) => setCurrentPage(page)}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};