import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/Input";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDeveloperSessionHistory } from '@/hooks/session/useDeveloperSessionHistory';
import { SessionsTable } from './SessionsTable';
import Pagination from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

export default function DeveloperSessionHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, isLoading } = useDeveloperSessionHistory(page, debouncedSearch);
  const sessions = data?.sessions || [];
  const pagination = data?.pagination;

  const filteredSessions = sessions.map((session: any) => ({
    ...session,
    userId: session.user
  }));


  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner text='Loading Session History ...' bgColor='dark' />
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="relative mb-8 overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-indigo-900/10 to-transparent rounded-2xl blur-3xl opacity-50" />
            <div className="relative bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
              
              <h1 className="text-4xl font-bold text-white mb-3 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-300">
                  Session History
                </span>
              </h1>
              <p className="text-zinc-400 max-w-md relative">
                View all your past sessions, including completed, cancelled, and rejected ones.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-grow">
              <div className="absolute inset-0 bg-purple-600/5 rounded-xl blur-md -z-10" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300/60" />
              <Input
                type="text"
                placeholder="Search by title, user or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10 h-12 bg-zinc-900/60 border-purple-800/20 focus:border-purple-500/50 rounded-xl backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.08)] transition-all duration-300"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-indigo-900/5 to-transparent rounded-xl blur-md -z-10" />
            <div className="bg-zinc-900/40 backdrop-blur-md border border-purple-800/10 rounded-xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
              <SessionsTable 
                sessions={filteredSessions}
                expandedSession={expandedSession}
                setExpandedSession={setExpandedSession}
                handleOpenDialog={() => {}}
                acceptSession={() => {}}
                isAccepting={false}
                isRejecting={false}
                navigateToDetails={(id: any) => navigate(`/developer/sessions/history/${id}`)}
                searchQuery={searchQuery}
              />
            </div>
          </motion.div>

          {pagination && pagination.totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 flex justify-center"
            >
              <Pagination
                pagination={{
                  currentPage: pagination.currentPage,
                  totalPages: pagination.totalPages
                }}
                updateParams={(params) => setPage(params.page)}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
