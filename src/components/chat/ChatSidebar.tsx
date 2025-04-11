import { useChat } from '@/hooks/chat/useChat';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { setSelectedChat } from '@/redux/slices/chatSlice';
import { Spinner } from '../ui/spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { formatMessageTime } from '@/utils/date';
import { SocketStatusIndicator } from '../socket/SocketStatusIndicator';
import { useState, useEffect } from 'react';

export const ChatSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { chats, loading } = useChat();
    const selectedChat = useAppSelector(state => state.chat.selectedChat);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChatSelect = (chat: any) => {
        dispatch(setSelectedChat(chat));
        navigate(`/chats/${chat._id}`);
        if (isMobile) setIsOpen(false);
    };

    if (loading) {
        return <div className="w-20 md:w-80 bg-black/95 border-r border-zinc-800 flex items-center justify-center h-screen"><Spinner /></div>;
    }

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="p-4 md:p-6 border-b border-zinc-800 sticky top-0 z-20 backdrop-blur-md bg-black/80 flex items-center">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
                    Messages
                </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
                {chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-5">
                        <div className="bg-zinc-800/50 p-6 rounded-full mb-4">
                            <MessageCircle className="h-8 w-8 text-zinc-500" />
                        </div>
                        <p className="text-zinc-400 text-sm">No conversations yet</p>
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
                                        {chat.developerId.profilePicture ? (
                                            <img
                                                src={chat.developerId.profilePicture}
                                                alt={chat.developerId.username}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {chat.developerId.username?.charAt(0)?.toUpperCase()}
                                            </div>
                                        )}
                                        
                                    </div>
                                    {(!isMobile || isOpen) && (
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">
                                                {chat.developerId.username}
                                            </p>
                                            <p className="text-sm text-zinc-400 truncate">
                                                {chat.lastMessage || 'Start a conversation'}
                                            </p>
                                        </div>
                                    )}
                                    {(!isMobile || isOpen) && (
                                        <div className="flex flex-col items-end space-y-1">
                                            {chat.lastMessageTime && (
                                                <span className="text-xs text-zinc-500">
                                                    {formatMessageTime(chat.lastMessageTime)}
                                                </span>
                                            )}
                                            {chat.userUnreadCount > 0 && (
                                                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                                                    {chat.userUnreadCount}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <SocketStatusIndicator />
        </div>
    );

    return (
        <>
            {isMobile && !isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-[160px] left-4 z-50 p-2.5 bg-zinc-800/80 backdrop-blur-sm rounded-full text-white shadow-lg hover:bg-zinc-700/80 transition-all"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            )}
            
            <AnimatePresence>
                {(!isMobile || isOpen) && (
                    <motion.div
                        initial={{ x: isMobile ? -320 : 0 }}
                        animate={{ x: 0 }}
                        exit={{ x: isMobile ? -320 : 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className={`fixed md:relative z-40 h-screen bg-black/95 border-r border-zinc-800 ${
                            isMobile ? 'w-[280px]' : 'w-20 md:w-80'
                        }`}
                    >
                        {sidebarContent}
                    </motion.div>
                )}
            </AnimatePresence>
            
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};