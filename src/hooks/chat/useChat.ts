import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../useAppSelector"
import { addMessage, fetchChats, fetchMessages, sendMessage, updateMessageReadStatus, updateChatWithNewMessage, updateUnreadCount } from "@/redux/slices/chatSlice";
import { socketService } from "@/service/socket/socketService";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import { ChatApi } from "@/service/Api/ChatApi";
import { useAuth } from "@/hooks/useAuth";

export const useChat = () => {
    const dispatch = useAppDispatch();
    const {
        chats,
        selectedChat,
        messages,
        loading,
        messageLoading,
        hasMore,
        page
    } = useAppSelector(state => state.chat);

    const initialFetchDone = useRef(false);
    
    const subscribedChats = useRef<Set<string>>(new Set());

    const { token } = useAuth();

    const refreshChats = useCallback(async () => {
        try {
            await dispatch(fetchChats()).unwrap();
            initialFetchDone.current = true;
            return true;
        } catch (error) {
            console.error("Fetch failed:", error);
            toast.error("Failed to load chats");
            return false;
        }
    }, [dispatch]);

    useEffect(() => {
        const chatId = selectedChat?._id;
        if (!chatId) return;
        
        dispatch(fetchMessages({ chatId, page: 1 }));

        if (!subscribedChats.current.has(chatId)) {
            socketService.joinChat(chatId);
            subscribedChats.current.add(chatId);
        }
        
        ChatApi.markMessagesAsRead(chatId)
            .then(() => {
                dispatch(updateUnreadCount({
                    chatId,
                    recipientType: 'user'
                }));
            })
            .catch(err => console.error("Error marking messages as read:", err));
        
        return () => {};
    }, [selectedChat?._id, dispatch]);
    
    useEffect(() => {
        const setupSocketConnection = async () => {
            
            if (!socketService.isConnected()) {
                const connected = await socketService.waitForConnection();
                if (!connected) {
                    console.error('Failed to connect socket');
                    return;
                }
            }
            
            if (token && (!socketService.isConnected() || socketService.getCurrentRole() !== 'user')) {
                socketService.connect(token, 'user');
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
                        recipientType: 'user'
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
            
            socketService.onMessagesRead((data) => {
                
                dispatch(updateMessageReadStatus(data));
                
                if (data.chatId && data.recipientType) {
                    dispatch(updateUnreadCount({
                        chatId: data.chatId,
                        recipientType: data.recipientType
                    }));
                }
            });
            
            socketService.on('new-message-notification', (data) => {
                
                const chatId = data.chatId || 
                              (data.message && data.message.chatId) || 
                              (data.chat && data.chat._id);
                              
                if (chatId) {
                    dispatch(updateChatWithNewMessage({
                        chatId,
                        message: data.message || data
                    }));
                }
            });
            
            if (selectedChat?._id) {
                socketService.joinChat(selectedChat._id);
                subscribedChats.current.add(selectedChat._id);
            }
        };
        
        setupSocketConnection();
        
        return () => {};
    }, [selectedChat?._id, dispatch, refreshChats, token]);

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
            dispatch(fetchMessages({
                chatId: selectedChat._id,
                page: page
            }));
        }
    }, [selectedChat?._id, hasMore, messageLoading, page, dispatch]);

    const forceRefreshChats = useCallback(async () => {
        ChatApi.clearUserChatsCache();
        return dispatch(fetchChats()).unwrap();
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
                    recipientType: 'user'
                }));
                
                return result;
            } catch (error) {
                console.error("Failed to send message:", error);
                throw error;
            }
        }
    }, [selectedChat?._id, dispatch]);

    const handleTyping = useCallback(
        debounce((isTyping: boolean) => {
            if (!selectedChat?._id) return;

            if (isTyping) {
                socketService.emitTypingStart(selectedChat._id);
            } else {
                socketService.emitTypingStop(selectedChat._id);
            }
        }, 300),
        [selectedChat?._id]
    );

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