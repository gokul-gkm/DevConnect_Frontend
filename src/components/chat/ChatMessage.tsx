import { useAppSelector } from '@/hooks/useAppSelector';
import { formatDistanceToNow } from 'date-fns';
import { CheckIcon, CheckCheckIcon } from 'lucide-react';

interface ChatMessageProps {
  message: any;
  isLastMessage: boolean;
}

export const ChatMessage = ({ message, isLastMessage }: ChatMessageProps) => {
  const userId = useAppSelector(state => state.user);
  const isOwnMessage = message.senderId === userId;

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 bg-black ${
          isOwnMessage
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-200'
        }`}
      >
        <p className="text-sm text-black">{message.content}</p>
        <div className="flex items-center justify-end space-x-1 mt-1">
          <span className="text-xs opacity-75 bg-black">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
          {isOwnMessage && (
            <span className="text-xs">
              {message.read ? (
                <CheckCheckIcon className="w-4 h-4" />
              ) : (
                <CheckIcon className="w-4 h-4" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};