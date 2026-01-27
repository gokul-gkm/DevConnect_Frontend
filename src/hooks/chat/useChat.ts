import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../useAppSelector";
import {
  addMessage,
  fetchChats,
  fetchMessages,
  sendMessage,
  updateMessageReadStatus,
  updateChatWithNewMessage,
  updateUnreadCount,
  setTypingStatus,
  setOnlineStatus,
} from "@/redux/slices/chatSlice";
import { socketService } from "@/service/socket/socketService";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import { ChatApi } from "@/service/Api/ChatApi";
import { useParams } from "react-router-dom";

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
    onlineStatus,
  } = useAppSelector((state) => state.chat);

  const subscribedChats = useRef<Set<string>>(new Set());
  const { chatId: routeChatId } = useParams();

  const hasUserOpenedChat = Boolean(routeChatId);

  /* =========================
     INITIAL CHAT FETCH
  ========================= */

  const refreshChats = useCallback(async () => {
    try {
      await dispatch(fetchChats()).unwrap();
      return true;
    } catch (error) {
      console.error("Fetch failed:", error);
      toast.error("Failed to load chats");
      return false;
    }
  }, [dispatch]);


  /* =========================
     CHAT SELECTION EFFECT
  ========================= */

  useEffect(() => {
    const chatId = selectedChat?._id;
    if (!chatId) return;

    dispatch(fetchMessages({ chatId, page: 1 }));

    if (!subscribedChats.current.has(chatId)) {
      socketService.joinChat(chatId);
      subscribedChats.current.add(chatId);
    }

    if (hasUserOpenedChat && routeChatId === chatId) {
      ChatApi.markMessagesAsRead(chatId)
        .then(() => {
          dispatch(
            updateUnreadCount({
              chatId,
              recipientType: "user",
            })
          );
        })
        .catch(console.error);
    }
  }, [selectedChat?._id, routeChatId, hasUserOpenedChat, dispatch]);

  /* =========================
     SOCKET LISTENERS
  ========================= */

  useEffect(() => {
    /* ---- NEW MESSAGE ---- */
    socketService.on("new-message", (data) => {
      const chatId =
        data.chatId ||
        data?.message?.chatId ||
        data?.chat?._id;

      if (!chatId) return;

      const isCurrentChat = selectedChat?._id === chatId;

      if (isCurrentChat) {
        dispatch(addMessage(data.message));
        ChatApi.markMessagesAsRead(chatId).catch(console.error);
      }

      dispatch(
        updateChatWithNewMessage({
          chatId,
          message: data.message,
        })
      );
    });

    /* ---- MESSAGE READ ---- */
    socketService.on("messages-read", (data) => {
      dispatch(updateMessageReadStatus(data));

      if (data.chatId && data.recipientType) {
        dispatch(
          updateUnreadCount({
            chatId: data.chatId,
            recipientType: data.recipientType,
          })
        );
      }
    });

    /* ---- TYPING ---- */
    socketService.on("typing:start", ({ chatId }) => {
      dispatch(setTypingStatus({ chatId, isTyping: true }));
    });

    socketService.on("typing:stop", ({ chatId }) => {
      dispatch(setTypingStatus({ chatId, isTyping: false }));
    });

    /* ---- ONLINE STATUS ---- */
    socketService.on("developer:online", ({ developerId }) => {
      dispatch(setOnlineStatus({ developerId, isOnline: true }));
    });

    socketService.on("developer:offline", ({ developerId }) => {
      dispatch(setOnlineStatus({ developerId, isOnline: false }));
    });

    return () => {
      socketService.off("new-message");
      socketService.off("messages-read");
      socketService.off("typing:start");
      socketService.off("typing:stop");
      socketService.off("developer:online");
      socketService.off("developer:offline");
    };
  }, [selectedChat?._id, dispatch]);

  /* =========================
     CLEANUP JOINED CHATS
  ========================= */

  useEffect(() => {
    return () => {
      subscribedChats.current.forEach((chatId) => {
        socketService.leaveChat(chatId);
      });
      subscribedChats.current.clear();
    };
  }, []);

  /* =========================
     PAGINATION
  ========================= */

  const loadMoreMessages = useCallback(() => {
    if (selectedChat?._id && hasMore && !messageLoading) {
      dispatch(
        fetchMessages({
          chatId: selectedChat._id,
          page,
        })
      );
    }
  }, [selectedChat?._id, hasMore, messageLoading, page, dispatch]);

  /* =========================
     SEND MESSAGE
  ========================= */

  const handleSendMessage = useCallback(
    async (content: string, mediaFile?: File) => {
      if (!selectedChat?._id || (!content.trim() && !mediaFile)) return;

      const formData = new FormData();
      formData.append("chatId", selectedChat._id);
      formData.append("content", content.trim());

      if (mediaFile) {
        formData.append("mediaFile", mediaFile);
        formData.append("mediaType", ChatApi.getMediaType(mediaFile.type));
      }

      return dispatch(sendMessage(formData)).unwrap();
    },
    [selectedChat?._id, dispatch]
  );

  /* =========================
     TYPING HANDLER
  ========================= */

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

  /* =========================
     RETURN API
  ========================= */

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
    isTyping: selectedChat?._id
      ? typingStatus[selectedChat._id]
      : false,
    typingStatus,
    onlineStatus,
  };
};
