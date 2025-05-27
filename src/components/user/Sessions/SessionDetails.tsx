import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Clock, DollarSign, MessageCircle, Briefcase, Video } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/shadcn-button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useSessionDetails } from '@/hooks/session/useSessionDetails';
import { PaymentButton } from '../payments/PaymentButton';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { socketService } from '@/service/socket/socketService'
import VideoSessionApi from '@/service/Api/VideoSessionApi';

type SessionStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'awaiting_payment';

const statusColors: Record<SessionStatus, string> = {
  pending: 'bg-amber-900/20 text-amber-400 border-amber-400/30',
  approved: 'bg-emerald-900/20 text-emerald-400 border-emerald-400/30',
  rejected: 'bg-rose-900/20 text-rose-400 border-rose-400/30',
  completed: 'bg-blue-900/20 text-blue-400 border-blue-400/30',
  awaiting_payment: 'bg-purple-900/20 text-purple-400 border-purple-400/30'
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  }
};

export default function SessionDetails() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { data: session, isLoading } = useSessionDetails(sessionId as string);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    
    const handleSessionStarted = (data: any) => {
      if (data.sessionId === sessionId) {
        setIsSessionActive(true);
        toast.success('Your session has started! Developer is waiting for you to join.', {
          duration: 8000,
          icon: '🎥',
        });
      }
    };
    
    socketService.on('video:session:initiated', handleSessionStarted);
    

    const checkSessionStatus = async () => {
      try {
        setIsCheckingStatus(true);
        const response = await VideoSessionApi.getSessionStatus(sessionId);
        
        if (response.data?.status === 'active' || response.data?.status === 'pending') {
          setIsSessionActive(true);
        } else {
          setIsSessionActive(false);
        }
      } catch (error) {
        console.error('Error checking session status:', error);
        toast.error('Failed to check session status');
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkSessionStatus();

    return () => {
      socketService.off('video:session:initiated', handleSessionStarted);
    };
  }, [sessionId]);

  const handleJoinCall = async () => {
    if (!sessionId) return;
    
    try {
   
      await VideoSessionApi.joinSession(sessionId, false);
      
      navigate(`/video-call-lobby/${sessionId}?mode=participant`);
    } catch (error) {
      console.error('Error joining session:', error);
      toast.error('Failed to join session. Please try again.');
    }
  };

  if (isLoading || !session || isCheckingStatus) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black/80">
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
          <Spinner className="w-12 h-12 text-white" />
        </div>
      </div>
    );
  }

  const renderActionButtons = () => {
    if (session.status === 'approved' && session.paymentStatus === 'pending') {
      return (
        <div className="flex gap-4">
          <PaymentButton sessionId={sessionId as string} amount={session.price} />
        </div>
      );
    }

    if ((session.status === 'approved' || 'scheduled') && session.paymentStatus === 'completed') {
      return (
        <div className="flex gap-4">
          <Button
            className={`flex-1 h-12 gap-2 rounded-xl ${isSessionActive ? 
              'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500/30 animate-pulse' : 
              'bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-400/20'}`}
            onClick={handleJoinCall}
            disabled={!isSessionActive}
          >
            <Video className="w-5 h-5" />
            {isSessionActive ? 'Join Session Now' : 'Waiting for Developer'}
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12 gap-2 rounded-xl bg-blue-950/50 hover:bg-blue-900/50 text-blue-400 border border-blue-400/20"
            onClick={() => navigate(`/chats/${session.developerId._id}`)}
          >
            <MessageCircle className="w-5 h-5" />
            Message
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-black/80 space-y-4 sm:space-y-8 px-2 sm:px-4 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/5 -mx-2 sm:-mx-4 px-4 py-3 sm:py-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            Session Details
          </motion.h1>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 sm:space-y-8"
        >
          <div className={cn(
            "relative overflow-hidden rounded-xl sm:rounded-2xl border p-4 sm:p-8",
            "bg-gradient-to-br from-black to-gray-900/50",
            "border-white/5 hover:border-white/10 transition-all duration-300",
            "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
          )}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-semibold text-white">
                  {session.title}
                </h1>
                <p className="text-sm sm:text-base text-gray-400">{session.description}</p>
              </div>
              <Badge className={cn(
                "self-start px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border font-medium backdrop-blur-xl",
                statusColors[session.status as SessionStatus]
              )}>
                {session.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-8">
              <motion.div
                variants={cardVariants}
                className={cn(
                  "relative overflow-hidden rounded-xl sm:rounded-2xl border p-4 sm:p-8",
                  "bg-gradient-to-br from-black to-gray-900/50",
                  "border-white/5 hover:border-white/10 transition-all duration-300",
                  "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
                )}
              >
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Session Information</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    {
                      icon: Calendar,
                      value: format(new Date(session.sessionDate), 'MMMM dd, yyyy')
                    },
                    {
                      icon: Clock,
                      value: `${format(new Date(session.startTime), 'hh:mm a')} (${session.duration}m)`
                    },
                    {
                      icon: DollarSign,
                      value: session.price
                    }
                  ].map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <detail.icon className="w-5 h-5 text-purple-400" />
                      <span className="text-white">{detail.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-6 space-y-4">
                  <h3 className="text-sm font-medium text-gray-400">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {session.topics.map((topic: string) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 text-white border-white/10 hover:bg-white/10 text-sm"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="flex gap-3 sm:gap-4">
                {renderActionButtons()}
              </div>
            </div>

            <motion.div
              variants={cardVariants}
              className={cn(
                "relative overflow-hidden rounded-xl sm:rounded-2xl border p-4 sm:p-8",
                "bg-gradient-to-br from-black to-gray-900/50",
                "border-white/5 hover:border-white/10 transition-all duration-300",
                "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
              )}
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Developer</h2>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="w-12 h-12 sm:w-16 sm:h-16 ring-2 ring-purple-500/30">
                  <AvatarImage src={session.developerId.profilePicture} />
                  <AvatarFallback>{session.developerId.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-white">
                    {session.developerId.username}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {session.developerId.email}
                  </p>
                </div>
              </div>

              <Separator className="my-6 bg-white/10" />

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <span className="text-white">{session.developerId.developerProfile.experience} years experience</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  <span className="text-white">{session.developerId.developerProfile.hourlyRate}/hour</span>
                </div>
              </div>

              <Separator className="my-6 bg-white/10" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-400">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {session.developerId.developerProfile.skills.map((skill: string) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="px-4 py-2 rounded-xl bg-white/5 text-white border-white/10 hover:bg-white/10"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-400">About</h3>
                <p className="text-sm text-gray-300">
                  {session.developerId.developerProfile.bio}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}