import { useEffect,  useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../useAppSelector';
import { fetchMessages, sendMessage, addMessage, setSelectedChat, fetchDeveloperChats, updateMessageReadStatus, updateChatWithNewMessage, updateUnreadCount } from '@/redux/slices/chatSlice';
import { useParams } from 'react-router-dom';
import { socketService } from '@/service/socket/socketService';
import { debounce } from 'lodash';
import { ChatApi } from '@/service/Api/ChatApi';
import { useAuth } from '../useAuth';

export const useDeveloperChat = () => {
    const dispatch = useAppDispatch();
    const { chatId } = useParams();
    const { chats, selectedChat, messages, loading, messageLoading, hasMore, page } = useAppSelector(state => state.chat);
    const subscribedChats = useRef<Set<string>>(new Set());
    const { token } = useAuth();
    const initialFetchRef = useRef(false);
    const isSubscribedRef = useRef(true);
    const processingChatSelection = useRef(false);

    const refreshChats = useCallback(async () => {
        try {
            await dispatch(fetchDeveloperChats()).unwrap();
        } catch (error) {
            console.error("Error refreshing developer chats:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        const fetchDeveloperChat = async () => {
            if (!initialFetchRef.current) {
                try {
                    await dispatch(fetchDeveloperChats()).unwrap();
                    initialFetchRef.current = true;
                } catch (error) {
                    console.error("Error fetching developer chats:", error);
                }
            }
        };

        fetchDeveloperChat();

        return () => {
            initialFetchRef.current = false;
            isSubscribedRef.current = false;
        };
    }, []);


    useEffect(() => {
        if (chatId && chats.length > 0 && !processingChatSelection.current) {
            const chat = chats.find(c => c._id === chatId);
            if (chat) {
                processingChatSelection.current = true;
                dispatch(setSelectedChat(chat));
                setTimeout(() => {
                    processingChatSelection.current = false;
                }, 100);
            }
        }
    }, [chatId, chats, dispatch]);

    useEffect(() => {
        if (!selectedChat?._id) return;
        
        dispatch(fetchMessages({ chatId: selectedChat._id, page: 1 }));
        
        ChatApi.markMessagesAsRead(selectedChat._id)
            .then(() => {
                dispatch(updateUnreadCount({
                    chatId: selectedChat._id,
                    recipientType: 'developer'
                }));
            })
            .catch(err => console.error("Error marking messages as read:", err));
    }, [selectedChat?._id, dispatch]);

    useEffect(() => {
        if (!token) return;
        
        if (token && (!socketService.isConnected() || socketService.getCurrentRole() !== 'developer')) {
            socketService.connect(token, 'developer');
        }
        
        socketService.onNewMessage((data) => {
            
            const messageChatId = data.chatId || 
                                 (data.message && data.message.chatId) || 
                                 (data.chat && data.chat._id);
            
            const chatIdStr = typeof messageChatId === 'object' ? 
                            messageChatId.toString() : messageChatId;
            
            if (selectedChat?._id === chatIdStr) {
                dispatch(addMessage(data.message || data));
                
                dispatch(updateUnreadCount({
                    chatId: chatIdStr,
                    recipientType: 'developer'
                }));
                
                ChatApi.markMessagesAsRead(selectedChat._id)
                    .then(() => console.log("Messages marked as read after receiving new message"))
                    .catch(err => console.error("Error marking messages as read:", err));
            }
            
            dispatch(updateChatWithNewMessage({
                chatId: chatIdStr,
                message: data.message || data
            }));
        });
        
        if (!socketService.isConnected()) return;
        
        const handleMessagesRead = (data: any) => {
            dispatch(updateMessageReadStatus(data));
            
            if (data.chatId && data.recipientType) {
                dispatch(updateUnreadCount({
                    chatId: data.chatId,
                    recipientType: data.recipientType
                }));
            }
        };
        
        socketService.onMessagesRead(handleMessagesRead);
        
        if (selectedChat?._id) {
            socketService.joinChat(selectedChat._id);
            subscribedChats.current.add(selectedChat._id);
        }
        
        return () => {};
    }, [selectedChat?._id, dispatch, refreshChats, token]);

    useEffect(() => {
        if (chats.length === 0) return;
        
        chats.forEach(chat => {
            if (chat._id && !subscribedChats.current.has(chat._id)) {
                socketService.joinChat(chat._id);
                subscribedChats.current.add(chat._id);
            }
        });
        
        return () => {};
    }, [chats]);

    useEffect(() => {
        return () => {
            subscribedChats.current.forEach(chatId => {
                socketService.leaveChat(chatId);
            });
            subscribedChats.current.clear();
            socketService.cleanup();
        };
    }, []);

    const loadMoreMessages = useCallback(() => {
        if (selectedChat?._id && hasMore && !messageLoading) {
            dispatch(fetchMessages({ chatId: selectedChat._id, page }));
        }
    }, [selectedChat?._id, hasMore, messageLoading, page, dispatch]);

    const forceRefreshChats = useCallback(async () => {
        ChatApi.clearDeveloperChatsCache();
        return dispatch(fetchDeveloperChats()).unwrap();
    }, [dispatch]);

    const handleSendMessage = useCallback(async (content: string) => {
        if (selectedChat?._id && content.trim()) {
            try {
                const result = await dispatch(sendMessage({ 
                    chatId: selectedChat._id, 
                    content: content.trim() 
                })).unwrap();
                
                await ChatApi.markMessagesAsRead(selectedChat._id);
                dispatch(updateUnreadCount({
                    chatId: selectedChat._id,
                    recipientType: 'developer'
                }));
                
                return result;
            } catch (error) {
                console.error('📤 DEVELOPER MESSAGE SEND ERROR', error);
                throw error;
            }
        }
    }, [selectedChat?._id, dispatch]);

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
        if (!selectedChat?._id) return;
        
        if (isTyping) {
            debouncedTypingStart(selectedChat._id);
        } else {
            debouncedTypingStop(selectedChat._id);
        }
    }, [selectedChat?._id, debouncedTypingStart, debouncedTypingStop]);

    return {
        chats,
        selectedChat,
        messages,
        loading,
        messageLoading,
        hasMore,
        loadMoreMessages,
        handleSendMessage,
        handleTyping,
        refreshChats
    };
};