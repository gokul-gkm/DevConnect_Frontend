import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Title, Text } from '@tremor/react';
import { Calendar, Clock, Search } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import { ColumnDef } from '@tanstack/react-table';
import { useAdminSessions } from '@/hooks/admin/useAdminSessions';
import { cn } from '@/lib/utils';

interface Session {
  _id: string;
  title: string;
  description: string;
  sessionDate: string;
  startTime: string;
  duration: number;
  price: number;
  status: string;
  paymentStatus: string;
  formattedDate: string;
  formattedTime: string;
  user: {
    _id: string;
    username: string;
    email: string;
    profilePicture: string;
  };
  developer: {
    _id: string;
    username: string;
    email: string;
    profilePicture: string;
  };
}

const AdminSessionsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [upcomingPagination, setUpcomingPagination] = useState({
    page: 1,
    limit: 10
  });
  const [historyPagination, setHistoryPagination] = useState({
    page: 1,
    limit: 10
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { 
    data: upcomingSessions, 
    isLoading: isLoadingUpcoming 
  } = useAdminSessions({
    page: upcomingPagination.page,
    limit: upcomingPagination.limit,
    status: ['pending', 'approved', 'scheduled'],
    search: debouncedSearch
  });

  const { 
    data: sessionHistory, 
    isLoading: isLoadingHistory 
  } = useAdminSessions({
    page: historyPagination.page,
    limit: historyPagination.limit,
    status: ['completed', 'rejected', 'cancelled'],
    search: debouncedSearch
  });

  const updateUpcomingParams = (params: { page?: number; limit?: number }) => {
    setUpcomingPagination(prev => ({
      ...prev,
      ...params
    }));
  };

  const updateHistoryParams = (params: { page?: number; limit?: number }) => {
    setHistoryPagination(prev => ({
      ...prev,
      ...params
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500 border border-yellow-500/20">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-500 border border-blue-500/20">Approved</span>;
      case 'scheduled':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500 border border-green-500/20">Scheduled</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500 border border-green-500/20">Completed</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-500 border border-red-500/20">Rejected</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-500 border border-gray-500/20">Cancelled</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-500 border border-gray-500/20">{status}</span>;
    }
  };

  const columns: ColumnDef<Session>[] = [
    
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full overflow-hidden mr-3 border border-purple-500/20 shadow-lg shadow-purple-500/10">
              <img 
                src={session.user.profilePicture || '/assets/default-avatar.png'} 
                alt={session.user.username} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/default-avatar.png';
                }}
              />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{session.user.username}</div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'developer',
      header: 'Developer',
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full overflow-hidden mr-3 border border-purple-500/20 shadow-lg shadow-purple-500/10">
              <img 
                src={session.developer.profilePicture || '/assets/default-avatar.png'} 
                alt={session.developer.username} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/default-avatar.png';
                }}
              />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{session.developer.username}</div>
            </div>
          </div>
        );
      }
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
          const session = row.original;
          return (
            <div className="w-48 max-w-[12rem]">
              <span className="text-sm font-medium text-white truncate block overflow-hidden whitespace-nowrap text-ellipsis" title={session.title}>
                {session.title}
              </span>
            </div>
          );
        }
      },
    {
      accessorKey: 'sessionDate',
      header: 'Date & Time',
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-sm text-slate-300">{session.formattedDate}</span>
            </div>
            <div className="flex items-center mt-1">
              <Clock className="h-3.5 w-3.5 text-purple-400/80 mr-2" />
              <span className="text-xs text-slate-400">{session.formattedTime}</span>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => {
        const session = row.original;
        return <span className="text-sm text-slate-300">{session.duration} min</span>;
      }
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const session = row.original;
        return <span className="text-sm text-slate-300">₹ {session.price}</span>;
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const session = row.original;
        return getStatusBadge(session.status);
      }
    }
  ];

  const tabVariants = {
    inactive: { opacity: 0, y: 10 },
    active: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/60 p-8 rounded-2xl border border-slate-800/50 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Sessions Management
            </h1>
            <p className="text-slate-400 mt-1">
              Monitor and manage all platform sessions
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Sessions Overview
            </span>
          </div>
        </motion.div>

        <div className="custom-card-wrapper relative rounded-xl overflow-hidden border border-slate-700">
          <Card className="bg-slate-900/60 shadow-xl rounded-xl p-0 overflow-hidden border-0">
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveTab(0)}
                className={cn(
                  "flex-1 py-4 px-6 text-center relative transition-all duration-300",
                  activeTab === 0 
                    ? "text-white font-medium" 
                    : "text-slate-400 hover:text-slate-300"
                )}
              >
                Upcoming Sessions
                {activeTab === 0 && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={cn(
                  "flex-1 py-4 px-6 text-center relative transition-all duration-300",
                  activeTab === 1 
                    ? "text-white font-medium" 
                    : "text-slate-400 hover:text-slate-300"
                )}
              >
                Session History
                {activeTab === 1 && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"
                  />
                )}
              </button>
            </div>

            <div className="p-4 border-b border-slate-800/50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 0 ? (
                <motion.div
                  key="upcoming"
                  initial="inactive"
                  animate="active"
                  exit="exit"
                  variants={tabVariants}
                  className="p-4"
                >
                  <div className="mb-4 flex justify-between items-center">
                    <div>
                      <Title className="text-white text-lg font-semibold">Upcoming Sessions</Title>
                      <Text className="text-slate-400 text-sm">Schedule, pending, and approved sessions</Text>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-slate-800/40 p-2 rounded-xl border border-slate-700/30">
                      <span className="text-xs text-slate-300 font-medium">Status: </span>
                      {getStatusBadge('pending')}
                      {getStatusBadge('approved')}
                      {getStatusBadge('scheduled')}
                    </div>
                  </div>
                  
                  <AdminTable
                    data={upcomingSessions?.sessions || []}
                    columns={columns}
                    pagination={upcomingSessions?.pagination}
                    updateParams={updateUpcomingParams}
                    isLoading={isLoadingUpcoming}
                    emptyMessage="No upcoming sessions found"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="history"
                  initial="inactive"
                  animate="active"
                  exit="exit"
                  variants={tabVariants}
                  className="p-4"
                >
                  <div className="mb-4 flex justify-between items-center">
                    <div>
                      <Title className="text-white text-lg font-semibold">Session History</Title>
                      <Text className="text-slate-400 text-sm">Completed, rejected, and cancelled sessions</Text>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-slate-800/40 p-2 rounded-xl border border-slate-700/30">
                      <span className="text-xs text-slate-300 font-medium">Status: </span>
                      {getStatusBadge('completed')}
                      {getStatusBadge('rejected')}
                      {getStatusBadge('cancelled')}
                    </div>
                  </div>
                  
                  <AdminTable
                    data={sessionHistory?.sessions || []}
                    columns={columns}
                    pagination={sessionHistory?.pagination}
                    updateParams={updateHistoryParams}
                    isLoading={isLoadingHistory}
                    emptyMessage="No session history found"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSessionsPage;
