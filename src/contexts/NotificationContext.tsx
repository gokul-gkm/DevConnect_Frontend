import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useNotifications, Notification } from '../hooks/notification/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { socketService } from '@/service/socket/socketService';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  pagination: { page: number; limit: number; totalPages: number; totalItems: number };
  updateParams: (params: { page?: number; limit?: number }) => Promise<void>;
  totalsByType: { message: number; session: number; update: number; alert: number };
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const notificationData = useNotifications(isAuthenticated);
  
  useEffect(() => {
    console.log('NotificationContext state changed:', {
      notificationsCount: notificationData.notifications.length,
      unreadCount: notificationData.unreadCount,
      isLoading: notificationData.isLoading
    });
  }, [notificationData]);
  
  useEffect(() => {
  if (!isAuthenticated) return;

  const attach = async () => {
    await socketService.waitForConnection();
    

    console.log("📡 Attaching notification socket listeners");

    socketService.on("notification:new", (event) => {
      console.log("📥 RAW SOCKET EVENT", event);

      const notification = event?.payload?.notification;
      if (!notification) {
        console.warn("⚠️ Invalid notification payload", event);
        return;
      }

      notificationData.addNotification(notification);
       event.ack?.();
    });
  };

  attach();

  return () => {
    socketService.off("notification:new");
  };
}, [isAuthenticated]);

  return (
    <NotificationContext.Provider value={notificationData}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}