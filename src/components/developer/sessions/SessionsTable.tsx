import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Clock, CheckCircle, XCircle, Eye, ChevronDown, ChevronUp, Search, ArrowUpRight, DollarSign, CircleCheck, TicketX } from 'lucide-react';
import { Button } from "@/components/ui/shadcn-button";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const statusConfig = {
  pending: {
    color: 'text-amber-400',
    bgColor: 'bg-black/40',
    borderColor: 'border-amber-800/20',
    icon: <Clock className="w-3.5 h-3.5 text-amber-400" />
  },
  approved: {
    color: 'text-emerald-400',
    bgColor: 'bg-black/40',
    borderColor: 'border-emerald-800/20',
    icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
  },
  rejected: {
    color: 'text-rose-400',
    bgColor: 'bg-black/40',
    borderColor: 'border-rose-800/20',
    icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />
  },
  cancelled: {
    color: 'text-red-400',
    bgColor: 'bg-black/40',
    borderColor: 'border-red-800/20',
    icon: <TicketX  className="w-3.5 h-3.5 text-red-400" />
  },
  scheduled: {
    color: 'text-blue-400',
    bgColor: 'bg-black/40',
    borderColor: 'border-blue-800/20',
    icon: <Calendar className="w-3.5 h-3.5 text-blue-400" />
  },
  completed: {
    color: 'text-green-400',
    bgColor: 'bg-black/40',
    borderColor: 'border-green-800/20',
    icon: <CircleCheck className="w-3.5 h-3.5 text-green-400" />
  }
};

interface SessionsTableProps {
  sessions: any[];
  expandedSession: string | null;
  setExpandedSession: (id: string | null) => void;
  handleOpenDialog: (id: string) => void;
  acceptSession: (id: string) => void;
  isAccepting: boolean;
  isRejecting: boolean;
  navigateToDetails: (id: string) => void;
  searchQuery: string;
}

