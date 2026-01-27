import { createContext, useContext, ReactNode } from 'react';
import { useUnreadMessages } from '../hooks/chat/useUnreadMessages';
import { useAuth } from '@/hooks/useAuth';

interface UnreadMessagesContextType {
  unreadCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

export function UnreadMessagesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const unreadMessagesData = useUnreadMessages(isAuthenticated);

  return (
    <UnreadMessagesContext.Provider value={unreadMessagesData}>
      {children}
    </UnreadMessagesContext.Provider>
  );
}

export function useUnreadMessagesContext() {
  const context = useContext(UnreadMessagesContext);
  if (context === undefined) {
    throw new Error('useUnreadMessagesContext must be used within an UnreadMessagesProvider');
  }
  return context;
}
