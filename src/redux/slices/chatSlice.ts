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
    async ({ chatId, content }: { chatId: string; content: string }, { rejectWithValue }) => {
        try {
            const response = await ChatApi.sendMessage(chatId, content);
            return response.message;
        } catch (error: any) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
)

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
                state.messages = state.messages.map(message => 
                    message._id === action.payload.messageId 
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
                console.error("Rejected with:", action.payload);
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
            .addCase(sendMessage.rejected, (state) => {
                toast.error('Failed to send message');
            });
    }
});

export const {
    setSelectedChat,
    addMessage,
    updateMessageReadStatus,
    resetChat
} = chatSlice.actions;

export default chatSlice.reducer