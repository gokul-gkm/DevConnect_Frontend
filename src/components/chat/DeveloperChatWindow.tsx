import { useDeveloperChat } from '@/hooks/chat/useDeveloperChat';
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../ui/spinner';
import { formatDistanceToNow } from 'date-fns';
import { Send, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DeveloperChatWindow = () => {
    const { selectedChat, messages, messageLoading, hasMore, loadMoreMessages, handleSendMessage, handleTyping } = useDeveloperChat();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        const container = messageContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (container.scrollTop === 0 && hasMore && !messageLoading) {
                loadMoreMessages();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasMore, messageLoading, loadMoreMessages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            handleSendMessage(newMessage);
            setNewMessage('');
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
            className="flex-1 flex flex-col h-screen bg-black/95"
        >
            <div className="p-4 border-b border-zinc-800 backdrop-blur-md bg-zinc-900/30 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        {selectedChat.userId?.profilePicture ? (
                            <img
                                src={selectedChat.userId.profilePicture}
                                alt={selectedChat.userId.username || "User"}
                                className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                {selectedChat.userId?.username?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                            selectedChat.isOnline ? 'bg-green-500' : 'bg-zinc-500'
                        }`}></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-white">
                            {selectedChat.userId?.username || "User"}
                        </h2>
                        <p className="text-sm text-zinc-400">
                            {selectedChat.isOnline ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={messageContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-black to-zinc-900"
            >
                {messageLoading && (
                    <div className="flex justify-center py-4">
                        <Spinner />
                    </div>
                )}
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
                                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                    {message.read && message.senderType === 'developer' && (
                                        <span className="ml-2 text-blue-500">✓✓</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-zinc-800 backdrop-blur-md bg-zinc-900/30 sticky bottom-0"
            >
                <div className="flex items-center space-x-2 bg-zinc-800/80 rounded-full p-1 pl-4 backdrop-blur-sm shadow-lg">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping(true);
                        }}
                        onBlur={() => handleTyping(false)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent text-zinc-200 placeholder-zinc-500 focus:outline-none py-2 pl-5"
                    />
                
                    <motion.button
                        type="submit"
                        disabled={!newMessage.trim()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`rounded-full p-3 ${
                            newMessage.trim()
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-700/20'
                                : 'bg-zinc-700 text-zinc-500'
                        }`}
                    >
                        <Send className="w-5 h-5" />
                    </motion.button>
                </div>
            </form>
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