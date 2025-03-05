
import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../useAppSelector';
import { fetchChats, fetchMessages, sendMessage, addMessage, setSelectedChat } from '@/redux/slices/chatSlice';
import { useParams } from 'react-router-dom';
import { socketService } from '@/service/socket/socketService';
import { debounce } from 'lodash';
import { ChatApi } from '@/service/Api/ChatApi';
import { useAuth } from '../useAuth';

export const useDeveloperChat = () => {
    const dispatch = useAppDispatch();
    const { chatId } = useParams();
    const { chats, selectedChat, messages, loading, messageLoading, hasMore, page } = useAppSelector(state => state.chat);
    const [subscribedChats, setSubscribedChats] = useState<Set<string>>(new Set());
    const { token } = useAuth();

    useEffect(() => {
        console.log("Fetching developer chats");
        const fetchDeveloperChats = async () => {
            try {
                await dispatch(fetchChats()).unwrap();
            } catch (error) {
                console.error("Error fetching developer chats:", error);
            }
        };
        
        fetchDeveloperChats();
    }, [dispatch]);

    useEffect(() => {
        if (chatId && chats.length > 0) {
            const chat = chats.find(c => c._id === chatId);
            if (chat) {
                dispatch(setSelectedChat(chat));
            }
        }
    }, [chatId, chats, dispatch]);

    useEffect(() => {
        if (selectedChat) {
            dispatch(fetchMessages({ chatId: selectedChat._id, page: 1 }));

            ChatApi.markMessagesAsRead(selectedChat._id)
                .catch(err => console.error("Error marking messages as read:", err));
        }
    }, [selectedChat, dispatch]);

    useEffect(() => {
        if (!token) return;
        
        socketService.connect(token, 'developer');
        
        const handleNewMessage = (data: any) => {
            console.log("Developer received new message:", data);
            dispatch(addMessage(data));

            if (selectedChat && data.chatId === selectedChat._id) {
                ChatApi.markMessagesAsRead(selectedChat._id)
                    .catch(err => console.error("Error marking messages as read:", err));
            }
        };
        
        socketService.onNewMessage(handleNewMessage);
        
        const handleTypingStart = (data: any) => {
            console.log("Typing started:", data);
        };
        
        const handleTypingStop = (data: any) => {
            console.log("Typing stopped:", data);
        };
        
        socketService.onTypingStart(handleTypingStart);
        socketService.onTypingStop(handleTypingStop);
        
        return () => {
            socketService.cleanup();
        };
    }, [dispatch, selectedChat, token]);

    useEffect(() => {
        if (chats.length > 0) {
            chats.forEach(chat => {
                if (!subscribedChats.has(chat._id)) {
                    console.log("Developer subscribing to chat:", chat._id);
                    socketService.joinChat(chat._id);
                    setSubscribedChats(prev => new Set([...prev, chat._id]));
                }
            });
        }
    }, [chats, subscribedChats]);

    const loadMoreMessages = useCallback(() => {
        if (selectedChat && hasMore && !messageLoading) {
            dispatch(fetchMessages({ chatId: selectedChat._id, page }));
        }
    }, [selectedChat, hasMore, messageLoading, dispatch, page]);

    const handleSendMessage = useCallback((content: string) => {
        if (selectedChat) {
            dispatch(sendMessage({ chatId: selectedChat._id, content }));
        }
    }, [selectedChat, dispatch]);

    const debouncedTypingStart = useRef(
        debounce((chatId: string) => {
            socketService.emitTypingStart(chatId);
        }, 300)
    ).current;

    const debouncedTypingStop = useRef(
        debounce((chatId: string) => {
            socketService.emitTypingStop(chatId);
        }, 1000)
    ).current;

    const handleTyping = useCallback((isTyping: boolean) => {
        if (!selectedChat) return;
        
        if (isTyping) {
            debouncedTypingStart(selectedChat._id);
        } else {
            debouncedTypingStop(selectedChat._id);
        }
    }, [debouncedTypingStart, debouncedTypingStop, selectedChat]);

    return {
        chats,
        selectedChat,
        messages,
        loading,
        messageLoading,
        hasMore,
        loadMoreMessages,
        handleSendMessage,
        handleTyping
    };
};