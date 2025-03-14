import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../useAppSelector"
import { addMessage, fetchChats, fetchMessages, sendMessage, updateMessageReadStatus } from "@/redux/slices/chatSlice";
import { socketService } from "@/service/socket/socketService";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import { ChatApi } from "@/service/Api/ChatApi";

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
    const lastFetchTime = useRef<number>(0);
    const FETCH_COOLDOWN = 30000;
    
    const subscribedChats = useRef<Set<string>>(new Set());

    const refreshChats = useCallback(() => {
        const now = Date.now();
        if (!initialFetchDone.current || now - lastFetchTime.current >= FETCH_COOLDOWN) {
            lastFetchTime.current = now;
            
            return dispatch(fetchChats())
                .unwrap()
                .then((result) => {
                    initialFetchDone.current = true;
                    return result;
                })
                .catch((error) => {
                    console.error("Fetch failed:", error);
                    toast.error("Failed to load chats");
                    throw error;
                });
        }
        return Promise.resolve(chats);
    }, [dispatch, chats]);

    useEffect(() => {
        const chatId = selectedChat?._id;
        if (!chatId) return;
        
        dispatch(fetchMessages({ chatId, page: 1 }));

        if (!subscribedChats.current.has(chatId)) {
            socketService.joinChat(chatId);
            subscribedChats.current.add(chatId);
        }
        ChatApi.markMessagesAsRead(selectedChat._id)
                        .then(() => {
                            console.log("Messages marked as read for selected chat");
                        })
                        .catch(err => console.error("Error marking messages as read:", err));
        return () => {
            
        };
    }, [selectedChat?._id, dispatch]);
    
    useEffect(() => {
        socketService.onNewMessage((data) => {
            if (selectedChat?._id === data.chatId) {
                dispatch(addMessage(data.message || data));
            } else {
                console.log("New message in another chat:", data);
                refreshChats();
            }
        });
        
        socketService.onMessagesRead((data) => {
            dispatch(updateMessageReadStatus(data));
        });

        return () => {
            subscribedChats.current.forEach(chatId => {
                socketService.leaveChat(chatId);
            });
            subscribedChats.current.clear();
            socketService.cleanup();
        };
    }, [dispatch, selectedChat?._id, refreshChats]);

    const loadMoreMessages = useCallback(() => {
        if (selectedChat?._id && hasMore && !messageLoading) {
            dispatch(fetchMessages({
                chatId: selectedChat._id,
                page: page
            }));
        }
    }, [selectedChat?._id, hasMore, messageLoading, page, dispatch]);

    const handleSendMessage = useCallback(async (content: string) => {
        if (selectedChat?._id && content.trim()) {
            try {
                await dispatch(sendMessage({
                    chatId: selectedChat._id,
                    content: content.trim()
                })).unwrap();
            } catch (error) {
                console.error("Failed to send message:", error);
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