import { ChatApi } from "@/service/Api/ChatApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

interface ChatState {
    chats: any[];
    selectedChat: any | null;
    messages: any[];
    loading: boolean;
    messageLoading: boolean;
    hasMore: boolean;
    page: number;
}

const initialState: ChatState = {
    chats: [],
    selectedChat: null,
    messages: [],
    loading: false,
    messageLoading: false,
    hasMore: true,
    page: 1
}

export const fetchChats = createAsyncThunk(
    'chat/fetchChats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await ChatApi.getUserChats();

            if (!response.success) {
                throw new Error('Failed to fetch chats');
            }

            return response.chats;
        } catch (error: any) {
            console.error("Error in fetchChats:", error);
            toast.error(error.message);
            return rejectWithValue(error.message)
        }
    }
)

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async ({ chatId, page }: { chatId: string; page: number }, { rejectWithValue }) => {
        try {
            const response = await ChatApi.getChatMessages(chatId, page);
            return response.data;
        } catch (error: any) {
            console.log("fetch message error: ", error)
            toast.error(error.message);
            return rejectWithValue(error.message)
        }
    }
)

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await ChatApi.sendMessage(formData);
            return response.message;
        } catch (error: any) {
            console.error('Redux: Error sending message:', error);
            toast.error(error.message || 'Failed to send message');
            return rejectWithValue(error.message);
        }
    }
)

export const fetchDeveloperChats = createAsyncThunk(
    'chat/fetchDeveloperChats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await ChatApi.getDeveloperChats();
            if (!response.success) {
                throw new Error('Failed to fetch developer chats');
            }

            return response.chats;
        } catch (error: any) {
            console.error("Error in fetchDeveloperChats:", error);
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);


const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
            state.messages = [];
            state.page = 1;
            state.hasMore = true;
        },
        addMessage: (state, action) => {          
            if (state.messages) {
                const messageExists = state.messages.some(msg => msg._id === action.payload._id);
                
                if (!messageExists) {
                    state.messages.unshift(action.payload);
                }
            }
        },
        updateMessageReadStatus: (state, action) => {
            if (state.messages) {
                const messageIds = action.payload.messageIds || [action.payload.messageId];
                state.messages = state.messages.map(message => 
                    messageIds.includes(message._id)
                        ? { ...message, read: true }
                        : message
                );
            }
        },
        resetChat: (state) => {
            state.selectedChat = null;
            state.messages = [];
            state.page = 1;
            state.hasMore = true;
        },
        updateChatWithNewMessage: (state, action) => {
            const { chatId, message } = action.payload;
            
            if (!chatId) {
                console.error('🔄 REDUX: Missing chatId in updateChatWithNewMessage');
                return;
            }
            
            const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
            if (chatIndex !== -1) {
                if (message?.content) {
                    state.chats[chatIndex].lastMessage = message.content;
                }
                if (message?.createdAt) {
                    state.chats[chatIndex].lastMessageTime = message.createdAt;
                }
                
                if (state.selectedChat?._id !== chatId) {
                    if (message?.senderType === 'user') {
                        state.chats[chatIndex].developerUnreadCount += 1;
                    } else {
                        state.chats[chatIndex].userUnreadCount += 1;
                    }
                }
                
                const updatedChat = { ...state.chats[chatIndex] };
                state.chats.splice(chatIndex, 1);
                state.chats.unshift(updatedChat);
            }
        },
        updateUnreadCount: (state, action) => {
            const { chatId, recipientType } = action.payload;
            
            const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
            if (chatIndex !== -1) {
                const updatedChat = { ...state.chats[chatIndex] };
                
                if (recipientType === 'user') {
                    updatedChat.userUnreadCount = 0;
                } else if (recipientType === 'developer') {
                    updatedChat.developerUnreadCount = 0;
                }
                
                state.chats[chatIndex] = updatedChat;
                state.chats = [...state.chats];
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => {
                state.loading = true;       
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload;
            })
            .addCase(fetchChats.rejected, (state,action) => {
                state.loading = false;
                toast.error('Failed to load chats from slice');
            })
            .addCase(fetchMessages.pending, (state) => {
                state.messageLoading = true;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                const newMessages = action.payload.messages || [];
                state.messageLoading = false;
                
                if (newMessages.length === 0) {
                    state.hasMore = false;
                    return;
                }
                
                const existingMessageIds = new Set(state.messages.map(msg => msg._id));

                const uniqueNewMessages = newMessages.filter((msg: any) => !existingMessageIds.has(msg._id));
                
                state.messages = [...state.messages, ...uniqueNewMessages];
                
                state.hasMore = newMessages.length === 50;
                
                if (uniqueNewMessages.length > 0) {
                    state.page += 1;
                }
            })
            .addCase(fetchMessages.rejected, (state) => {
                state.messageLoading = false;
                toast.error('Failed to fetch messages');
            })
            .addCase(sendMessage.pending, (state) => {
                console.log('Redux: Message sending in progress');
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    const messageExists = state.messages.some(msg => msg._id === action.payload._id);
                    if (!messageExists) {
                        state.messages.unshift(action.payload);
                    }
                } else {
                    console.warn("Message sent but payload was undefined");
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                toast.error('Failed to send message');
            })
            .addCase(fetchDeveloperChats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDeveloperChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload;
            })
            .addCase(fetchDeveloperChats.rejected, (state, action) => {
                state.loading = false;
                toast.error('Failed to load developer chats');
            });
    }
});

export const {
    setSelectedChat,
    addMessage,
    updateMessageReadStatus,
    resetChat,
    updateChatWithNewMessage,
    updateUnreadCount
} = chatSlice.actions;

export default chatSlice.reducer