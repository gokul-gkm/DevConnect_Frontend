import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Wallet, WalletTransaction } from '@/types/payment';
import Pagination from '@/components/ui/Pagination';

interface TransactionHistoryProps {
  wallet: Wallet | null;
}

export const AdminTransactionHistory = ({ wallet }: TransactionHistoryProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil((wallet?.transactions.length || 0) / itemsPerPage);

  const paginatedTransactions = wallet?.transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateParams = ({ page }: { page: number }) => {
    setCurrentPage(page);
    };
    if (!wallet) return null;

  return (
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
        {paginatedTransactions?.map((transaction: WalletTransaction) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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

      {wallet?.transactions?.length > itemsPerPage && (
        <div className="p-4 border-t border-slate-800/50">
          <Pagination
            pagination={{
              currentPage,
              totalPages
            }}
            updateParams={updateParams}
          />
        </div>
      )}
    </motion.div>
  );
};