import { useState, useEffect, useCallback, useRef } from 'react';
import { socketService } from '@/service/socket/socketService';
import { toast } from 'react-hot-toast';
import NotificationApi from '@/service/Api/NotificationApi';
import { Calendar } from 'lucide-react';

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

export const useNotifications = (isAuthenticated: boolean) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const notificationsRef = useRef<Notification[]>([]);
    


  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const fetchNotifications = useCallback(async () => {
    try {
      if (!isAuthenticated) return; 
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
    let isMounted = true;
    
    const handleNewNotification = (data: any) => {
      console.log('🎉New notification received:', data);
      if (data && data.notification) {

        console.log('New notification received:', data.notification);
        setNotifications(prev => [data.notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleSessionUpdate = (data: any) => {
      console.log('Session update received:', data);
      if (data.notification) {
        console.log('Handling notification format');
        setNotifications(prev => {
          const newNotifications = [data.notification, ...prev];
          console.log('Updated notifications with notification:', newNotifications);
          return newNotifications;
        });
        setUnreadCount(prev => prev + 1);
      } else if (data.sessionId && data.status) {
        console.log('Handling session status update');
        const statusNotification: Notification = {
          id: data.sessionId,
          title: 'Session Status Updated',
          message: `Session has been ${data.status}`,
          type: 'session' as const,
          isRead: false,
          timestamp: new Date().toISOString(),
          sender: data.sender
        };
        
        setNotifications(prev => {
          const newNotifications = [statusNotification, ...prev];
          console.log('Updated notifications with status:', newNotifications);
          return newNotifications;
        });
        setUnreadCount(prev => prev + 1);
        
        toast.custom((t) => (
          <div className={`
            ${t.visible ? 'animate-enter' : 'animate-leave'}
            max-w-md w-full bg-black/80 backdrop-blur-xl shadow-lg rounded-2xl pointer-events-auto 
            flex p-4 border border-white/10 transition-all duration-500 ease-in-out
          `}>
            <div className="w-full flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/50 text-emerald-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{statusNotification.title}</h3>
                <p className="text-sm text-gray-300 mt-1 line-clamp-2">{statusNotification.message}</p>
              </div>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-right',
        });
      }
    };

    const setupSocketListeners = async () => {
      try {
        if (!socketService.isConnected()) {
          console.log('Socket not connected, waiting for connection...');
          await socketService.waitForConnection();
        }
        
        console.log('Setting up notification socket listeners');
        
        socketService.off('notification:new', handleNewNotification);
        socketService.off('session:updated', handleSessionUpdate);
        
        socketService.on('notification:new', (data) => {
          console.log('Received notification:new event:', data);
          if (isMounted) {
            handleNewNotification(data);
          }
        });
        
        socketService.on('session:updated', (data) => {
          console.log('Received session:updated event:', data);
          if (isMounted) {
            handleSessionUpdate(data);
          }
        });
        
        await fetchNotifications();
      } catch (error) {
        console.error('Error setting up socket listeners:', error);
      }
    };

    setupSocketListeners();

    return () => {
      isMounted = false;
      socketService.off('notification:new', handleNewNotification);
      socketService.off('session:updated', handleSessionUpdate);
    };
  }, [fetchNotifications]);

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