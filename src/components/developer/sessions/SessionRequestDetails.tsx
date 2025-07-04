import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign,
  Mail,
  Tag,
  CheckCircle, 
  XCircle,
  MessageSquare,
  User,
  Shield,
  ExternalLink,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRejectionDialog } from '@/hooks/session/useRejectionDialog';
import { SessionRejectionDialog } from './SessionRejectionDialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Spinner } from '@/components/ui/spinner';
import { useSessionRequestDetails } from '@/hooks/session/useSessionRequestDetails';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const statusColors = {
  pending: {
    bg: 'bg-zinc-900',
    border: 'border-amber-800/40',
    text: 'text-amber-400',
    icon: <Clock className="w-5 h-5 text-amber-400" />
  },
  approved: {
    bg: 'bg-zinc-900',
    border: 'border-emerald-800/40',
    text: 'text-emerald-400',
    icon: <CheckCircle className="w-5 h-5 text-emerald-400" />
  },
  rejected: {
    bg: 'bg-zinc-900',
    border: 'border-rose-800/40',
    text: 'text-rose-400',
    icon: <XCircle className="w-5 h-5 text-rose-400" />
  },
  scheduled: {
    bg: 'bg-zinc-900',
    border: 'border-blue-800/40',
    text: 'text-blue-400',
    icon: <Calendar className="w-5 h-5 text-blue-400" />
  }
};

const fadeInUp = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -10, opacity: 0 }
};

