import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/Input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionRejectionDialog } from './SessionRejectionDialog';
import { useSessionRequests } from '@/hooks/session/useSessionRequests';
import { useRejectionDialog } from '@/hooks/session/useRejectionDialog';
import { StatsPanel } from './StatsPanel';
import { SessionsTable } from './SessionsTable';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SessionRequests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    sessions,
    pagination,
    stats,
    isLoading,
    acceptSession,
    rejectSession,
    isAccepting,
    isRejecting,
    updatePage
  } = useSessionRequests();

  const {
    dialogState,
    rejectionReason,
    setRejectionReason,
    handleOpenDialog,
    handleCloseDialog,
  } = useRejectionDialog();

  const filteredSessions = sessions?.filter((session: any) => {
    const matchesSearch = 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.userId.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.topics.some((topic: any) => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = currentTab === 'all' || session.status === currentTab;
    
    return matchesSearch && matchesStatus;
  });

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    
    rejectSession({
      sessionId: dialogState.sessionId,
      reason: rejectionReason,
    });
    handleCloseDialog();
  };

  if (isLoading) {
    return <LoadingSpinner text='Loading Session Requests ...' bgColor='dark' />
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen  p-6">
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
                  Session Requests
                </span>
              </h1>
              <p className="text-zinc-400 max-w-md relative">
                Manage and respond to your incoming session requests efficiently.
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
                placeholder="Search by title, user or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-zinc-900/60 border-purple-800/20 focus:border-purple-500/50 rounded-xl backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.08)] transition-all duration-300"
              />
            </div>
           
          </motion.div>

          <StatsPanel 
            stats={stats} 
            currentTab={currentTab} 
            setCurrentTab={setCurrentTab} 
          />

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
                handleOpenDialog={handleOpenDialog}
                acceptSession={acceptSession}
                isAccepting={isAccepting}
                isRejecting={isRejecting}
                navigateToDetails={(id: any) => navigate(`/developer/session-requests/${id}`)}
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
                updateParams={(params) => updatePage(params.page)}
              />
            </motion.div>
          )}
        </motion.div>

        <SessionRejectionDialog
          isOpen={dialogState.isOpen}
          onClose={handleCloseDialog}
          onReject={handleReject}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          isLoading={isRejecting}
        />
      </div>
    </TooltipProvider>
  );
}

