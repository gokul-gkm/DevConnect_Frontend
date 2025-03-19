import { useDeveloperChat } from '@/hooks/chat/useDeveloperChat';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { setSelectedChat } from '@/redux/slices/chatSlice';
import { Spinner } from '../ui/spinner';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { formatMessageTime } from '@/utils/date';
import { SocketStatusIndicator } from '../socket/SocketStatusIndicator';

export const DeveloperChatSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { chats, loading } = useDeveloperChat();
    const selectedChat = useAppSelector(state => state.chat.selectedChat);

    const handleChatSelect = (chat: any) => {
        dispatch(setSelectedChat(chat));
        navigate(`/developer/chats/${chat._id}`);
    };

    if (loading) {
        return (
            <div className="w-80 bg-black/95 border-r border-zinc-800 flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-black/95 border-r border-zinc-800 h-screen flex flex-col"
        >
            <div className="p-6 pb-7 border-b border-zinc-800 sticky top-0 z-20 backdrop-blur-md bg-black/80">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
                    Client Messages
                </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
                {chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-5">
                        <div className="bg-zinc-800/50 p-6 rounded-full mb-4">
                            <MessageCircle className="h-8 w-8 text-zinc-500" />
                        </div>
                        <p className="text-zinc-400 text-sm">No conversations yet</p>
                        <p className="text-zinc-600 text-xs mt-1">Wait for users to contact you</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-800/50">
                        {chats.map((chat: any) => (
                            <motion.div
                                key={chat._id}
                                whileHover={{ backgroundColor: 'rgba(30, 30, 30, 0.8)' }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 cursor-pointer transition-all ${
                                    selectedChat?._id === chat._id 
                                        ? 'bg-zinc-800/80 border-l-4 border-blue-600'
                                        : 'border-l-4 border-transparent'
                                }`}
                                onClick={() => handleChatSelect(chat)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative flex-shrink-0">
                                        {chat.userId?.profilePicture ? (
                                            <img
                                                src={chat.userId.profilePicture}
                                                alt={chat.userId.username || "User"}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {chat.userId?.username?.charAt(0)?.toUpperCase() || "U"}
                                            </div>
                                        )}
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                                            chat.isOnline ? 'bg-green-500' : 'bg-zinc-500'
                                        }`}></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">
                                            {chat.userId?.username || "User"}
                                        </p>
                                        <p className="text-sm text-zinc-400 truncate">
                                            {chat.lastMessage || 'Start a conversation'}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-1">
                                        {chat.lastMessageTime && (
                                            <span className="text-xs text-zinc-500">
                                                {formatMessageTime(chat.lastMessageTime)}
                                            </span>
                                        )}
                                        {chat.developerUnreadCount > 0 && (
                                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                                                {chat.developerUnreadCount}
                                            </span>
                                        )}
                                        
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            
            <SocketStatusIndicator />
        </motion.div>
    );
};