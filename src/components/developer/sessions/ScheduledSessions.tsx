import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Clock, Layout, Users, ArrowRight, Clock3, User } from 'lucide-react';
import { Input } from "@/components/ui/Input";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useScheduledSessions } from '@/hooks/session/useScheduledSessions';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/shadcn-button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ScheduledSessions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const {
    sessions,
    pagination,
    stats,
    isLoading,
    updatePage
  } = useScheduledSessions();

  const filteredSessions = sessions?.filter((session: any) => {
    const matchesSearch = 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.userId.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.topics.some((topic: any) => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full -z-10" />
          <LoadingSpinner text='Loading Scheduled Sessions...' bgColor='dark' />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen p-6 bg-gradient-to-b from-black/95 via-black to-black/95">
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
            className="relative mb-10 overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-zinc-950/10 rounded-3xl blur-3xl opacity-70" />
            <div className="absolute -bottom-28 -left-28 w-56 h-56 bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="absolute -top-28 -right-28 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl" />
            
            <div className="relative bg-zinc-900/20 backdrop-blur-xl border border-white/5 rounded-3xl p-10 overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.7)]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
              
              <div className="flex items-center gap-5">
                <div className="bg-gradient-to-br from-indigo-900/40 to-purple-800/30 p-5 rounded-2xl shadow-[inset_0_0_15px_rgba(79,70,229,0.2)] border border-indigo-500/10">
                  <Calendar className="w-6 h-6 text-indigo-300 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-3 relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                      Scheduled Sessions
                    </span>
                  </h1>
                  
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            <div className="relative overflow-hidden rounded-2xl md:col-span-3 mb-2">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-purple-900/5 to-transparent rounded-2xl blur-xl opacity-60" />
              <div className="relative bg-zinc-900/20 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex items-center overflow-hidden shadow-[0_8px_30px_-10px_rgba(0,0,0,0.4)]">
                <div className="flex-grow relative">
                  <div className="absolute inset-0 bg-indigo-600/5 rounded-xl blur-md -z-10" />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-300/60" />
                  <Input
                    type="text"
                    placeholder="Search by title, user or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-black/40 border-indigo-800/20 focus:border-indigo-500/50 rounded-xl backdrop-blur-sm shadow-[0_0_15px_rgba(79,70,229,0.08)] transition-all duration-300"
                  />
                </div>
                
                <div className="ml-4 flex space-x-3 bg-black/40 p-1.5 rounded-xl border border-indigo-900/20 backdrop-blur-sm">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setViewType('grid')}
                        variant="ghost"
                        className={cn(
                          "rounded-xl p-2 h-9 w-9 transition-all duration-300", 
                          viewType === 'grid' ? 
                            "bg-indigo-950/70 text-indigo-300 shadow-inner shadow-indigo-900/30 border border-indigo-500/20" : 
                            "text-zinc-400 hover:text-indigo-300 hover:bg-black/40"
                        )}
                      >
                        <Layout className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-black/80 border-zinc-800 text-zinc-300">
                      <p className="text-xs">Grid View</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setViewType('list')}
                        variant="ghost"
                        className={cn(
                          "rounded-xl p-2 h-9 w-9 transition-all duration-300", 
                          viewType === 'list' ? 
                            "bg-indigo-950/70 text-indigo-300 shadow-inner shadow-indigo-900/30 border border-indigo-500/20" : 
                            "text-zinc-400 hover:text-indigo-300 hover:bg-black/40"
                        )}
                      >
                        <Users className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-black/80 border-zinc-800 text-zinc-300">
                      <p className="text-xs">List View</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/5 rounded-2xl blur-xl opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="relative bg-black/30 backdrop-blur-xl border border-indigo-500/10 group-hover:border-indigo-500/20 p-6 rounded-2xl h-full shadow-[0_8px_30px_-10px_rgba(0,0,0,0.4)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-xl bg-indigo-900/30 border border-indigo-500/20">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Total Sessions</h3>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-bold text-white">{stats.total}</span>
                  <span className="text-indigo-400 text-sm">scheduled sessions</span>
                </div>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/5 rounded-2xl blur-xl opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="relative bg-black/30 backdrop-blur-xl border border-purple-500/10 group-hover:border-purple-500/20 p-6 rounded-2xl h-full shadow-[0_8px_30px_-10px_rgba(0,0,0,0.4)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-xl bg-purple-900/30 border border-purple-500/20">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Active Users</h3>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-bold text-white">{filteredSessions?.length || 0}</span>
                  <span className="text-purple-400 text-sm">unique users</span>
                </div>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/5 rounded-2xl blur-xl opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="relative bg-black/30 backdrop-blur-xl border border-indigo-500/10 group-hover:border-indigo-500/20 p-6 rounded-2xl h-full shadow-[0_8px_30px_-10px_rgba(0,0,0,0.4)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-xl bg-indigo-900/30 border border-indigo-500/20">
                    <Clock3 className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Upcoming Next</h3>
                </div>
                {filteredSessions && filteredSessions.length > 0 ? (
                  <div className="mt-3">
                    <div className="text-xs text-indigo-300 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      {format(new Date(filteredSessions[0].sessionDate), 'MMM dd, yyyy')} at {format(new Date(filteredSessions[0].startTime), 'hh:mm a')}
                    </div>
                    <div className="text-lg font-medium text-white truncate mt-1.5">
                      {filteredSessions[0].title}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[60px]">
                    <p className="text-sm text-zinc-400">No upcoming sessions</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {viewType === 'grid' ? (
              <motion.div 
                key="grid-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
              >
                {filteredSessions && filteredSessions.length > 0 ? (
                  filteredSessions.map((session: any, index: number) => (
                    <motion.div
                      key={session._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (index * 0.05) }}
                      className="relative overflow-hidden rounded-2xl group"
                      whileHover={{ y: -5 }}
                      onClick={() => navigate(`/developer/sessions/scheduled/${session._id}`)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent group-hover:opacity-100 transition-opacity rounded-2xl blur-xl -z-10 opacity-60" />
                      <div className="relative bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 group-hover:border-indigo-500/30 p-6 rounded-2xl transition-all duration-500 h-full flex flex-col shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)]">
                        <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-500" />
                        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors duration-500" />
                        
                        <div className="mb-4 flex justify-between items-start relative">
                          <div>
                            <Badge className="bg-indigo-950/70 text-indigo-300 border border-indigo-500/20 shadow-[0_2px_10px_-2px_rgba(99,102,241,0.3)] mb-2 px-2.5 py-0.5">
                              Scheduled
                            </Badge>
                            <h3 className="text-xl font-medium text-white line-clamp-2 group-hover:text-indigo-100 transition-colors">{session.title}</h3>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-5 relative z-10">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-md opacity-80 group-hover:opacity-100 transition-opacity" />
                            <Avatar className="h-10 w-10 border border-indigo-500/20 relative z-10 shadow-lg">
                              <AvatarImage src={session.userId.profilePicture} />
                              <AvatarFallback className="bg-indigo-950/70 text-indigo-200">
                                {session.userId.username?.[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white group-hover:text-indigo-100 transition-colors">{session.userId.username}</p>
                            <p className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">{session.userId.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-5 flex-grow relative z-10">
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-zinc-800/50 group-hover:border-indigo-500/20 transition-all duration-300">
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm text-zinc-300">
                              {format(new Date(session.sessionDate), 'MMMM d, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-zinc-800/50 group-hover:border-indigo-500/20 transition-all duration-300">
                            <Clock className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm text-zinc-300">
                              {format(new Date(session.startTime), 'hh:mm a')} ({session.duration} mins)
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {session.topics.slice(0, 3).map((topic: string, i: number) => (
                            <Badge 
                              key={i} 
                              className="bg-black/50 text-zinc-300 border-indigo-500/20 px-2.5 py-0.5 text-xs group-hover:bg-indigo-950/30 group-hover:border-indigo-500/30 transition-all duration-300"
                            >
                              {topic}
                            </Badge>
                          ))}
                          {session.topics.length > 3 && (
                            <Badge variant="outline" className="bg-black/50 text-zinc-400 border-zinc-700 px-2.5 py-0.5 text-xs">
                              +{session.topics.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="mt-auto">
                          <Button
                            onClick={()=> navigate(`/developer/sessions/scheduled/${session._id}`)}
                            className="w-full bg-black hover:bg-zinc-900 border border-indigo-500/30 text-indigo-300 rounded-xl h-10 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    className="col-span-3 relative overflow-hidden rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-purple-950/10 to-transparent rounded-2xl blur-xl opacity-70" />
                    <div className="relative bg-zinc-900/20 backdrop-blur-xl border border-zinc-800/50 p-10 rounded-2xl flex flex-col items-center justify-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)]">
                      <div className="w-20 h-20 rounded-full bg-indigo-950/30 flex items-center justify-center border border-indigo-500/20 mb-5 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]">
                        <Calendar className="w-10 h-10 text-indigo-400/70" />
                      </div>
                      <h3 className="text-2xl font-medium text-white mb-3">No Scheduled Sessions</h3>
                      <p className="text-sm text-zinc-400 mb-8 max-w-md text-center">
                        You don't have any scheduled sessions yet. When users book sessions with you and they get approved, they'll appear here.
                      </p>
                      <Button
                        onClick={() => navigate('/developer/session-requests')}
                        className="bg-indigo-950/50 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 rounded-xl px-5 py-2 shadow-[0_5px_25px_-5px_rgba(99,102,241,0.3)]"
                      >
                        Check Session Requests
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="list-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-5 mb-10"
              >
                {filteredSessions && filteredSessions.length > 0 ? (
                  filteredSessions.map((session: any, index: number) => (
                    <motion.div
                      key={session._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (index * 0.05) }}
                      className="relative overflow-hidden rounded-2xl group cursor-pointer"
                      whileHover={{ y: -3 }}
                      onClick={() => navigate(`/developer/sessions/scheduled/${session._id}`)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent group-hover:opacity-100 transition-opacity rounded-2xl blur-xl -z-10 opacity-60" />
                      <div className="relative bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 group-hover:border-indigo-500/30 p-5 rounded-2xl transition-all duration-500 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)]">
                        <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-500" />
                        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors duration-500" />
                        
                        <div className="flex flex-col md:flex-row gap-5 items-start md:items-center relative z-10">
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-md opacity-80 group-hover:opacity-100 transition-opacity" />
                            <Avatar className="h-14 w-14 border border-indigo-500/20 relative z-10 shadow-lg">
                              <AvatarImage src={session.userId.profilePicture} />
                              <AvatarFallback className="bg-indigo-950/70 text-indigo-200">
                                {session.userId.username?.[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-black z-20" />
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                              <div>
                                <Badge className="bg-indigo-950/70 text-indigo-300 border border-indigo-500/20 shadow-[0_2px_10px_-2px_rgba(99,102,241,0.3)] mb-1.5 px-2.5 py-0.5">
                                  Scheduled
                                </Badge>
                                <h3 className="text-xl font-medium text-white group-hover:text-indigo-100 transition-colors">{session.title}</h3>
                              </div>
                              <div className="md:text-right">
                                <div className="flex items-center gap-1.5 md:justify-end">
                                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                  <p className="text-sm text-indigo-400">
                                    {format(new Date(session.sessionDate), 'MMM d, yyyy')}
                                  </p>
                                </div>
                                <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors flex items-center gap-1.5 md:justify-end">
                                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                  {format(new Date(session.startTime), 'hh:mm a')} 
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                                    {session.duration} mins
                                  </span>
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {session.topics.map((topic: string, i: number) => (
                                <Badge 
                                  key={i} 
                                  className="bg-black/50 text-zinc-300 border-indigo-500/20 px-2.5 py-0.5 text-xs group-hover:bg-indigo-950/30 group-hover:border-indigo-500/30 transition-all duration-300"
                                >
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-zinc-400 text-sm">
                                  <User className="w-3.5 h-3.5" />
                                  <span>{session.userId.username}</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                <div className="text-xs text-zinc-500 truncate max-w-[200px]">
                                  {session.userId.email}
                                </div>
                              </div>
                              <Button
                              onClick={()=> navigate(`/developer/sessions/scheduled/${session._id}`)}
                                size="sm"
                                className="bg-black hover:bg-zinc-900 border border-indigo-500/30 text-indigo-300 rounded-xl h-9 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] transition-all duration-300 flex items-center gap-2"
                              >
                                <span>View Details</span>
                                <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    className="relative overflow-hidden rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-purple-950/10 to-transparent rounded-2xl blur-xl opacity-70" />
                    <div className="relative bg-zinc-900/20 backdrop-blur-xl border border-zinc-800/50 p-10 rounded-2xl flex flex-col items-center justify-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)]">
                      <div className="w-20 h-20 rounded-full bg-indigo-950/30 flex items-center justify-center border border-indigo-500/20 mb-5 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]">
                        <Calendar className="w-10 h-10 text-indigo-400/70" />
                      </div>
                      <h3 className="text-2xl font-medium text-white mb-3">No Scheduled Sessions</h3>
                      <p className="text-sm text-zinc-400 mb-8 max-w-md text-center">
                        You don't have any scheduled sessions yet. When users book sessions with you and they get approved, they'll appear here.
                      </p>
                      <Button
                        onClick={() => navigate('/developer/session-requests')}
                        className="bg-indigo-950/50 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 rounded-xl px-5 py-2 shadow-[0_5px_25px_-5px_rgba(99,102,241,0.3)]"
                      >
                        Check Session Requests
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {filteredSessions && filteredSessions.length > 0 && pagination && pagination.totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center mt-8 mb-4"
            >
              <div className="relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent rounded-xl blur-lg opacity-70" />
                <div className="relative bg-black/30 backdrop-blur-xl border border-zinc-800/70 p-2 rounded-xl">
                  <Pagination
                    pagination={{
                      currentPage: pagination.currentPage,
                      totalPages: pagination.totalPages
                    }}
                    updateParams={(params) => updatePage(params.page)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
