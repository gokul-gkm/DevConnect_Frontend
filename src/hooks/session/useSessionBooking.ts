import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import SessionApi from '@/service/Api/SessionApi';
import UserApi from '@/service/Api/UserApi';
import type { BookingFormData } from '@/types/session';

interface UseSessionBookingProps {
  selectedDate: Date | null;
  selectedTopics: { value: string; label: string }[];
  sessionCost: number;
}

export const useSessionBooking = ({
  selectedDate,
  selectedTopics,
  sessionCost,
}: UseSessionBookingProps) => {
  const { developerId } = useParams();
  const navigate = useNavigate();

  const { 
    data: developer, 
    isLoading: isLoadingDeveloper 
  } = useQuery({
    queryKey: ['developer', developerId],
    queryFn: () => UserApi.getPublicProfile(developerId as string),
  });

  const { 
    data: bookedSlots, 
    isLoading: isLoadingSlots 
  } = useQuery({
    queryKey: ['bookedSlots', developerId, selectedDate],
    queryFn: () => SessionApi.getBookedSlots(
      developerId as string, 
      selectedDate as Date
    ),
    enabled: !!developerId && !!selectedDate
  });

  const bookingMutation = useMutation({
    mutationFn: (data: BookingFormData) => 
      SessionApi.createBooking(developerId as string, data),
    onSuccess: () => {
      toast.success('Session booking request sent successfully');
      navigate('/sessions/upcoming');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to book session');
    }
  });

  const handleBookingSubmit = async (data: BookingFormData) => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    const [hours, minutes] = data.time.split(':');
    const startTime = new Date(selectedDate);
    startTime.setHours(Number(hours), Number(minutes), 0, 0);

    const bookingData = {
      ...data,
      topics: selectedTopics.map(topic => topic.value),
      sessionDate: selectedDate,
      startTime,
      price: sessionCost
    };

    bookingMutation.mutate(bookingData);
  };

  const isSlotBooked = (timeSlot: string): boolean => {
    if (!selectedDate || !bookedSlots?.data?.length) return false;
  
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotStartTime = new Date(selectedDate);
    slotStartTime.setHours(hours, minutes, 0, 0);
    
    return bookedSlots.data.some((slot: { startTime: string; duration: number }) => {
      const bookedStartTime = new Date(slot.startTime);
      const bookedEndTime = new Date(bookedStartTime.getTime() + slot.duration * 60000);
      
      const isBooked = slotStartTime >= bookedStartTime && slotStartTime < bookedEndTime;
  
      if (isBooked) {
        console.log('Slot booked:', {
          slot: timeSlot,
          slotStart: slotStartTime,
          bookedStart: bookedStartTime,
          bookedEnd: bookedEndTime
        });
      }
  
      return isBooked;
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 21;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute of [0, 30]) {
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time: format(new Date(`2000-01-01T${timeValue}`), 'hh:mm a'),
          value: timeValue
        });
      }
    }
    return slots;
  };

  return {
    developer,
    isLoadingDeveloper,
    bookedSlots,
    isLoadingSlots,
    handleBookingSubmit,
    isBooking: bookingMutation.isPending,
    isSlotBooked,
    generateTimeSlots
  };
};