import { useState, useEffect, useCallback, useRef } from 'react';
import { socketService } from '@/service/socket/socketService';
import { toast } from 'react-hot-toast';
import NotificationApi from '@/service/Api/NotificationApi';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'session' | 'update' | 'alert';
  isRead: boolean;
  timestamp: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const notificationsRef = useRef<Notification[]>([]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await NotificationApi.getNotifications();
      
      if (response.success && response.data) {
        const mappedNotifications = response.data.map((notif: any) => ({
          id: notif._id,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          isRead: notif.isRead,
          timestamp: notif.createdAt,
          sender: notif.sender ? {
            name: notif.sender.username,
            avatar: notif.sender.profilePicture
          } : undefined
        }));
        
        setNotifications(mappedNotifications);
      }
      
      const countResponse = await NotificationApi.getUnreadCount();
      if (countResponse.success && countResponse.data) {
        setUnreadCount(countResponse.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const notification = notificationsRef.current.find(n => n.id === id);
      const wasUnread = notification && !notification.isRead;
      
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));

      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      socketService.markNotificationAsRead(id);
      
      await NotificationApi.markAsRead(id);
      
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      fetchNotifications();
      return false;
    }
  }, [fetchNotifications]); 

  const markAllAsRead = useCallback(async () => {
    try {

      const unreadNotifications = notificationsRef.current.filter(n => !n.isRead).length;
      console.log(`Marking all ${unreadNotifications} notifications as read`);
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      
      socketService.markAllNotificationsAsRead();
    
      await NotificationApi.markAllAsRead();
      
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      fetchNotifications();
      return false;
    }
  }, [fetchNotifications]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      const notification = notificationsRef.current.find(n => n.id === id);
      const wasUnread = notification && !notification.isRead;

      setNotifications(prev => prev.filter(n => n.id !== id));
      
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      await NotificationApi.deleteNotification(id);
      
      toast.success('Notification deleted', {
        style: {
          background: '#0f172a',
          border: '1px solid #f43f5e40',
          color: '#ffffff'
        }
      });
      
      return true;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      fetchNotifications();
      return false;
    }
  }, [fetchNotifications]);

  useEffect(() => {
    const handleNewNotification = (data: any) => {
      if (data && data.notification) {
        console.log('New notification received:', data.notification);

        setNotifications(prev => [data.notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        toast.custom((t) => (
          <div className={`
            ${t.visible ? 'animate-enter' : 'animate-leave'}
            max-w-md w-full bg-black/80 backdrop-blur-xl shadow-lg rounded-2xl pointer-events-auto 
            flex p-4 border border-white/10 transition-all duration-500 ease-in-out
          `}>
            <div className="w-full flex items-start gap-3">
              <div className={`
                p-2 rounded-xl 
                ${data.notification.type === 'message' ? 'bg-blue-950/50 text-blue-400' : 
                  data.notification.type === 'session' ? 'bg-emerald-950/50 text-emerald-400' : 
                  data.notification.type === 'update' ? 'bg-amber-950/50 text-amber-400' : 
                  'bg-rose-950/50 text-rose-400'}
              `}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {data.notification.type === 'message' ? (
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  ) : data.notification.type === 'session' ? (
                    <>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </>
                  ) : data.notification.type === 'update' ? (
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </>
                  )}
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{data.notification.title}</h3>
                <p className="text-sm text-gray-300 mt-1 line-clamp-2">{data.notification.message}</p>
              </div>
              <button 
                onClick={() => {
                  toast.dismiss(t.id);
                  markAsRead(data.notification.id);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-right',
        });
      }
    };

    const handleUnreadCountUpdate = (data: any) => {
      if (data && typeof data.count === 'number') {
        setUnreadCount(data.count);
      }
    };

    const handleNotificationRead = (data: any) => {
      if (data && data.success && data.id) {
        setNotifications(prev => prev.map(n => 
          n.id === data.id ? { ...n, isRead: true } : n
        ));
      }
    };
    
    const handleAllNotificationsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    };

    if (socketService.isConnected()) {
      socketService.onNewNotification(handleNewNotification);
      socketService.onUnreadCountUpdate(handleUnreadCountUpdate);
      socketService.onNotificationRead(handleNotificationRead);
      socketService.onAllNotificationsRead(handleAllNotificationsRead);
    }

    fetchNotifications();

    return () => {
      if (socketService.isConnected()) {
        
      }
    };
  }, [fetchNotifications, markAsRead]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications
  };
};