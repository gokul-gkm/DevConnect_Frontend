import { useEffect, useCallback, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { setSelectedChat } from '@/redux/slices/chatSlice';
import { useChat } from '@/hooks/chat/useChat';

export const useChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { chats, loading, refreshChats } = useChat();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const initialLoadRef = useRef(false);
  
  const currentChat = useCallback(() => {
    if (!chatId || chats.length === 0) return null;
    return chats.find(c => c._id === chatId);
  }, [chatId, chats]);
  
  useEffect(() => {
    const chat = currentChat();
    
    if (chatId && chats.length > 0) {
      if (chat) {
        dispatch(setSelectedChat(chat));
      } else {
        navigate('/chats');
      }
    }
  }, [chatId, chats.length]);
  
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      refreshChats().finally(() => {
        setInitialLoadComplete(true);
      });
    }
  }, [refreshChats]);
  
  const isLoading = loading && !initialLoadComplete;
  
  return {
    loading: isLoading,
    currentChat: currentChat()
  };
};