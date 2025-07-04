import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../useAppSelector"
import { addMessage, fetchChats, fetchMessages, sendMessage, updateMessageReadStatus, updateChatWithNewMessage, updateUnreadCount, setTypingStatus, setOnlineStatus } from "@/redux/slices/chatSlice";
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
        page,
        typingStatus,
        onlineStatus
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
        dispatch({ type: 'chat/clearOnlineStatus' });
        
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
            
            socketService.onTypingStart((data) => {
                console.log("🚀 TYPING START in useChat:", data);
                if (data.chatId && data.developerId) {
                    console.log(`Setting typing status for chat ${data.chatId} to TRUE`);
                    dispatch(setTypingStatus({ chatId: data.chatId, isTyping: true }));
                }
            });
            
            socketService.onTypingStop((data) => {
                console.log("⏹️ TYPING STOP in useChat:", data);
                if (data.chatId && data.developerId) {
                    console.log(`Setting typing status for chat ${data.chatId} to FALSE`);
                    dispatch(setTypingStatus({ chatId: data.chatId, isTyping: false }));
                }
            });
            
            socketService.on('developer:online', (data) => {

                if (data.developerId && typeof data.isOnline === 'boolean') {
                    dispatch(setOnlineStatus({ 
                        developerId: data.developerId, 
                        isOnline: data.isOnline 
                    }));
                }
            });
            
            socketService.on('developer:offline', (data) => {

                if (data.developerId) {
                    dispatch(setOnlineStatus({ 
                        developerId: data.developerId, 
                        isOnline: false 
                    }));
                }
            });
            
            if (selectedChat?._id) {
                socketService.joinChat(selectedChat._id);
                subscribedChats.current.add(selectedChat._id);
            }
            
            if (chats.length > 0) {
                chats.forEach(chat => {
                    if (chat.developerId && chat.developerId._id) {
                        socketService.checkOnlineStatus(undefined, chat.developerId._id);
                    }
                });
            }
        };
        
        setupSocketConnection();
        
        return () => {};
    }, [selectedChat?._id, dispatch, refreshChats, token, chats]);

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

    const handleSendMessage = useCallback(async (content: string, mediaFile?: File) => {
        if (selectedChat?._id && (content.trim() || mediaFile)) {
            try {
                const formData = new FormData();
                formData.append('chatId', selectedChat._id);
                formData.append('content', content.trim() || (mediaFile ? 'Sent a file' : ''));
                
                if (mediaFile) {
                    formData.append('mediaFile', mediaFile);
                    formData.append('mediaType', ChatApi.getMediaType(mediaFile.type));
                }
                
                const result = await dispatch(sendMessage(formData)).unwrap();

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
        refreshChats,
        forceRefreshChats,
        isTyping: selectedChat?._id ? typingStatus[selectedChat._id] : false,
        typingStatus,
        onlineStatus
    };
};