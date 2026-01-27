import { useState, useEffect, useCallback } from 'react';
import { socketService } from '@/service/socket/socketService';
import { ChatApi } from '@/service/Api/ChatApi';
import { useAppSelector } from '@/hooks/useAppSelector';

export const useUnreadMessages = (isAuthenticated: boolean) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { _id } = useAppSelector((state) => state.user);
  // const { selectedChat } = useAppSelector((state) => state.chat);

  const fetchUnreadCount = useCallback(async () => {
    try {
      if (!isAuthenticated || !_id) return;
      
      setIsLoading(true);
      const response = await ChatApi.getUserChats();
      
      if (response.success && response.chats) {
        const totalUnread = response.chats.reduce(
          (sum: number, chat: any) => sum + (chat.userUnreadCount || 0),
          0
        );
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, _id]);

  useEffect(() => {
    let isMounted = true;

    const setupSocketListeners = async () => {
      try {
        if (!isAuthenticated) return;

        await fetchUnreadCount();

        if (!socketService.isConnected()) {
          await socketService.waitForConnection();
        }

        const handleUnreadCountUpdate = (data: { count: number }) => {
          if (isMounted && data.count !== undefined) {
            console.log('Received chat:unread-count event:', data.count);
            setUnreadCount(data.count);
          }
        };

        socketService.on('chat:unread-count', handleUnreadCountUpdate);

        // socketService.onMessagesRead((_data: any) => {
        //   if (isMounted) {
        //     fetchUnreadCount();
        //   }
        // });

      } catch (error) {
        console.error('Error setting up socket listeners:', error);
      }
    };

    setupSocketListeners();

    return () => {
      isMounted = false;
      socketService.off('chat:unread-count', () => {});
    };
  }, [fetchUnreadCount, isAuthenticated]);

  return {
    unreadCount,
    isLoading,
    refresh: fetchUnreadCount
  };
};
