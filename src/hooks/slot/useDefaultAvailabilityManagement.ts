import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import DeveloperApi from '@/service/Api/DeveloperApi';

export const useDefaultAvailabilityManagement = () => {
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 21;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (const minute of [0, 30]) {
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

  const { data: fetchedUnavailableSlots, isLoading: isLoadingUnavailableSlots } = useQuery({
    queryKey: ['defaultUnavailableSlots'],
    queryFn: async () => {
      return DeveloperApi.getDefaultUnavailableSlots();
    }
  });

  useEffect(() => {
    if (fetchedUnavailableSlots) {
      setUnavailableSlots(fetchedUnavailableSlots || []);
    }
  }, [fetchedUnavailableSlots]);

  const updateMutation = useMutation({
    mutationFn: (slots: string[]) => 
      DeveloperApi.updateDefaultAvailability(slots),
    onSuccess: () => {
      toast.success('Default availability updated successfully');
      queryClient.invalidateQueries({ queryKey: ['defaultUnavailableSlots'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update default availability');
    }
  });

  const toggleSlotAvailability = (slotValue: string) => {
    setUnavailableSlots(prev => {
      if (prev.includes(slotValue)) {
        return prev.filter(s => s !== slotValue);
      } else {
        return [...prev, slotValue];
      }
    });
  };

  const saveUnavailableSlots = () => {
    updateMutation.mutate(unavailableSlots);
  };

  const toggleAllSlots = (makeAvailable: boolean) => {
    if (makeAvailable) {
      setUnavailableSlots([]);
    } else {
      const allSlots = generateTimeSlots();
      const allSlotValues = allSlots.map(slot => slot.value);
      setUnavailableSlots(allSlotValues);
    }
  };

  const getAllTimeSlots = () => {
    const allSlots = generateTimeSlots();
    return allSlots.map(slot => ({
      ...slot,
      available: !unavailableSlots.includes(slot.value),
      booked: false
    }));
  };

  return {
    unavailableSlots,
    isLoading: isLoadingUnavailableSlots || updateMutation.isPending,
    toggleSlotAvailability,
    saveUnavailableSlots,
    toggleAllSlots,
    getAllTimeSlots
  };
};
