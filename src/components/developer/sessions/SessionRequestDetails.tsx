import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ChevronLeft, User, CalendarClock, Clock, DollarSign, Layers, BookOpen, MessageSquare, AlertCircle, CheckCircle, XCircle, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRejectionDialog } from '@/hooks/session/useRejectionDialog';
import { SessionRejectionDialog } from './SessionRejectionDialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useSessionRequestDetails } from '@/hooks/session/useSessionRequestDetails';

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
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 shadow-lg"
        >
          <AlertCircle className="w-8 h-8 text-zinc-400 mb-3" />
          <h3 className="text-zinc-300 font-medium text-lg">Session not found</h3>
          <Button
            onClick={() => navigate('/developer/session-requests')}
            className="mt-6"
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Requests
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="min-h-screen p-4 lg:p-8 pt-20">
          <div className="max-w-5xl mx-auto">
            <Button
              onClick={() => navigate('/developer/session-requests')}
              className="mb-6 shadow-sm hover:shadow-md transition-shadow rounded-xl"
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Requests
            </Button>

            <div className="bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50 shadow-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-medium text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-zinc-400" />
                    {session.title}
                  </h2>
                  <p className="text-zinc-400 mt-1 text-sm">
                    Session ID: <span className="font-mono">{session._id.substring(0, 8)}</span>
                  </p>
                </div>
                <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium border bg-zinc-900/80 text-purple-300 border-purple-800/30 shadow-lg`}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div>
                <div className="bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50 shadow-xl overflow-hidden h-full">
                  <div className="p-4 border-b border-zinc-800/50 flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-400" />
                    <h3 className="font-medium text-white">User</h3>
                  </div>
                  <div className="p-5 flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 rounded-xl object-cover border border-zinc-700/50 mb-3">
                      <AvatarImage src={session.userId?.profilePicture || `https://ui-avatars.com/api/?name=${session.userId?.username}`} />
                      <AvatarFallback className="bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-300 text-xl">
                        {session.userId?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-lg text-white">{session.userId?.username}</span>
                    <span className="text-zinc-400 text-sm">{session.userId?.email}</span>
                    <div className="flex items-center gap-2 text-sm p-2 rounded-xl bg-black/30 border border-zinc-800/80 shadow-inner mt-3">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      <span className="text-zinc-300 truncate">{session.userId?.email}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/developer/chats/${session.userId._id}`)}
                      className="w-full mt-4 gap-2 h-10 rounded-xl bg-black hover:bg-zinc-900 text-indigo-300 border-indigo-800/50 transition-all duration-300 shadow-lg shadow-indigo-900/5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Contact User</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50 shadow-xl h-full">
                  <div className="p-4 border-b border-zinc-800/50 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-zinc-400" />
                    <h3 className="font-medium text-white">Session Details</h3>
                  </div>
                  <div className="p-5 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                        <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-2">
                          <CalendarClock className="w-4 h-4 text-zinc-400" />
                          Date
                        </h4>
                        <p className="text-white">{format(new Date(session.sessionDate), 'MMM dd, yyyy')}</p>
                      </div>
                      <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                        <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-2">
                          <Clock className="w-4 h-4 text-zinc-400" />
                          Time
                        </h4>
                        <p className="text-white">{format(new Date(session.startTime), 'hh:mm a')}</p>
                      </div>
                      <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                        <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-2">
                          <Clock className="w-4 h-4 text-zinc-400" />
                          Duration
                        </h4>
                        <p className="text-white">{session.duration} minutes</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                        <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-2">
                          <DollarSign className="w-4 h-4 text-zinc-400" />
                          Cost
                        </h4>
                        <p className="text-white text-lg font-medium">${session.price}</p>
                      </div>
                      <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                        <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-2">
                          <Layers className="w-4 h-4 text-zinc-400" />
                          Topics
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {session.topics?.map((topic: string, index: number) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 bg-zinc-800/50 text-zinc-300 rounded-xl text-xs border border-zinc-700/30"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                      <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-3">
                        <BookOpen className="w-4 h-4 text-zinc-400" />
                        Description
                      </h4>
                      <p className="text-zinc-300 leading-relaxed">{session.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {(session.status === 'rejected' ) && session.rejectionReason && (
              <div className="mt-6 bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50 shadow-xl">
                <div className="p-4 border-b border-zinc-800/50 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <h3 className="font-medium text-white">Cancellation Reason</h3>
                </div>
                <div className="p-5">
                  <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                    <p className="text-zinc-300 leading-relaxed">{session.rejectionReason}</p>
                  </div>
                </div>
              </div>
            )}

            {session.status === 'pending' && (
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  className="flex-1 h-12 gap-2 rounded-xl bg-black hover:bg-zinc-900 text-emerald-400 border border-emerald-900/30 shadow-lg shadow-emerald-900/5 hover:shadow-emerald-900/10 transition-all duration-300"
                  onClick={handleAccept}
                  disabled={isAccepting}
                >
                  {isAccepting ? (
                    <span className="animate-spin"><CheckCircle className="w-5 h-5" /></span>
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Accept Session Request
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 h-12 gap-2 rounded-xl bg-black hover:bg-zinc-900 text-rose-400 border border-rose-900/30 shadow-lg shadow-rose-900/5 hover:shadow-rose-900/10 transition-all duration-300"
                  onClick={() => handleOpenDialog(sessionId)}
                  disabled={isRejecting}
                >
                  {isRejecting ? (
                    <span className="animate-spin"><XCircle className="w-5 h-5" /></span>
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  Decline Session Request
                </Button>
              </div>
            )}

            <SessionRejectionDialog
              isOpen={dialogState.isOpen}
              onClose={handleCloseDialog}
              onReject={handleReject}
              rejectionReason={rejectionReason}
              setRejectionReason={setRejectionReason}
              isLoading={isRejecting}
            />
          </div>
        </div>
      </motion.main>
    </TooltipProvider>
  );
}
