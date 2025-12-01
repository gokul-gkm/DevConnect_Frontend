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
  
  return time;
};

export const formatDateSeparator = (timestamp: string | number | Date | null | undefined): string => {
  if (!timestamp) return '';
  
  const messageDate = new Date(timestamp);
  if (isNaN(messageDate.getTime())) return '';
  
  if (isToday(messageDate)) {
    return 'Today';
  } else if (isYesterday(messageDate)) {
    return 'Yesterday';
  } else {
    return format(messageDate, 'MMMM d, yyyy');
  }
};

export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};
