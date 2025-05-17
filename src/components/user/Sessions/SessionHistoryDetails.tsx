'use client'

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { 
  CalendarClock, 
  Clock, 
  DollarSign, 
  Star, 
  MessageSquare, 
  ChevronLeft,
  Check,
  AlertCircle,
  User,
  Layers,
  Layout,
  Award,
  Info,
  Code,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/shadcn-button'
import { Spinner } from '@/components/ui/spinner'
import { useSessionDetails } from '@/hooks/session/useSessionDetails'
import { RatingModal } from '../rating/RatingModel'

export function SessionHistoryDetails() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { data: session, isLoading, error, refetch } = useSessionDetails(sessionId)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (session && session.status === 'completed' && !session.rating) {
      const timer = setTimeout(() => {
        setIsRatingModalOpen(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [session])
  
  const handleRatingSubmitted = () => {
    refetch() 
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Spinner size="lg" />
        </motion.div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 shadow-lg"
        >
          <AlertCircle className="w-8 h-8 text-zinc-400 mb-3" />
          <h3 className="text-zinc-300 font-medium text-lg">Error</h3>
          <p className="text-zinc-400 mt-2">{error?.message || 'Session not found'}</p>
          <Button 
            onClick={() => navigate('/sessions/history')}
            className="mt-6"
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Session History
          </Button>
        </motion.div>
      </div>
    )
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      completed: {
        label: 'Completed',
        classes: 'bg-zinc-900/80 text-emerald-400 border-emerald-800/30',
        icon: Check
      },
      cancelled: {
        label: 'Cancelled',
        classes: 'bg-zinc-900/80 text-zinc-400 border-zinc-700/50',
        icon: AlertCircle
      },
      rejected: {
        label: 'Rejected',
        classes: 'bg-zinc-900/80 text-zinc-400 border-zinc-700/50',
        icon: AlertCircle
      }
    } as any

    return configs[status] || {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      classes: 'bg-zinc-900/80 text-zinc-400 border-zinc-700/50',
      icon: Info
    }
  }

  const statusConfig = getStatusConfig(session.status)
  const StatusIcon = statusConfig.icon

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.main 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <div className="min-h-screen p-4 lg:p-8 pt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={itemVariants}>
            <Button 
              onClick={() => navigate('/sessions/history')}
              className="mb-6 shadow-sm hover:shadow-md transition-shadow rounded-xl"
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Session History
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50
              hover:border-zinc-700/50 transition-all shadow-xl p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-medium text-white flex items-center gap-2">
                  <Layout className="w-5 h-5 text-zinc-400" />
                  {session.title}
                </h2>
                <p className="text-zinc-400 mt-1 text-sm">
                  Session ID: <span className="font-mono">{session._id.substring(0, 8)}</span>
                </p>
              </div>
              <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium border ${statusConfig.classes} shadow-lg`}>
                <StatusIcon className="w-4 h-4" />
                {statusConfig.label}
              </div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <div className="bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50
                hover:border-zinc-700/50 transition-all shadow-xl overflow-hidden h-full">
                <div className="p-4 border-b border-zinc-800/50 flex items-center gap-2">
                  <User className="w-4 h-4 text-zinc-400" />
                  <h3 className="font-medium text-white">Developer Profile</h3>
                </div>
                <div className="p-5">
                  <div className="flex flex-col items-center text-center mb-5">
                    <div className="relative mb-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-black/30 rounded-xl blur-xl transform -translate-y-1"></div>
                      <img
                        src={session.developerId.profilePicture || `https://ui-avatars.com/api/?name=${session.developerId.username}`}
                        alt={session.developerId.username}
                        className="w-24 h-24 rounded-xl object-cover border border-zinc-700/50 relative z-10"
                      />
                    </div>
                    <span className="font-medium text-lg text-white">{session.developerId.username}</span>
                    <div className="flex items-center gap-1 mt-1 justify-center">
                      <Award className="w-4 h-4 text-zinc-400" />
                      <p className="text-sm text-zinc-400">
                        {session.developerId.developerProfile?.experience || 0} years experience
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                      <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-3">
                        <Code className="w-4 h-4 text-zinc-400" />
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {session.developerId.developerProfile?.skills?.map((skill: string, index: number) => (
                          <span 
                            key={index}
                            className="px-2.5 py-1 bg-zinc-800/50 text-zinc-300 rounded-xl text-xs border border-zinc-700/30"
                          >
                            {skill}
                          </span>
                        )) || <span className="text-zinc-400 text-sm">No skills listed</span>}
                      </div>
                    </div>
                    
                    <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                      <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-2">
                        <DollarSign className="w-4 h-4 text-zinc-400" />
                        Hourly Rate
                      </h4>
                      <p className="text-white font-medium">
                        ${session.developerId.developerProfile?.hourlyRate || 0}/hour
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50
                hover:border-zinc-700/50 transition-all shadow-xl h-full">
                <div className="p-4 border-b border-zinc-800/50 flex items-center gap-2">
                  <Info className="w-4 h-4 text-zinc-400" />
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
            </motion.div>
          </div>

          {session.status === 'completed' && (
            <motion.div
              variants={itemVariants}
              className="mt-6 bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50
                hover:border-zinc-700/50 transition-all shadow-xl"
            >
              <div className="p-4 border-b border-zinc-800/50 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-zinc-400" />
                <h3 className="font-medium text-white">Feedback</h3>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                    <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-3">
                      <Star className="w-4 h-4 text-zinc-400" />
                      Rating
                    </h4>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < (session.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} 
                        />
                      ))}
                      {session.rating ? (
                        <div className="flex items-center">
                          <span className="ml-3 text-white font-medium">{session.rating}/5</span>
                          <Button 
                            size="sm"
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(true);
                              setIsRatingModalOpen(true);
                            }}
                            className="ml-3 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 rounded-xl"
                          >
                            Edit Rating
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center ml-3">
                          <span className="text-zinc-500 mr-3">Not rated yet</span>
                          <Button 
                            size="sm"
                            variant="secondary" 
                            onClick={() => {
                              setIsEditing(false);
                              setIsRatingModalOpen(true);
                            }}
                            className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-600/30 rounded-xl"
                          >
                            Rate Now
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                    <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-3">
                      <MessageSquare className="w-4 h-4 text-zinc-400" />
                      Comments
                    </h4>
                    <p className="text-zinc-300">
                      {session.feedback || "No feedback provided yet"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(session.status === 'rejected' || session.status === 'cancelled') && session.rejectionReason && (
            <motion.div
              variants={itemVariants}
              className="mt-6 bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50
                hover:border-zinc-700/50 transition-all shadow-xl"
            >
              <div className="p-4 border-b border-zinc-800/50 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-zinc-400" />
                <h3 className="font-medium text-white">Cancellation Reason</h3>
              </div>
              <div className="p-5">
                <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50">
                  <p className="text-zinc-300 leading-relaxed">{session.rejectionReason}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
  
      {sessionId && (
        <RatingModal 
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          sessionId={sessionId}
          onRatingSubmitted={handleRatingSubmitted}
          initialRating={isEditing ? session.rating || 0 : 0}
          initialFeedback={isEditing ? session.feedback || '' : ''}
          isEdit={isEditing}
        />
      )}
    </motion.main>
  )
}