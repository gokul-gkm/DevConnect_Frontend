import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

import { 
  Bell,
  Search, 
  Check,
  Trash2,
  Filter,
  Mail,
  MailOpen,
  Calendar,
  User,
  Zap,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/shadcn-button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatsCard } from '@/components/ui/StatsCard';
import { StatsCardGrid } from '@/components/ui/StatsCardGrid';
import { useNotificationContext } from '@/contexts/NotificationContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Pagination from '@/components/ui/Pagination';

type NotificationType = 'message' | 'session' | 'update' | 'alert';

const notificationTypeConfig = {
  message: {
    icon: MessageSquare,
    gradient: 'from-blue-950 to-black',
    badge: 'bg-blue-900/20 text-blue-400 border-blue-400/30',
  },
  session: {
    icon: Calendar,
    gradient: 'from-emerald-950 to-black',
    badge: 'bg-emerald-900/20 text-emerald-400 border-emerald-400/30',
  },
  update: {
    icon: Zap,
    gradient: 'from-amber-950 to-black',
    badge: 'bg-amber-900/20 text-amber-400 border-amber-400/30',
  },
  alert: {
    icon: AlertCircle,
    gradient: 'from-rose-950 to-black',
    badge: 'bg-rose-900/20 text-rose-400 border-rose-400/30',
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    x: -300,
    transition: { duration: 0.3 }
  }
};

export default function DeveloperNotificationList() {
  
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification, pagination, updateParams } = useNotificationContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesReadStatus = !showUnreadOnly || !notification.isRead;
    
    return matchesSearch && matchesFilter && matchesReadStatus;
  });

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
  };

  const stats = [
    {
      label: 'All Notifications',
      value: pagination.totalItems,
      icon: Bell,
      gradient: 'from-gray-900 to-black',
    },
    {
      label: 'Unread',
      value: unreadCount,
      icon: Mail,
      gradient: 'from-blue-950 to-black',
    },
    {
      label: 'Messages',
      value: notifications.filter(n => n.type === 'message').length,
      icon: MessageSquare,
      gradient: notificationTypeConfig.message.gradient,
    },
    {
      label: 'Sessions',
      value: notifications.filter(n => n.type === 'session').length,
      icon: Calendar,
      gradient: notificationTypeConfig.session.gradient,
    },
  ];

  if (isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        text="Loading notifications..."
        color="white"
        bgColor="dark"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black/80 space-y-6 px-4">

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/5 -mx-4 px-4 py-6 mt-20"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="space-y-1">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
            >
              Notifications
            </motion.h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent blur-xl opacity-30 rounded-2xl" />
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-2xl backdrop-blur-xl bg-black/40 border-white/10 hover:border-white/20 focus:border-white/30 transition-colors"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-12 gap-2 rounded-2xl backdrop-blur-xl bg-black/40 border-white/10 hover:border-white/20 text-white"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900/90 backdrop-blur-xl border-white/10 text-white">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className={cn("cursor-pointer", filter === 'all' && "bg-white/10")}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={cn("cursor-pointer", filter === 'message' && "bg-white/10")}
                    onClick={() => setFilter('message')}
                  >
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-400" />
                    Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={cn("cursor-pointer", filter === 'session' && "bg-white/10")}
                    onClick={() => setFilter('session')}
                  >
                    <Calendar className="w-4 h-4 mr-2 text-emerald-400" />
                    Sessions
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={cn("cursor-pointer", filter === 'update' && "bg-white/10")}
                    onClick={() => setFilter('update')}
                  >
                    <Zap className="w-4 h-4 mr-2 text-amber-400" />
                    Updates
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={cn("cursor-pointer", filter === 'alert' && "bg-white/10")}
                    onClick={() => setFilter('alert')}
                  >
                    <AlertCircle className="w-4 h-4 mr-2 text-rose-400" />
                    Alerts
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className={cn("cursor-pointer", showUnreadOnly && "bg-white/10")}
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  >
                    {showUnreadOnly ? (
                      <>
                        <MailOpen className="w-4 h-4 mr-2" />
                        Show All
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Show Unread Only
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                className="h-12 gap-2 rounded-2xl backdrop-blur-xl bg-black/40 border-white/10 hover:border-white/20 text-white"
                onClick={handleMarkAllAsRead}
              >
                <Check className="w-4 h-4" />
                Mark All Read
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <StatsCardGrid>
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            gradient={stat.gradient}
            delay={index * 0.1}
          />
        ))}
      </StatsCardGrid>

      <div className="max-w-5xl mx-auto grid gap-5">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const NotifIcon = notificationTypeConfig[notification.type].icon;
              return (
                <motion.div
                  key={notification.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border p-5",
                    "bg-gradient-to-br from-black to-gray-900/50",
                    "border-white/5 hover:border-white/10 transition-all duration-300",
                    "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50",
                    !notification.isRead && "bg-gradient-to-br from-blue-950/20 to-black"
                  )}
                >
                  <div className="flex gap-4">
                    <div className={cn(
                      "p-4 h-16 w-16 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-br",
                      notificationTypeConfig[notification.type].gradient,
                      "border border-white/10",
                      "shrink-0"
                    )}>
                      <NotifIcon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            {notification.title}
                            {!notification.isRead && (
                              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            )}
                          </h3>
                          
                          {notification.sender && (
                            <div className="flex items-center gap-1 mt-1 text-gray-400">
                              <User className="w-3 h-3" />
                              <span className="text-xs">{notification.sender.name}</span>
                            </div>
                          )}
                        </div>
                        
                        <Badge
                          className={cn(
                            "px-3 py-1 rounded-xl border font-medium backdrop-blur-xl w-fit",
                            notificationTypeConfig[notification.type].badge
                          )}
                        >
                          {notification.type}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-300 text-sm mt-1 mb-3">
                        {notification.message}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <span className="text-xs text-gray-400">
                          {format(new Date(notification.timestamp), 'MMM d, h:mm a')}
                        </span>
                        
                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 rounded-xl bg-blue-950/20 hover:bg-blue-900/30 text-blue-400 border-blue-400/20"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Mark as Read
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 rounded-xl bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 border-rose-400/20"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 space-y-4"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 mb-6">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">
                No notifications found
              </h3>
              <p className="text-gray-400">
                {showUnreadOnly 
                  ? "You've read all your notifications" 
                  : "Try adjusting your search or filter criteria"}
              </p>
              {showUnreadOnly && (
                <Button
                  className="mt-4 bg-white/10 hover:bg-white/20 text-white border-white/10"
                  onClick={() => setShowUnreadOnly(false)}
                >
                  <MailOpen className="w-4 h-4 mr-2" />
                  Show All Notifications
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="max-w-5xl mx-auto">
        <Pagination pagination={{ currentPage: pagination.page, totalPages: pagination.totalPages }} updateParams={({ page }) => updateParams({ page })} />
      </div>
    </div>
  );
}