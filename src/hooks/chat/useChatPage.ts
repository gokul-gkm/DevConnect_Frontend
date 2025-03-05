import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { setSelectedChat } from '@/redux/slices/chatSlice';
import { useChat } from '@/hooks/chat/useChat';

export const useChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { chats, loading, refreshChats } = useChat();
  
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
    refreshChats();
  }, []);
  
  return {
    loading,
    currentChat: currentChat()
  };
};