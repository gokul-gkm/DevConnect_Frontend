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

export const useNotifications = (isAuthenticated: boolean) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const notificationsRef = useRef<Notification[]>([]);
  const mountedRef = useRef(true);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });

  const [totalsByType, setTotalsByType] = useState({
    message: 0,
    session: 0,
    update: 0,
    alert: 0
  });

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  /* =========================
     FETCH
  ========================= */

  const fetchNotifications = useCallback(async (opts?: { page?: number; limit?: number }) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);

      const page = opts?.page ?? pagination.page;
      const limit = opts?.limit ?? pagination.limit;

      const res = await NotificationApi.getNotifications({ page, limit });

      if (res.success) {
        const mapped: Notification[] = (res.data || []).map((n: any) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          type: n.type,
          isRead: n.isRead,
          timestamp: n.createdAt,
          sender: n.sender
            ? { name: n.sender.username, avatar: n.sender.profilePicture }
            : undefined
        }));

        setNotifications(mapped);
        if (res.pagination) setPagination(res.pagination);
        if (res.totalsByType) setTotalsByType(res.totalsByType);
      }

      const unreadRes = await NotificationApi.getUnreadCount();
      if (unreadRes.success) {
        setUnreadCount(unreadRes.data.count);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, pagination.page, pagination.limit]);

  /* =========================
     MARK READ
  ========================= */

  const markAsRead = useCallback(async (id: string) => {
    const notif = notificationsRef.current.find(n => n.id === id);
    if (!notif || notif.isRead) return true;

    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount(c => Math.max(0, c - 1));

    socketService.markNotificationRead(id);
    await NotificationApi.markAsRead(id);

    return true;
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);

    socketService.markAllNotificationsRead();
    await NotificationApi.markAllAsRead();

    return true;
  }, []);

  /* =========================
     DELETE
  ========================= */

  const deleteNotification = useCallback(async (id: string) => {
    const notif = notificationsRef.current.find(n => n.id === id);
    const wasUnread = notif && !notif.isRead;

    setNotifications(prev => prev.filter(n => n.id !== id));
    if (wasUnread) setUnreadCount(c => Math.max(0, c - 1));

    await NotificationApi.deleteNotification(id);

    toast.success('Notification deleted');
    return true;
  }, []);

  /* =========================
     SOCKET LISTENERS
  ========================= */


  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      if (!socketService.isConnected()) {
        await socketService.waitForConnection();
      }

      await fetchNotifications();
    };

    init();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchNotifications]);

  /* =========================
     PAGINATION
  ========================= */

  const updateParams = useCallback(
    async (params: { page?: number; limit?: number }) => {
      await fetchNotifications({
        page: params.page ?? pagination.page,
        limit: params.limit ?? pagination.limit
      });
    },
    [pagination.page, pagination.limit, fetchNotifications]
  );

  const addNotification = useCallback((n: any) => {
  setNotifications(prev => [
    {
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      isRead: false,
      timestamp: n.timestamp,
      sender: n.sender
    },
    ...prev
  ]);

  setUnreadCount(c => c + 1);
}, []);


  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications,
    pagination,
    updateParams,
    totalsByType,
    addNotification
  };
};
