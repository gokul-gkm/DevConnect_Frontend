import { useDeveloperChat } from '@/hooks/chat/useDeveloperChat';
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../ui/spinner';
import { Send, MoreVertical, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { formatChatMessageTime } from '@/utils/date';

export const DeveloperChatWindow = () => {
    const { selectedChat, messages, messageLoading, hasMore, loadMoreMessages, handleSendMessage, handleTyping } = useDeveloperChat();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    
    useEffect(() => {
        if (messageContainerRef.current && messages.length > 0 && !messageLoading) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages, messageLoading, selectedChat?._id]);
    
    useEffect(() => {
        const container = messageContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (container.scrollTop === 0 && hasMore && !messageLoading) {
                loadMoreMessages();
            }
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 150;
            setShowScrollButton(!isNearBottom && messages.length > 0);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasMore, messageLoading, loadMoreMessages, messages.length]);
    
    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
            setShowScrollButton(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            handleSendMessage(newMessage);
            setNewMessage('');
            setTimeout(scrollToBottom, 100);
        }
    };

    if (!selectedChat) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex items-center justify-center bg-black/95 text-zinc-300"
            >
                <div className="text-center p-8 rounded-xl bg-zinc-900/50 backdrop-blur-md shadow-xl border border-zinc-800/50 max-w-md">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Conversation Selected</h3>
                    <p className="text-zinc-400">Select a chat from the sidebar to start messaging with users</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col h-[calc(100vh-5rem)] md:h-screen relative bg-gradient-to-b from-black to-zinc-900"
        >
            <div className="fixed top-[72px] md:top-[80px] left-0 md:left-[320px] right-0 border-b border-zinc-800 backdrop-blur-md bg-zinc-900/30 z-20">
                <div className="flex items-center justify-between p-4 max-w-[1800px] mx-auto w-full">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            {selectedChat.userId?.profilePicture ? (
                                <img
                                    src={selectedChat.userId.profilePicture}
                                    alt={selectedChat.userId.username || "User"}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-zinc-800"
                                />
                            ) : (
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {selectedChat.userId?.username?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            )}
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                                selectedChat.isOnline ? 'bg-green-500' : 'bg-zinc-500'
                            }`}></div>
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-sm md:text-base">
                                {selectedChat.userId?.username || "User"}
                            </h2>
                        </div>
                    </div>
                    <button className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={messageContainerRef}
                className="flex-1 overflow-y-auto px-4 pt-[140px] pb-20"
            >
                {messageLoading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <Spinner />
                    </div>
                ) : messageLoading ? (
                    <div className="flex justify-center py-4">
                        <Spinner />
                    </div>
                ) : null}
                
                <div className="space-y-4 pb-4">
                    <AnimatePresence>
                        {messages
                            .slice()
                            .reverse()
                            .map((message: any, index) => (
                            <motion.div
                                key={`${message._id}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`flex ${
                                    message.senderType === 'developer' ? 'justify-end' : 'justify-start'
                                } mb-4`}
                            >
                                {message.senderType === 'user' && (
                                    <div className="flex-shrink-0 mr-3">
                                        {selectedChat.userId?.profilePicture ? (
                                            <img
                                                src={selectedChat.userId.profilePicture}
                                                alt="User"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                {selectedChat.userId?.username?.charAt(0)?.toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className={`max-w-[70%] ${message.senderType === 'developer' ? 'ml-auto' : 'mr-auto'}`}>
                                    <div className={`rounded-2xl px-4 py-3 shadow-lg ${
                                        message.senderType === 'developer'
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-none'
                                            : 'bg-zinc-800/80 text-zinc-100 rounded-tl-none backdrop-blur-sm'
                                    }`}>
                                        <p className="text-sm">{message.content}</p>
                                    </div>
                                    <div className={`flex items-center mt-1 text-xs ${
                                        message.senderType === 'developer' ? 'justify-end text-zinc-500' : 'justify-start text-zinc-600'
                                    }`}>
                                        {formatChatMessageTime(message.createdAt)}
                                        {message.read && message.senderType === 'developer' && (
                                            <span className="ml-2 text-blue-500"><LiaCheckDoubleSolid /></span>
                                        )}
                                    </div>
                                </div>
                                {message.senderType === 'developer' && (
                                    <div className="flex-shrink-0 ml-3">
                                        {selectedChat.developerId?.profilePicture ? (
                                            <img
                                                src={selectedChat.developerId.profilePicture}
                                                alt="Developer"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                                                {selectedChat.developerId?.username?.charAt(0)?.toUpperCase() || "D"}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <div ref={messagesEndRef} />
            </div>

            <div className="fixed bottom-0 left-0 md:left-[320px] right-0 bg-black border-t border-zinc-800/50 z-30">
                <form
                    onSubmit={handleSubmit}
                    className="px-4 py-4"
                >
                    <div className="flex items-center space-x-2 bg-zinc-800/80 rounded-full px-4 py-1 backdrop-blur-sm shadow-lg max-w-[1800px] mx-auto">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value);
                                handleTyping(true);
                            }}
                            onBlur={() => handleTyping(false)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent text-zinc-200 placeholder-zinc-500 focus:outline-none py-2.5 text-sm md:text-base"
                        />
                        
                        <motion.button
                            type="submit"
                            disabled={!newMessage.trim()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`rounded-full p-2 md:p-2.5 ${
                                newMessage.trim()
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-700/20'
                                    : 'bg-zinc-700 text-zinc-500'
                            }`}
                        >
                            <Send className="w-4 h-4 md:w-5 md:h-5" />
                        </motion.button>
                    </div>
                </form>
            </div>

            {showScrollButton && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={scrollToBottom}
                    className="fixed bottom-24 right-4 bg-blue-600 text-white p-2.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-30"
                >
                    <ArrowDown className="w-5 h-5" />
                </motion.button>
            )}
        </motion.div>
    );
};

const MessageCircle = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);