export default function SessionRequestDetails() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();
  
  const {
    session,
    isLoading,
    acceptSession,
    rejectSession,
    isAccepting,
    isRejecting
  } = useSessionRequestDetails(sessionId);
    
  const {
    dialogState,
    rejectionReason,
    setRejectionReason,
    handleOpenDialog,
    handleCloseDialog,
  } = useRejectionDialog();

  const handleAccept = async () => {
    acceptSession();
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      return;
    }
    rejectSession(rejectionReason);
    handleCloseDialog();
  };

  if (isLoading) {
    return (
      <LoadingSpinner text='Loading Session Request Details...' bgColor='dark' />
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative p-8 rounded-xl bg-zinc-900/80 border border-zinc-800 shadow-2xl text-center max-w-md"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-rose-900/10 to-transparent rounded-xl blur-xl -z-10" />
          <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4 drop-shadow-lg" />
          <h2 className="text-2xl font-bold text-white mb-2">Session Not Found</h2>
          <p className="text-zinc-400 mb-6">The requested session could not be found or has been removed</p>
          <Button 
            onClick={() => navigate('/developer/session-requests')}
            className="bg-zinc-800 text-white hover:bg-zinc-700 rounded-xl shadow-lg shadow-purple-900/20 border border-purple-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Requests
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black pt-8 px-4 pb-20"
      >
        <div className="max-w-4xl mx-auto">

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost" 
              className="mb-6 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl group flex gap-2 items-center px-4 border border-zinc-800/30 shadow-lg shadow-purple-900/5 backdrop-blur-sm bg-zinc-900/40"
              onClick={() => navigate('/developer/session-requests')}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Requests</span>
            </Button>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, type: "spring" }}
            className="relative mb-8 overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-indigo-900/10 to-transparent rounded-2xl blur-3xl opacity-50" />
            <div className="relative bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
              
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-full p-3 shadow-lg shadow-purple-900/20">
                  <BookOpen className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1 relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-300">
                      Session Details
                    </span>
                  </h1>
                  <p className="text-zinc-400 max-w-md relative">
                    Review and manage this session request
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

    
          <AnimatePresence mode="wait">
            <motion.div 
              key={sessionId}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-6">
    
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative overflow-hidden rounded-2xl"
                >
           
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent blur-2xl opacity-30" />
                  
                  <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-xl p-8 rounded-2xl">
        
                    <div className="mb-6">
                      <Badge
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm",
                          statusColors[session.status as keyof typeof statusColors].bg,
                          statusColors[session.status as keyof typeof statusColors].border,
                          statusColors[session.status as keyof typeof statusColors].text,
                          "flex items-center gap-2 w-fit shadow-lg",
                          session.status === 'pending' && "animate-pulse shadow-amber-900/20",
                          session.status === 'approved' && "shadow-emerald-900/20",
                          session.status === 'rejected' && "shadow-rose-900/20",
                          session.status === 'scheduled' && "shadow-blue-900/20"
                        )}
                      >
                        {statusColors[session.status as keyof typeof statusColors].icon}
                        <span className="capitalize font-medium">{session.status}</span>
                      </Badge>
                    </div>
                    
                
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 mb-3">
                      {session.title}
                    </h1>
                    
                    <p className="text-zinc-400 max-w-3xl leading-relaxed mb-8 border-l-2 border-purple-800/50 pl-4 py-1">
                      {session.description}
                    </p>
                    
               
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-zinc-800/80 flex flex-col items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-400 mb-1" />
                        <p className="text-xs text-zinc-500">Date</p>
                        <p className="text-zinc-300 font-medium text-sm">{format(new Date(session.sessionDate), 'MMM dd, yyyy')}</p>
                      </div>
                      
                      <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-zinc-800/80 flex flex-col items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-400 mb-1" />
                        <p className="text-xs text-zinc-500">Time</p>
                        <p className="text-zinc-300 font-medium text-sm">{format(new Date(session.startTime), 'hh:mm a')}</p>
                      </div>
                      
                      <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-zinc-800/80 flex flex-col items-center justify-center">
                        <User className="w-5 h-5 text-purple-400 mb-1" />
                        <p className="text-xs text-zinc-500">Duration</p>
                        <p className="text-zinc-300 font-medium text-sm">{session.duration} minutes</p>
                      </div>
                      
                      <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-zinc-800/80 flex flex-col items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-400 mb-1" />
                        <p className="text-xs text-zinc-500">Payment</p>
                        <p className="text-green-400 font-medium text-sm">${session.price}</p>
                      </div>
                    </div>
                    
            
                    <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-zinc-800/80 mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-5 h-5 text-purple-400" />
                        <p className="text-zinc-300 font-medium">Topics for Discussion</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {session.topics.map((topic: string, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + (i * 0.05) }}
                          >
                            <Badge
                              variant="outline"
                              className="px-3 py-1.5 rounded-full bg-gradient-to-br from-indigo-900/40 to-purple-900/40 text-indigo-300 border-indigo-700/50 shadow-md"
                            >
                              {topic}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
         
                    {session.status === 'rejected' && session.rejectionReason && (
                      <motion.div 
                        className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-zinc-800/80 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="w-5 h-5 text-rose-400" />
                          <p className="text-zinc-300 font-medium">Rejection Reason</p>
                        </div>
                        <p className="text-zinc-400 italic border-l-2 border-rose-800/50 pl-4 py-1">
                          "{session.rejectionReason}"
                        </p>
                      </motion.div>
                    )}
                    
                  
                    {session.status === 'pending' && (
                      <motion.div 
                        className="flex flex-col sm:flex-row gap-4 mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <motion.div 
                          className="flex-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            className="w-full h-12 gap-2 rounded-xl bg-black hover:bg-zinc-900 text-emerald-400 border border-emerald-900/30 shadow-lg shadow-emerald-900/5 hover:shadow-emerald-900/10 transition-all duration-300"
                            onClick={handleAccept}
                            disabled={isAccepting}
                          >
                            {isAccepting ? (
                              <Spinner className="w-5 h-5" />
                            ) : (
                              <CheckCircle className="w-5 h-5" />
                            )}
                            Accept Session Request
                          </Button>
                        </motion.div>
                        
                        <motion.div 
                          className="flex-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="destructive"
                            className="w-full h-12 gap-2 rounded-xl bg-black hover:bg-zinc-900 text-rose-400 border border-rose-900/30 shadow-lg shadow-rose-900/5 hover:shadow-rose-900/10 transition-all duration-300"
                            onClick={() => handleOpenDialog(sessionId)}
                            disabled={isRejecting}
                          >
                            {isRejecting ? (
                              <Spinner className="w-5 h-5" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                            Decline Session Request
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                    
                  
                    {session.status !== 'pending' && (
                      <motion.div 
                        className="flex justify-end mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => navigate('/developer/session-requests')}
                          className="gap-2 rounded-xl bg-zinc-800/50 text-zinc-300 border-zinc-700/50 hover:bg-zinc-700/50 transition-all duration-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View All Requests
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
   
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-transparent blur-2xl opacity-30" />
                  
                  <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-xl p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-400" />
                        User Information
                      </h3>
                      
                      <Badge 
                        className="bg-black/30 text-indigo-300 border-indigo-700/30 flex items-center gap-1 px-2 py-1 rounded-full"
                      >
                        <Sparkles className="w-3 h-3" /> 
                        Requestor
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-md opacity-50" />
                        <Avatar className="w-20 h-20 rounded-full border-2 border-white/10 relative z-10 shadow-xl">
                          <AvatarImage src={session.userId?.profilePicture} />
                          <AvatarFallback className="bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-300 text-xl">
                            {session.userId?.username?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-1 space-y-3 text-center md:text-left">
                        <div>
                          <h3 className="text-xl font-medium text-white">{session.userId?.username}</h3>
                          <p className="text-xs text-indigo-300 flex items-center justify-center md:justify-start gap-1 mt-1">
                            <Shield className="w-3 h-3" /> Verified User
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm p-2 rounded-xl bg-black/30 border border-zinc-800/80 shadow-inner">
                          <Mail className="w-4 h-4 text-indigo-400" />
                          <span className="text-zinc-300 truncate">{session.userId?.email}</span>
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline" 
                            onClick={() => navigate(`/developer/chats/${session.userId._id}`)}
                            className="w-full md:w-auto gap-2 h-10 rounded-xl bg-black hover:bg-zinc-900 text-indigo-300 border-indigo-800/50 transition-all duration-300 shadow-lg shadow-indigo-900/5"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Contact User</span>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
              </div>
              
        <SessionRejectionDialog
          isOpen={dialogState.isOpen}
          onClose={handleCloseDialog}
          onReject={handleReject}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          isLoading={isRejecting}
        />
      </motion.div>
    </TooltipProvider>
  );
}
