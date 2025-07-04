import { useParams, useNavigate } from 'react-router-dom';
import { useDeveloperSessionHistoryDetails } from '@/hooks/session/useDeveloperSessionHistoryDetails';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ChevronLeft, User, CalendarClock, Clock, DollarSign, Layers, BookOpen, Star, MessageSquare, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/shadcn-button';

export default function DeveloperSessionHistoryDetails() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading } = useDeveloperSessionHistoryDetails(sessionId!);

  if (isLoading) return <LoadingSpinner text="Loading session details..." bgColor="dark" />;
  if (!session) return (
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
          onClick={() => navigate(-1)}
          className="mt-6"
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Session History
        </Button>
      </motion.div>
    </div>
  );

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="min-h-screen p-4 lg:p-8 pt-20">
        <div className="max-w-5xl mx-auto">
          <Button 
            onClick={() => navigate(-1)}
            className="mb-6 shadow-sm hover:shadow-md transition-shadow rounded-xl"
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Session History
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
                  <img
                    src={session.user.profilePicture || `https://ui-avatars.com/api/?name=${session.user.username}`}
                    alt={session.user.username}
                    className="w-24 h-24 rounded-xl object-cover border border-zinc-700/50 mb-3"
                  />
                  <span className="font-medium text-lg text-white">{session.user.username}</span>
                  <span className="text-zinc-400 text-sm">{session.user.email}</span>
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

          {(session.rating?.rating || session.rating?.comment) && (
            <div className="mt-6 bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50 shadow-xl">
              <div className="p-4 border-b border-zinc-800/50 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <h3 className="font-medium text-white">Rating & Feedback</h3>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                  <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-3">
                    <Star className="w-4 h-4 text-amber-400" />
                    Rating
                  </h4>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < (session.rating?.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} 
                      />
                    ))}
                    {session.rating?.rating ? (
                      <span className="ml-3 text-white font-medium">{session.rating.rating}/5</span>
                    ) : (
                      <span className="ml-3 text-zinc-500">Not rated</span>
                    )}
                  </div>
                </div>
                <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                  <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-3">
                    <MessageSquare className="w-4 h-4 text-zinc-400" />
                    Feedback
                  </h4>
                  <p className="text-zinc-300">{session.rating?.comment || "No feedback provided."}</p>
                </div>
              </div>
            </div>
          )}

          {(session.status === 'rejected' || session.status === 'cancelled') && session.rejectionReason && (
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
        </div>
      </div>
    </motion.main>
  );
}
