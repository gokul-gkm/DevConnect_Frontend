import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema } from '@/utils/validation/bookingValidation';
import type { BookingFormData } from '@/types/session';

interface Option {
  value: string;
  label: string;
}

export const useBookingForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<Option[]>([]);
  const [hourlyRate, setHourlyRate] = useState(0);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      topics: [],
      duration: 60
    }
  });

  const selectedDuration = watch('duration') || 60;
  const sessionCost = (hourlyRate * selectedDuration) / 60;

  const handleTopicsChange = (newValue: Option[]) => {
    setSelectedTopics(newValue);
    setValue('topics', newValue.map(topic => topic.value));
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedTopics,
    control,
    handleSubmit,
    errors,
    selectedDuration,
    sessionCost,
    handleTopicsChange,
    setHourlyRate
  };
};