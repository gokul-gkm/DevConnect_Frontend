import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useNotifications, Notification } from '../hooks/notification/useNotifications';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notificationData = useNotifications();
  
  useEffect(() => {
    console.log('NotificationContext state changed:', {
      notificationsCount: notificationData.notifications.length,
      unreadCount: notificationData.unreadCount,
      isLoading: notificationData.isLoading
    });
  }, [notificationData]);
  
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