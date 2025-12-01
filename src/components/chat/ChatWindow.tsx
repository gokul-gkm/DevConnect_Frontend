import { useChat } from '@/hooks/chat/useChat';
import { useEffect, useRef, useState } from 'react';
import { Send, MoreVertical, ArrowDown, Smile, Paperclip, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { MessageBubble } from './MessageBubble';
import { AvatarIcon } from './AvatarIcon';
import { MessageMediaContent } from './MessageMediaContent';
import { FilePreview } from './FilePreview';
import { TypingIndicator } from './TypingIndicator';
import { useAppSelector } from '@/hooks/useAppSelector';
import { OnlineStatusDot } from './OnlineStatusDot';
import { DateSeparator } from './DateSeparator';
import { isSameDay } from '@/utils/date';

export const ChatWindow = () => {
    const { selectedChat, messages, messageLoading, hasMore, loadMoreMessages, handleSendMessage, handleTyping } = useChat();
    const typingStatus = useAppSelector(state => state.chat.typingStatus) as Record<string, boolean>;
    const onlineStatus = useAppSelector(state => state.chat.onlineStatus) as Record<string, boolean>;
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            
            if (file.type.startsWith('image/')) {
                setFileType('image');
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFilePreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            } else if (file.type.startsWith('video/')) {
                setFileType('video');
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFilePreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            } else if (file.type.startsWith('audio/')) {
                setFileType('audio');
                setFilePreview(null);
            } else if (file.type === 'application/pdf') {
                setFileType('pdf');
                setFilePreview(null);
            } else {
                setFileType('document');
                setFilePreview(null);
            }
        }
    };
    
    const handleFileClick = () => {
        fileInputRef.current?.click();
    };
    
    const removeSelectedFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        setFileType(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((newMessage.trim() || selectedFile) && !isSending) {
            setIsSending(true);
            try {
                await handleSendMessage(newMessage, selectedFile || undefined);
                setNewMessage('');
                setSelectedFile(null);
                setFilePreview(null);
                setFileType(null);
                scrollToBottom();
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (error) {
                console.error("Error sending message:", error);
            } finally {
                setIsSending(false);
            }
        }
    };

    const renderMediaContent = (message: any) => {
        return <MessageMediaContent mediaType={message.mediaType} mediaUrl={message.mediaUrl} />;
    };
    
    const renderFilePreview = () => {
        if (!selectedFile) return null;
        return (
            <FilePreview 
                fileType={fileType} 
                filePreview={filePreview} 
                fileName={selectedFile.name} 
                isDeveloperChat={false}
            />
        );
    };

    const shouldShowDateSeparator = (currentMessage: any, previousMessage: any | null): boolean => {
        if (!previousMessage) return true;
        
        const currentDate = new Date(currentMessage.createdAt);
        const previousDate = new Date(previousMessage.createdAt);
        
        return !isSameDay(currentDate, previousDate);
    };

    if (!selectedChat) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex items-center justify-center bg-black/95 text-zinc-300"
            >
                <div className="text-center p-8 rounded-xl bg-zinc-900/50 backdrop-blur-md shadow-xl border border-zinc-800/50 max-w-md mx-4">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Conversation Selected</h3>
                    <p className="text-zinc-400">Select a chat from the sidebar to start messaging</p>
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
            <AnimatePresence>
                {previewImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setPreviewImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-4xl max-h-[90vh]"
                        >
                            <img 
                                src={previewImage} 
                                alt="Preview" 
                                className="max-w-full max-h-[90vh] object-contain"
                            />
                            <button 
                                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full"
                                onClick={() => setPreviewImage(null)}
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed top-[72px] md:top-[80px] left-0 md:left-[320px] right-0 border-b border-zinc-800 backdrop-blur-md bg-zinc-900/30 z-20">
                <div className="flex items-center justify-between p-4 max-w-[1800px] mx-auto w-full">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            {selectedChat.developerId.profilePicture ? (
                                <div className="relative">
                                    <img
                                        src={selectedChat.developerId.profilePicture}
                                        alt={selectedChat.developerId.username}
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-zinc-800"
                                    />
                                    <OnlineStatusDot 
                                        developerId={selectedChat.developerId._id}
                                        className="absolute bottom-0 right-0"
                                    />
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {selectedChat.developerId.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <OnlineStatusDot 
                                        developerId={selectedChat.developerId._id}
                                        className="absolute bottom-0 right-0"
                                    />
                                </div>
                            )}                          
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-sm md:text-base">
                                {selectedChat.developerId.username}
                            </h2>
                            {selectedChat?._id && typingStatus[selectedChat._id] ? (
                                <TypingIndicator isTyping={true} inline className="mt-1" />
                            ) : (
                                <div className="text-xs text-zinc-400 flex items-center mt-1">
                                    {onlineStatus[selectedChat.developerId._id] ? 'Online' : 'Offline'}
                                </div>
                            )}
                        </div>
                    </div>
                    <button className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={messageContainerRef}
                className="flex-1 overflow-y-auto px-4 pt-[140px] pb-24 md:pb-32 lg:pb-40"
            >
                <AnimatePresence>
                    {messages
                        .slice()
                        .reverse()
                        .map((message: any, index) => {
                            const previousMessage = index > 0 ? messages.slice().reverse()[index - 1] : null;
                            const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
                            
                            return (
                                <div key={`${message._id}-${index}`}>
                                    {showDateSeparator && (
                                        <DateSeparator timestamp={message.createdAt} />
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`flex ${
                                            message.senderType === 'user' ? 'justify-end' : 'justify-start'
                                        } mb-4`}
                                    >
                                        {message.senderType === 'developer' && (
                                            <div className="flex-shrink-0 mr-3">
                                                <AvatarIcon 
                                                    profilePicture={selectedChat.developerId.profilePicture}
                                                    username={selectedChat.developerId.username}
                                                    gradientFrom="blue-600"
                                                    gradientTo="purple-600"
                                                    fallbackLetter="D"
                                                />
                                            </div>
                                        )}
                                        
                                        <MessageBubble 
                                            content={message.content}
                                            mediaContent={renderMediaContent(message)}
                                            isOutgoing={message.senderType === 'user'}
                                            timestamp={message.createdAt}
                                            isRead={message.read}
                                            showReadReceipt={true}
                                        />
                                        
                                        {message.senderType === 'user' && (
                                            <div className="flex-shrink-0 ml-3">
                                                <AvatarIcon 
                                                    profilePicture={selectedChat.userId.profilePicture}
                                                    username={selectedChat.userId.username}
                                                    gradientFrom="purple-600"
                                                    gradientTo="pink-600"
                                                    fallbackLetter="U"
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            );
                        })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            <div className="fixed bottom-0 left-0 md:left-[320px] right-0 bg-black border-t border-zinc-800/50 z-30">
                {selectedFile && (
                    <div className="px-4 py-3 bg-zinc-800/30 border-b border-zinc-700/30">
                        <div className="max-w-[1800px] mx-auto flex items-center">
                            <div className="flex-1 mr-2">
                                {renderFilePreview()}
                            </div>
                            <button 
                                onClick={removeSelectedFile}
                                className="text-zinc-400 hover:text-white p-2 bg-zinc-800/80 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
                
                <form
                    onSubmit={handleSubmit}
                    className="px-4 py-4"
                >
                    <div className="flex items-center space-x-2 bg-zinc-800/80 rounded-full px-4 py-1 backdrop-blur-sm shadow-lg max-w-[1800px] mx-auto">
                        <div className="relative">
                            <button 
                                type="button"
                                onClick={() => setShowEmojiPicker(prev => !prev)}
                                className="text-zinc-400 hover:text-zinc-200 transition-colors p-2"
                            >
                                <Smile className="w-5 h-5" />
                            </button>
                            {showEmojiPicker && (
                                <div 
                                    ref={emojiPickerRef}
                                    className="absolute bottom-12 left-0 z-50"
                                >
                                    <EmojiPicker 
                                        onEmojiClick={handleEmojiClick}
                                        theme={Theme.DARK}
                                        width={300}
                                        height={400}
                                        skinTonesDisabled
                                        searchDisabled
                                        lazyLoadEmojis
                                    />
                                </div>
                            )}
                        </div>
                        
                        <button
                            type="button"
                            onClick={handleFileClick}
                            className="text-zinc-400 hover:text-zinc-200 transition-colors p-2"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                        />
                        
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value);
                                handleTyping(true);
                            }}
                            onBlur={() => handleTyping(false)}
                            placeholder={selectedFile ? "Add a caption..." : "Type a message..."}
                            className="flex-1 bg-transparent text-zinc-200 placeholder-zinc-500 focus:outline-none py-2.5 text-sm md:text-base"
                        />
                    
                        <motion.button
                            type="submit"
                            disabled={(!newMessage.trim() && !selectedFile) || isSending}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`rounded-full p-2 md:p-2.5 ${
                                (newMessage.trim() || selectedFile) && !isSending
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
                    className="fixed bottom-24 right-4 bg-blue-600 text-white p-2.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
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