export const SessionsTable: React.FC<SessionsTableProps> = ({
  sessions,
  expandedSession,
  setExpandedSession,
  handleOpenDialog,
  acceptSession,
  isAccepting,
  isRejecting,
  navigateToDetails,
  searchQuery
}) => {
  const toggleExpandSession = (id: string) => {
    setExpandedSession(expandedSession === id ? null : id);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-zinc-900/40 to-black/60 backdrop-blur-md pointer-events-none" />
      
      <div className="absolute -top-20 -right-10 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl opacity-30" />

      <div className="relative border border-white/[0.07] bg-gradient-to-b from-zinc-900/80 via-black/70 to-zinc-900/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-zinc-900/80 via-black/70 to-zinc-900/60">
              <th className="text-left py-5 px-6 border-b border-white/[0.05] text-zinc-300 font-medium text-xs uppercase tracking-wider">Request</th>
              <th className="text-left py-5 px-6 border-b border-white/[0.05] text-zinc-300 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Date & Time</th>
              <th className="text-left py-5 px-6 border-b border-white/[0.05] text-zinc-300 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Topics</th>
              <th className="text-left py-5 px-6 border-b border-white/[0.05] text-zinc-300 font-medium text-xs uppercase tracking-wider">Status</th>
              <th className="text-right py-5 px-6 border-b border-white/[0.05] text-zinc-300 font-medium text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {sessions?.length > 0 ? (
              sessions.map((session, index) => (
                <TableRow 
                  key={session._id}
                  session={session}
                  isExpanded={expandedSession === session._id}
                  toggleExpand={() => toggleExpandSession(session._id)}
                  handleOpenDialog={() => handleOpenDialog(session._id)}
                  acceptSession={() => acceptSession(session._id)}
                  isAccepting={isAccepting}
                  isRejecting={isRejecting}
                  navigateToDetails={() => navigateToDetails(session._id)}
                  index={index}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <EmptyState searchQuery={searchQuery} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface TableRowProps {
  session: any;
  isExpanded: boolean;
  toggleExpand: () => void;
  handleOpenDialog: () => void;
  acceptSession: () => void;
  isAccepting: boolean;
  isRejecting: boolean;
  navigateToDetails: () => void;
  index: number;
}

const TableRow: React.FC<TableRowProps> = ({
  session,
  isExpanded,
  toggleExpand,
  handleOpenDialog,
  acceptSession,
  isAccepting,
  isRejecting,
  navigateToDetails,
  index
}) => {
  return (
    <React.Fragment>
      <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={cn(
          "transition-all duration-300 cursor-default",
          isExpanded 
            ? "bg-gradient-to-r from-zinc-900/60 via-black/70 to-zinc-900/60 backdrop-blur-xl" 
            : "hover:bg-gradient-to-r hover:from-zinc-900/40 hover:to-black/50"
        )}
      >
        <td className="py-5 px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={cn(
                "absolute inset-0 rounded-full blur-md -z-10 opacity-70",
                session.status === 'pending' ? "bg-gradient-to-br from-amber-800/20 to-amber-600/10" :
                session.status === 'approved' ? "bg-gradient-to-br from-emerald-800/20 to-emerald-600/10" :
                session.status === 'scheduled' ? "bg-gradient-to-br from-blue-800/20 to-blue-600/10" :
                "bg-gradient-to-br from-rose-800/20 to-rose-600/10"
              )} />
              <Avatar className="w-11 h-11 rounded-full border border-white/10 shadow-lg">
                <AvatarImage 
                  src={session.userId.profilePicture || `https://ui-avatars.com/api/?name=${session.userId.username}&background=1e1e24&color=9d9daf`}
                  alt={session.userId.username} 
                />
                <AvatarFallback className="bg-gradient-to-br from-zinc-800/80 to-black/80 text-zinc-300 font-medium">
                  {session.userId.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <h3 className="font-semibold text-white text-base transition-colors">
                {session.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-white/30 to-white/10"></span>
                {session.userId.username}
              </p>
            </div>
          </div>
        </td>
        
        <td className="py-5 px-6 hidden md:table-cell">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/80">
              <div className="p-1 rounded-xl bg-gradient-to-br from-zinc-800/60 to-black/60 border border-white/5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <span>{format(new Date(session.sessionDate), 'dd MMM yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <div className="p-1 rounded-xl bg-gradient-to-br from-zinc-800/60 to-black/60 border border-white/5">
                <Clock className="w-3 h-3 text-zinc-400" />
              </div>
              <span className="text-zinc-500">{format(new Date(session.startTime), 'hh:mm a')} ({session.duration} min)</span>
            </div>
          </div>
        </td>
        
        <td className="py-5 px-6 hidden lg:table-cell">
          <div className="flex flex-wrap gap-1.5 max-w-[240px]">
            {session.topics.slice(0, 2).map((topic: any, i: any) => (
              <Badge 
                key={i} 
                className="bg-gradient-to-r from-zinc-800/60 to-black/60 border-white/5 text-white/80 text-xs py-1 px-2.5 font-medium rounded-full"
              >
                {topic}
              </Badge>
            ))}
            {session.topics.length > 2 && (
              <Badge 
                className="bg-gradient-to-r from-zinc-900/40 to-black/40 text-white/60 text-xs py-1 px-2.5 rounded-full border-white/5"
              >
                +{session.topics.length - 2}
              </Badge>
            )}
          </div>
        </td>
        
        <td className="py-5 px-6">
          <StatusBadge status={session.status} />
        </td>
        
        <td className="py-5 px-6 text-right">
          <div className="flex items-center justify-end gap-2">
            <ActionButtons 
              status={session.status}
              viewDetails={navigateToDetails}
              acceptSession={acceptSession}
              handleOpenDialog={handleOpenDialog}
              toggleExpand={toggleExpand}
              isExpanded={isExpanded}
              isAccepting={isAccepting}
              isRejecting={isRejecting}
            />
          </div>
        </td>
      </motion.tr>
      
      <AnimatePresence>
        {isExpanded && <ExpandedRow session={session} navigateToDetails={navigateToDetails} />}
      </AnimatePresence>
    </React.Fragment>
  );
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isValidStatus = status && ['pending', 'approved', 'rejected', 'scheduled', 'completed','cancelled'].includes(status);
  
  const config = isValidStatus ? statusConfig[status as keyof typeof statusConfig] : {
    color: 'text-gray-400',
    bgColor: 'bg-black/40',
    borderColor: 'border-gray-800/20',
    icon: <Clock className="w-3.5 h-3.5 text-gray-400" />
  };

  return (
  <div className={cn(
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
    "bg-gradient-to-r from-black/60 to-zinc-900/40",
    "border backdrop-blur-lg shadow-lg transition-all duration-300",
      isValidStatus 
        ? (status === 'pending' ? "border-amber-500/20 shadow-amber-900/10" : 
    status === 'approved' ? "border-emerald-500/20 shadow-emerald-900/10" : 
    status === 'rejected' ? "border-rose-500/20 shadow-rose-900/10" : 
           "border-blue-500/20 shadow-blue-900/10")
        : "border-gray-500/20 shadow-gray-900/10",
    status === 'pending' && "animate-pulse"
  )}>
      {config.icon}
      <span className={config.color}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  </div>
);
};

interface ActionButtonsProps {
  status: 'pending' | 'approved' | 'rejected' | 'scheduled';
  viewDetails: () => void;
  acceptSession: () => void;
  handleOpenDialog: () => void;
  toggleExpand: () => void;
  isExpanded: boolean;
  isAccepting: boolean;
  isRejecting: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  status, 
  viewDetails,
  acceptSession,
  handleOpenDialog,
  toggleExpand,
  isExpanded,
  isAccepting,
  isRejecting
}) => (
  <div className="flex items-center gap-2 bg-gradient-to-r from-zinc-900/60 to-black/60 py-1.5 px-2 rounded-full border border-white/5 backdrop-blur-lg shadow-lg">
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 rounded-full bg-gradient-to-br from-zinc-800/70 to-black/70 border-white/10 hover:bg-gradient-to-br hover:from-zinc-700/70 hover:to-zinc-900/70 backdrop-blur-lg transition-all duration-200"
          onClick={viewDetails}
        >
          <Eye className="w-3.5 h-3.5 text-white/70" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-gradient-to-br from-zinc-800/90 to-black/90 border-white/10 backdrop-blur-lg">
        View Details
      </TooltipContent>
    </Tooltip>

    {status === 'pending' && (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-gradient-to-br from-zinc-800/70 to-black/70 border-emerald-500/20 hover:bg-gradient-to-br hover:from-emerald-950/60 hover:to-emerald-900/40 backdrop-blur-lg transition-all duration-200"
              onClick={acceptSession}
              disabled={isAccepting}
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gradient-to-br from-zinc-800/90 to-black/90 border-white/10 backdrop-blur-lg">
            Accept Request
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              className="h-8 w-8 p-0 rounded-full bg-gradient-to-br from-zinc-800/70 to-black/70 border-rose-500/20 hover:bg-gradient-to-br hover:from-rose-950/60 hover:to-rose-900/40 backdrop-blur-lg transition-all duration-200"
              onClick={handleOpenDialog}
              disabled={isRejecting}
            >
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gradient-to-br from-zinc-800/90 to-black/90 border-white/10 backdrop-blur-lg">
            Decline Request
          </TooltipContent>
        </Tooltip>
      </>
    )}
    
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={cn(
            "h-8 w-8 p-0 rounded-full transition-all duration-200",
            isExpanded 
              ? "bg-gradient-to-br from-zinc-800/70 to-black/80 border-white/10 text-white/80" 
              : "bg-gradient-to-br from-zinc-800/70 to-black/80 border-white/10 hover:bg-gradient-to-br hover:from-zinc-700/70 hover:to-zinc-900/70 text-white/70"
          )}
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-gradient-to-br from-zinc-800/90 to-black/90 border-white/10 backdrop-blur-lg">
        {isExpanded ? "Hide Details" : "Show Details"}
      </TooltipContent>
    </Tooltip>
  </div>
);

const ExpandedRow = ({ session, navigateToDetails }: { session: any; navigateToDetails: () => void }) => (
  <motion.tr
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.3 }}
  >
    <td colSpan={5} className="p-0">
      <div className="bg-gradient-to-br from-zinc-900/60 via-black/70 to-zinc-900/60 border-t border-white/5 p-6 space-y-5 backdrop-blur-xl shadow-inner shadow-black/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:hidden space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">Date & Time</h4>
              <div className="flex items-center gap-3 text-white p-3 bg-gradient-to-br from-zinc-900/40 to-black/60 rounded-xl border border-white/5 backdrop-blur-lg shadow-lg">
                <div className="p-2 rounded-xl bg-gradient-to-br from-zinc-800/60 to-black/80 border border-white/10">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                </div>
                <span>{format(new Date(session.sessionDate), 'dd MMM yyyy')}, {format(new Date(session.startTime), 'hh:mm a')}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">Duration</h4>
              <div className="flex items-center gap-3 text-white p-3 bg-gradient-to-br from-zinc-900/40 to-black/60 rounded-xl border border-white/5 backdrop-blur-lg shadow-lg">
                <div className="p-2 rounded-xl bg-gradient-to-br from-zinc-800/60 to-black/80 border border-white/10">
                  <Clock className="w-4 h-4 text-zinc-400" />
                </div>
                <span>{session.duration} minutes</span>
              </div>
            </div>
          </div>
          
          <div className="lg:hidden space-y-2">
            <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">Topics</h4>
            <div className="flex flex-wrap gap-1.5 mt-1 p-3 bg-gradient-to-br from-zinc-900/40 to-black/60 rounded-xl border border-white/5 backdrop-blur-lg shadow-lg">
              {session.topics.map((topic: string, i: any) => (
                <Badge 
                  key={i} 
                  className="bg-gradient-to-br from-zinc-800/60 to-black/80 border-white/10 text-white/80 text-xs"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-2">
            <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">Description</h4>
            <div className="bg-gradient-to-br from-zinc-900/40 to-black/60 border border-white/10 rounded-xl p-4 backdrop-blur-lg shadow-lg">
              <p className="text-white/80 leading-relaxed text-sm">{session.description}</p>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">Payment</h4>
              <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900/40 to-black/60 border border-emerald-500/20 rounded-xl p-4 backdrop-blur-lg shadow-lg">
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-black/60 to-emerald-950/30 border border-emerald-500/20 shadow-lg">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">${session.price}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl blur-lg" />
                <Button
                  onClick={navigateToDetails}
                  className="w-full h-11 gap-2 rounded-xl bg-gradient-to-r from-zinc-900/80 via-black/80 to-zinc-900/80 border border-white/10 hover:border-white/20 text-white shadow-lg transition-all duration-300 backdrop-blur-lg"
                >
                  View Full Details
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </td>
  </motion.tr>
);

const EmptyState = ({ searchQuery }: { searchQuery: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="py-20 flex flex-col items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="relative w-20 h-20 mb-6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/10 rounded-full blur-xl" />
      <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-zinc-900/70 via-black/70 to-zinc-900/70 border border-white/10 backdrop-blur-xl shadow-xl">
        <Search className="w-8 h-8 text-zinc-400" />
      </div>
    </motion.div>
    
    <motion.h3
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-xl font-semibold text-white mb-3"
    >
      No session requests found
    </motion.h3>
    
    <motion.p
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-white/60 text-center max-w-md px-6"
    >
      {searchQuery 
        ? "Try adjusting your search criteria or clear filters" 
        : "You don't have any session requests with this status yet"}
    </motion.p>
    
    {searchQuery && (
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/10 rounded-full blur-lg" />
          <Button 
            variant="outline" 
            className="relative h-10 px-5 rounded-full bg-gradient-to-r from-zinc-900/60 to-black/70 border-white/10 hover:bg-gradient-to-r hover:from-zinc-800/60 hover:to-black/60 text-white shadow-lg backdrop-blur-lg"
          >
            Clear filters
          </Button>
        </div>
      </motion.div>
    )}
  </motion.div>
);
