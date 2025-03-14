import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../useAppSelector';
import {  fetchMessages, sendMessage, addMessage, setSelectedChat, fetchDeveloperChats, updateMessageReadStatus } from '@/redux/slices/chatSlice';
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
    const initialFetchRef = useRef(false);
    const isSubscribedRef = useRef(true);

    // Function to refresh chats when new messages arrive
    const refreshChats = useCallback(async () => {
        try {
            await dispatch(fetchDeveloperChats()).unwrap();
            console.log("Developer chats refreshed after new message");
        } catch (error) {
            console.error("Error refreshing developer chats:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        const fetchDeveloperChat = async () => {
            if (!initialFetchRef.current) {
                console.log("Initial fetch of developer chats");
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
        if (chatId && chats.length > 0) {
            const chat = chats.find(c => c._id === chatId);
            if (chat) {
                dispatch(setSelectedChat(chat));
            }
        }
    }, [chatId, chats]);

    useEffect(() => {
        if (selectedChat?._id) {
            dispatch(fetchMessages({ chatId: selectedChat._id, page: 1 }));
            console.log("Marking messages as read for selected chat:", selectedChat._id);
            ChatApi.markMessagesAsRead(selectedChat._id)
                .then(() => {
                    console.log("Messages marked as read for selected chat");
                    // Refresh chats to update unread counts
                    refreshChats();
                })
                .catch(err => console.error("Error marking messages as read:", err));
        }
    }, [selectedChat?._id, dispatch, refreshChats]);

    useEffect(() => {
        if (!token) return;

        const handleNewMessage = (data: any) => {
            if (!isSubscribedRef.current) return;
            console.log("Developer received new message:", data);
            
            // Handle both message formats
            if (data.message) {
                dispatch(addMessage(data.message));
                
                // If this is the currently selected chat, mark as read
                if (selectedChat && data.chatId === selectedChat._id) {
                    ChatApi.markMessagesAsRead(selectedChat._id)
                        .then(() => console.log("Messages marked as read after receiving new message"))
                        .catch(err => console.error("Error marking messages as read:", err));
                }
                
                // Refresh chats to update unread counts and last message
                refreshChats();
            } else {
                dispatch(addMessage(data));
                
                // Refresh chats to update unread counts and last message
                refreshChats();
            }
        };

        socketService.connect(token, 'developer');
        socketService.onNewMessage(handleNewMessage);

        // Listen for new message notifications (for unselected chats)
        socketService.on('new-message-notification', (data: any) => {
            console.log("New message notification received:", data);
            // Refresh chats to update unread counts and last message
            refreshChats();
        });

        socketService.onMessagesRead((data) => {
            console.log("Messages read event received in developer chat:", data);
            dispatch(updateMessageReadStatus(data));
        });

        return () => {
            isSubscribedRef.current = false;
            socketService.cleanup();
        };
    }, [token, selectedChat?._id, dispatch, refreshChats]);

    useEffect(() => {
        const newChats = chats.filter(chat => !subscribedChats.has(chat._id));
        
        if (newChats.length > 0) {
            newChats.forEach(chat => {
                console.log("Developer subscribing to chat:", chat._id);
                socketService.joinChat(chat._id);
            });
            
            setSubscribedChats(prev => new Set([...prev, ...newChats.map(chat => chat._id)]));
        }

        return () => {
            subscribedChats.forEach(chatId => {
                socketService.leaveChat(chatId);
            });
        };
    }, [chats]);

    const loadMoreMessages = useCallback(() => {
        if (selectedChat?._id && hasMore && !messageLoading) {
            dispatch(fetchMessages({ chatId: selectedChat._id, page }));
        }
    }, [selectedChat?._id, hasMore, messageLoading, page]);

    const handleSendMessage = useCallback((content: string) => {
        if (selectedChat?._id && content.trim()) {
            dispatch(sendMessage({ chatId: selectedChat._id, content: content.trim() }));
        }
    }, [selectedChat?._id]);

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