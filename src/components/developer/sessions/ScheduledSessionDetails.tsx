import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User,
  MessageSquare,
  Bookmark,
  Monitor,
  Link2,
  CheckCircle,
  Layers 
} from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useScheduledSessionDetails } from '@/hooks/session/useScheduledSessionDetails';

export default function ScheduledSessionDetails() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();
  
  const {
    session,
    isLoading,
  } = useScheduledSessionDetails(sessionId);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full -z-10" />
          <LoadingSpinner text='Loading Session Details...' bgColor='dark' />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-black/95 pt-8 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost" 
              className="mb-6 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl group flex gap-2 items-center px-4 border border-zinc-800/30 bg-zinc-900/40"
              onClick={() => navigate('/developer/sessions/scheduled')}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Scheduled Sessions</span>
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative p-8 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-transparent rounded-xl -z-10 opacity-70" />
            <CheckCircle className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Session Not Found</h2>
            <p className="text-zinc-400 mb-6">The scheduled session could not be found or has been removed</p>
            <Button 
              onClick={() => navigate('/developer/sessions/scheduled')}
              className="bg-zinc-800 text-white hover:bg-zinc-700 rounded-xl border border-indigo-500/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scheduled Sessions
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-black/95 pt-8 px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost" 
              className="mb-6 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl group flex gap-2 items-center px-4 border border-zinc-800/30 bg-zinc-900/40"
              onClick={() => navigate('/developer/sessions/scheduled')}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Scheduled Sessions</span>
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-8 overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-zinc-950/10 rounded-3xl blur-3xl opacity-70" />
            <div className="absolute -bottom-28 -left-28 w-56 h-56 bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="absolute -top-28 -right-28 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl" />
            
            <div className="relative bg-zinc-900/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.7)]">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="bg-gradient-to-br from-indigo-900/40 to-purple-800/30 p-5 rounded-2xl border border-indigo-500/10">
                  <Layers className="w-12 h-12 text-indigo-300" />
                </div>
                <div>
                  <Badge className="bg-indigo-950/70 text-indigo-300 border border-indigo-500/20 mb-2 px-3 py-1">
                    Scheduled Session
                  </Badge>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {session.title}
                  </h1>
                  <p className="text-zinc-400 max-w-2xl">
                    Review details and prepare for this upcoming scheduled session
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 relative overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent rounded-2xl blur-xl opacity-60" />
              <div className="relative bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-2xl transition-all duration-500 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)]">
                <h2 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-indigo-400" />
                  Session Information
                </h2>
                
                <div className="border-l-2 border-indigo-500/30 pl-4 py-2 mb-6">
                  <p className="text-zinc-300 leading-relaxed">
                    {session.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-zinc-800/80">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-indigo-400" />
                      <span className="text-sm text-zinc-400">Date</span>
                    </div>
                    <p className="text-white font-medium">{format(new Date(session.sessionDate), 'MMMM d, yyyy')}</p>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-zinc-800/80">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-indigo-400" />
                      <span className="text-sm text-zinc-400">Time</span>
                    </div>
                    <p className="text-white font-medium">{format(new Date(session.startTime), 'h:mm a')}</p>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-zinc-800/80">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-indigo-400" />
                      <span className="text-sm text-zinc-400">Duration</span>
                    </div>
                    <p className="text-white font-medium">{session.duration} minutes</p>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-zinc-800/80">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm text-zinc-400">Status</span>
                    </div>
                    <p className="text-emerald-400 font-medium">Scheduled</p>
                  </div>
                </div>
                
                <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-zinc-800/80 mb-6">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    Topics for Discussion
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {session.topics.map((topic: string, i: number) => (
                      <Badge 
                        key={i} 
                        className="bg-black/50 text-zinc-300 border-indigo-500/20 px-2.5 py-1 text-xs"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/5 rounded-xl blur-lg opacity-30" />
                    <div className="relative bg-black/30 backdrop-blur-xl border border-zinc-800/70 rounded-xl p-4">
                      <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-indigo-400" />
                        Join Meeting
                      </h3>
                      
                      <div className="mt-3">
                        <Button
                            onClick={()=> navigate('/video-call')}
                          className="bg-black border border-indigo-500/30 hover:bg-zinc-900 text-indigo-300 rounded-xl py-2 px-4 text-sm flex items-center gap-2"
                        >
                          <Link2 className="w-4 h-4" />
                          Join Meeting (Available 15 min before start)
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                           
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent rounded-2xl blur-xl opacity-60" />
              <div className="relative bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-2xl transition-all duration-500 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)]">
                <h2 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" />
                  User Information
                </h2>
                
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-md opacity-70" />
                    <Avatar className="w-20 h-20 border-2 border-indigo-500/20 relative">
                      <AvatarImage src={session.userId.profilePicture} />
                      <AvatarFallback className="bg-indigo-950/70 text-indigo-200">
                        {session.userId.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <h3 className="text-xl font-medium text-white">{session.userId.username}</h3>
                  <p className="text-zinc-400 text-sm">{session.userId.email}</p>
                  
                  <div className="w-full mt-6 space-y-3">
                    <Button
                      className="w-full bg-black hover:bg-zinc-900 border border-indigo-500/30 text-indigo-300 rounded-xl py-2"
                      onClick={() => navigate(`/developer/chats/${session.userId._id}`)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    
                 
                  </div>
                </div>
                
                
              </div>
            </motion.div>
          </div>
          
          
        </div>
      </div>
    </TooltipProvider>
  );
}
