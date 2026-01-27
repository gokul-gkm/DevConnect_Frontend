import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../useAppSelector";
import {
  fetchMessages,
  sendMessage,
  addMessage,
  setSelectedChat,
  fetchDeveloperChats,
  updateMessageReadStatus,
  updateChatWithNewMessage,
  updateUnreadCount,
  setTypingStatus,
  setOnlineStatus,
} from "@/redux/slices/chatSlice";
import { useParams } from "react-router-dom";
import { socketService } from "@/service/socket/socketService";
import { debounce } from "lodash";
import { ChatApi } from "@/service/Api/ChatApi";

export const useDeveloperChat = () => {
  const dispatch = useAppDispatch();
  const { chatId: routeChatId } = useParams();

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

  /* =========================
     INITIAL CHAT LOAD
  ========================= */

  useEffect(() => {
    dispatch(fetchDeveloperChats()).catch(console.error);
  }, [dispatch]);


  /* =========================
     CHAT SELECTION 
  ========================= */

  useEffect(() => {
    if (!routeChatId || chats.length === 0) return;

    const chat = chats.find((c) => c._id === routeChatId);
    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  }, [routeChatId, chats, dispatch]);

  /* =========================
     FETCH MESSAGES ON CHAT CHANGE
  ========================= */

  useEffect(() => {
    if (!selectedChat?._id) return;

    dispatch(fetchMessages({ chatId: selectedChat._id, page: 1 }));

    socketService.joinChat(selectedChat._id);
    subscribedChats.current.add(selectedChat._id);

    ChatApi.markMessagesAsRead(selectedChat._id)
      .then(() =>
        dispatch(
          updateUnreadCount({
            chatId: selectedChat._id,
            recipientType: "developer",
          })
        )
      )
      .catch(console.error);
  }, [selectedChat?._id, dispatch]);

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

      if (selectedChat?._id === chatId) {
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

    /* ---- USER PRESENCE ---- */
    socketService.on("user:online", ({ userId }) => {
      dispatch(setOnlineStatus({ userId, isOnline: true }));
    });

    socketService.on("user:offline", ({ userId }) => {
      dispatch(setOnlineStatus({ userId, isOnline: false }));
    });

    return () => {
      socketService.off("new-message");
      socketService.off("messages-read");
      socketService.off("typing:start");
      socketService.off("typing:stop");
      socketService.off("user:online");
      socketService.off("user:offline");
    };
  }, [selectedChat?._id, dispatch]);

  /* =========================
     CLEANUP CHAT ROOMS
  ========================= */

  useEffect(() => {
    return () => {
      subscribedChats.current.forEach((id) => {
        socketService.leaveChat(id);
      });
      subscribedChats.current.clear();
    };
  }, []);

  /* =========================
     PAGINATION
  ========================= */

  const loadMoreMessages = useCallback(() => {
    if (selectedChat?._id && hasMore && !messageLoading) {
      dispatch(fetchMessages({ chatId: selectedChat._id, page }));
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
    refreshChats: () => dispatch(fetchDeveloperChats()),
    typingStatus,
    isTyping: selectedChat?._id
      ? typingStatus[selectedChat._id]
      : false,
    onlineStatus,
  };
};
