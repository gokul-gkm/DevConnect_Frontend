import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Clock, 
  Calendar, 
  DollarSign, 
  User, 
  Mail, 
  CheckCircle, 
  XCircle,
  Zap
} from 'lucide-react';
import { Button } from "@/components/ui/shadcn-button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { SessionRejectionDialog } from './SessionRejectionDialog';
import { useSessionRequests } from '@/hooks/session/useSessionRequests';
import { useRejectionDialog } from '@/hooks/session/useRejectionDialog';
import { useState } from 'react';

interface Session {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  userId: {
    username: string;
    email: string;
  };
  sessionDate: string;
  startTime: string;
  duration: number;
  price: number;
  topics: string[];
}

const statusColors = {
  pending: 'bg-amber-900/20 text-amber-400 border-amber-400/30',
  approved: 'bg-emerald-900/20 text-emerald-400 border-emerald-400/30',
  rejected: 'bg-rose-900/20 text-rose-400 border-rose-400/30',
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

export default function SessionRequests() {

  const [searchQuery, setSearchQuery] = useState('');

  const {
    sessions,
    isLoading,
    acceptSession,
    rejectSession,
    isAccepting,
    isRejecting,
  } = useSessionRequests();

  const {
    dialogState,
    rejectionReason,
    setRejectionReason,
    handleOpenDialog,
    handleCloseDialog,
  } = useRejectionDialog();

    
    const filteredSessions = sessions?.filter((session: Session) =>
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.userId.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.topics.some((topic: string) => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const handleAccept = (sessionId: string) => {
    acceptSession(sessionId);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason', {
        icon: <Zap className="w-5 h-5 text-rose-400" />,
        style: {
          background: '#1a0d0f',
          border: '1px solid #dc262640',
          color: '#f87171'
        }
      });
      return;
    }
    rejectSession({
      sessionId: dialogState.sessionId,
      reason: rejectionReason,
    });
    handleCloseDialog();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
          <Spinner className="w-12 h-12 text-white" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Requests',
      value: sessions?.length || 0,
      icon: Clock,
      gradient: 'from-gray-900 to-black',
    },
    {
      label: 'Pending',
      value: sessions?.filter((s: Session) => s.status === 'pending').length || 0,
      icon: Clock,
      gradient: 'from-amber-950 to-black',
    },
    {
      label: 'Approved',
      value: sessions?.filter((s: Session) => s.status === 'approved').length || 0,
      icon: CheckCircle,
      gradient: 'from-emerald-950 to-black',
    },
    {
      label: 'Rejected',
      value: sessions?.filter((s: Session) => s.status === 'rejected').length || 0,
      icon: XCircle,
      gradient: 'from-rose-950 to-black',
    }
  ];

  return (
    <div className="min-h-screen bg-black/80 space-y-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/5 -mx-4 px-4 py-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
            >
              Session Requests
            </motion.h1>
          </div>
          <div className="relative w-full md:w-96">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent blur-xl opacity-30 rounded-2xl" />
            <Input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 rounded-2xl backdrop-blur-xl bg-black/40 border-white/10 hover:border-white/20 focus:border-white/30 transition-colors"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative overflow-hidden rounded-2xl p-6",
              "bg-gradient-to-br",
              stat.gradient,
              "border border-white/5 hover:border-white/10 transition-all duration-300",
              "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSessions?.map((session: Session) => (
            <motion.div
              key={session._id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "group relative overflow-hidden rounded-2xl border",
                "bg-gradient-to-br from-black to-gray-900/50",
                "border-white/5 hover:border-white/10 transition-all duration-300",
                "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
              )}
            >
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-white">
                      {session.title}
                    </h2>
                    <p className="text-gray-400 line-clamp-2">
                      {session.description}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      "px-4 py-2 rounded-xl border font-medium backdrop-blur-xl",
                      statusColors[session.status],
                      session.status === 'pending' && 'animate-pulse'
                    )}
                  >
                    {session.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-white">{session.userId.username}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-white">{session.userId.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      icon: Calendar,
                      value: format(new Date(session.sessionDate), 'dd MMM yyyy')
                    },
                    {
                      icon: Clock,
                      value: format(new Date(session.startTime), 'hh:mm a')
                    },
                    {
                      icon: Clock,
                      value: `${session.duration}m`
                    },
                    {
                      icon: DollarSign,
                      value: `${session.price}`
                    }
                  ].map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <detail.icon className="w-5 h-5 text-white" />
                      <span className="text-white">{detail.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {session.topics.map((topic: string) => (
                    <Badge
                      key={topic}
                      variant="outline"
                      className="px-4 py-2 rounded-xl bg-white/5 text-white border-white/10 hover:bg-white/10"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>

                {session.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      className="flex-1 h-12 gap-2 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-400/20"
                      onClick={() => handleAccept(session._id)}
                      disabled={isAccepting}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Accept Request
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 h-12 gap-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/50 text-rose-400 border border-rose-400/20"
                      onClick={() => handleOpenDialog(session._id)}
                      disabled={isRejecting}
                    >
                      <XCircle className="w-5 h-5" />
                      Decline Request
                    </Button>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredSessions?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 space-y-4"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">
              No sessions found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search criteria
            </p>
          </motion.div>
        )}
      </div>        

      <SessionRejectionDialog
        isOpen={dialogState.isOpen}
        onClose={handleCloseDialog}
        onReject={handleReject}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        isLoading={isRejecting}
      />
    </div>
  );
}