import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import DeveloperApi from '@/service/Api/DeveloperApi';
import SessionApi from '@/service/Api/SessionApi';
import { useAppSelector } from '@/hooks/useAppSelector';

export const useAvailabilityManagement = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { _id: userId } = useAppSelector((state) => state.user);

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 21;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute of [0, 30]) {
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time: format(new Date(`2000-01-01T${timeValue}`), 'hh:mm a'),
          value: timeValue,
          available: true
        });
      }
    }
    return slots;
  };

  const { data: bookedSlots, isLoading: isLoadingBookedSlots } = useQuery({
    queryKey: ['bookedSlots', 'developer', selectedDate, userId],
    queryFn: async () => {
      if (!selectedDate || !userId) throw new Error('Date or user ID not available');
      return SessionApi.getBookedSlots(userId, selectedDate);
    },
    enabled: !!selectedDate && !!userId
  });

  const { data: fetchedUnavailableSlots, isLoading: isLoadingUnavailableSlots } = useQuery({
    queryKey: ['unavailableSlots', selectedDate],
    queryFn: async () => {
      if (!selectedDate) throw new Error('Date not selected');
      return DeveloperApi.getUnavailableSlots(selectedDate);
    },
    enabled: !!selectedDate
  });

  useEffect(() => {
    if (fetchedUnavailableSlots) {
      setUnavailableSlots(fetchedUnavailableSlots || []);
    }
  }, [fetchedUnavailableSlots]);

  const updateMutation = useMutation({
    mutationFn: (slots: string[]) => 
      DeveloperApi.updateAvailability(selectedDate as Date, slots),
    onSuccess: () => {
      toast.success('Availability updated successfully');
      queryClient.invalidateQueries({ queryKey: ['unavailableSlots'] });
      queryClient.invalidateQueries({ queryKey: ['bookedSlots'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update availability');
    }
  });

  const toggleSlotAvailability = (slotValue: string) => {
    if (isSlotBooked(slotValue)) {
      toast.error('Cannot change availability for a booked slot');
      return;
    }
    
    setUnavailableSlots(prev => {
      if (prev.includes(slotValue)) {
        return prev.filter(s => s !== slotValue);
      } else {
        return [...prev, slotValue];
      }
    });
  };


  const saveUnavailableSlots = () => {
    if (selectedDate) {
      updateMutation.mutate(unavailableSlots);
    }
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
  
      return isBooked;
    });
  };

  const toggleAllSlots = (makeAvailable: boolean) => {
    if (makeAvailable) {
      setUnavailableSlots([]);
    } else {

      const allSlots = generateTimeSlots();
      const nonBookedSlots = allSlots
        .filter(slot => !isSlotBooked(slot.value))
        .map(slot => slot.value);
      setUnavailableSlots(nonBookedSlots);
    }
  };

  const getAllTimeSlots = () => {
    const allSlots = generateTimeSlots();
    return allSlots.map(slot => ({
      ...slot,
      available: !unavailableSlots.includes(slot.value) && !isSlotBooked(slot.value),
      booked: isSlotBooked(slot.value)
    }));
  };

  return {
    selectedDate,
    setSelectedDate,
    unavailableSlots,
    isLoading: isLoadingBookedSlots || isLoadingUnavailableSlots || updateMutation.isPending,
    toggleSlotAvailability,
    saveUnavailableSlots,
    isSlotBooked,
    toggleAllSlots,
    getAllTimeSlots
  };
};
