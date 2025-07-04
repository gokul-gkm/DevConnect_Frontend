import { ReactNode } from 'react';
import { formatChatMessageTime } from '@/utils/date';
import { LiaCheckDoubleSolid } from "react-icons/lia";

interface MessageBubbleProps {
  content: string;
  mediaContent: ReactNode;
  isOutgoing: boolean;
  timestamp: string;
  isRead: boolean;
  showReadReceipt: boolean;
}

export const MessageBubble = ({
  content,
  mediaContent,
  isOutgoing,
  timestamp,
  isRead,
  showReadReceipt
}: MessageBubbleProps) => {
  return (
    <div className={`max-w-[70%] ${isOutgoing ? 'ml-auto' : 'mr-auto'}`}>
      <div className={`rounded-2xl px-2 py-2 ${
        isOutgoing
          ? 'bg-gradient-to-br from-indigo-500/40 via-blue-600/30 to-blue-500/50 text-white rounded-tr-none backdrop-blur-lg border border-blue-400/20 shadow-[0_4px_15px_rgba(59,130,246,0.15)] dark:shadow-[0_4px_15px_rgba(30,64,175,0.2)]'
          : 'bg-zinc-800/80 text-zinc-100 rounded-tl-none backdrop-blur-sm'
      }`}>
       
        {mediaContent}
     
        {content && <p className="text-sm mt-1 pl-2">{content}</p>}
      </div>
      <div className={`flex items-center mt-1 text-xs ${
        isOutgoing ? 'justify-end text-zinc-500' : 'justify-start text-zinc-600'
      }`}>
        {formatChatMessageTime(timestamp)}
        {showReadReceipt && isRead && isOutgoing && (
          <span className="ml-2 text-blue-500"><LiaCheckDoubleSolid /></span>
        )}
      </div>
    </div>
  );
}; 