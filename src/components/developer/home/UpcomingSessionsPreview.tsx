import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MessageCircle, ArrowRight, Layers, BookOpen, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const UpcomingSessionsPreview = ({ sessions = [], loading = false }) => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const headerAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  const formatDate = (date: any) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const formatTime = (time: any) => {
    return format(new Date(time), 'hh:mm a');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50 shadow-xl p-6 overflow-hidden relative"
    >
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <motion.div 
        variants={headerAnimation}
        initial="hidden"
        animate="visible"
        className="flex justify-between items-center mb-6 border-b border-zinc-800/50 pb-4"
      >
        <div className="flex items-center gap-2">
        <span className='p-3 bg-gradient-to-br from-blue-900/40 to-zinc-800/30 rounded-xl'>
            <CalendarClock className="w-5 h-5 text-zinc-400" />
            </span>
          <h3 className="text-xl font-medium text-white">
            Upcoming Sessions
          </h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-800/80 px-3 py-1.5 rounded-xl text-zinc-300 hover:text-white text-sm font-medium transition shadow-lg border border-zinc-700/30"
          onClick={() => navigate('/developer/sessions/scheduled')}
        >
          View All <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="py-12">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-center text-zinc-400 flex flex-col items-center gap-4"
          >
            <div className="w-8 h-8 border-t-2 border-l-2 border-zinc-500 rounded-full animate-spin"></div>
            <span>Loading your upcoming sessions...</span>
          </motion.div>
        </div>
      ) : sessions && sessions.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {sessions.map((session: any, index: any) => (
            <motion.div
              key={session._id}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2 }
              }}
              className="relative overflow-hidden"
            >
              <div className="bg-zinc-800/20 rounded-xl border border-zinc-800/50 shadow-lg overflow-hidden">
                <motion.div 
                  animate={{ 
                    opacity: hoveredIndex === index ? 0.5 : 0,
                  }}
                  className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-indigo-500/5 z-0"
                ></motion.div>
                
                <div className="relative z-10 p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1 truncate">{session.title || "Mentoring Session"}</h4>
                      <div className="text-zinc-500 text-xs">
                        Session ID: <span className="font-mono">{session._id.substring(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-zinc-800/30 rounded-xl p-3 border border-zinc-800/50">
                      <h4 className="text-zinc-300 text-xs flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        Date
                      </h4>
                      <p className="text-white text-sm">{formatDate(session.sessionDate)}</p>
                    </div>
                    
                    <div className="bg-zinc-800/30 rounded-xl p-3 border border-zinc-800/50">
                      <h4 className="text-zinc-300 text-xs flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        Time
                      </h4>
                      <p className="text-white text-sm">{formatTime(session.startTime)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-zinc-300 text-xs flex items-center gap-1.5 mb-2">
                      <Layers className="w-3.5 h-3.5 text-zinc-400" />
                      Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {session.topics?.map((topic: string) => (
                        <span 
                          key={topic} 
                          className="px-2.5 py-1 bg-zinc-800/50 text-zinc-300 rounded-xl text-xs border border-zinc-700/30"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-zinc-800/30">
                    <div className="flex-1 flex items-center gap-2">
                      <img 
                        src={session.userId.profilePicture || `https://ui-avatars.com/api/?name=${session.userId.username}`} 
                        alt={session.userId.username} 
                        className="w-8 h-8 rounded-xl object-cover border border-zinc-700/50" 
                      />
                      <span className="text-sm text-white">{session.userId.username}</span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-black hover:bg-zinc-900 text-indigo-300 border border-indigo-800/30 shadow-lg shadow-indigo-900/5 rounded-xl px-4 py-2 text-sm flex items-center gap-2 transition-all duration-300"
                      onClick={() => navigate(`/developer/chats/${session.userId._id}`)}
                    >
                      <MessageCircle className="w-4 h-4" /> Chat
                    </motion.button>
                  </div>
                  
                  <motion.div
                    animate={{
                      opacity: hoveredIndex === index ? 1 : 0,
                      width: hoveredIndex === index ? '100%' : '0%'
                    }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-indigo-600"
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-12 flex flex-col items-center justify-center gap-4 text-center"
        >
          <div className="bg-zinc-800/30 p-4 rounded-full border border-zinc-800/50">
            <BookOpen className="w-8 h-8 text-zinc-500" />
          </div>
          <h4 className="text-zinc-300 text-lg font-medium">No upcoming sessions</h4>
          <p className="text-zinc-400 text-sm max-w-md">
            You don't have any sessions scheduled. Book a new session with a mentor to get started.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-2 bg-black hover:bg-zinc-900 text-indigo-300 border border-indigo-800/30 shadow-lg shadow-indigo-900/5 rounded-xl px-6 py-2 text-sm font-medium transition-all duration-300"
            onClick={() => navigate('/developer/book-session')}
          >
            Book a Session
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};