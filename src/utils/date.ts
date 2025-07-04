import { format, isToday, isYesterday } from 'date-fns';

export const formatMessageTime = (timestamp: string | number | Date | null | undefined): string => {
  if (!timestamp) return '';
  
  const messageDate = new Date(timestamp);
 
  if (isNaN(messageDate.getTime())) return '';
  
  if (isToday(messageDate)) {
    return format(messageDate, 'h:mm a');
  } else if (isYesterday(messageDate)) {
    return 'Yesterday';
  } else {
    return format(messageDate, 'MMM d');
  }
};

export const formatChatMessageTime = (timestamp: string | number | Date | null | undefined): string => {
  if (!timestamp) return '';
  
  const messageDate = new Date(timestamp);
  if (isNaN(messageDate.getTime())) return '';
  
  const timeFormat = 'h:mm a'; 
  const time = format(messageDate, timeFormat);
  
  if (isToday(messageDate)) {
    return time;
  } else if (isYesterday(messageDate)) {
    return `Yesterday, ${time}`;
  } else {
    return `${format(messageDate, 'MMM d')}, ${time}`;
  }
};
