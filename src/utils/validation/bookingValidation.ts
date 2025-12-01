import { z } from 'zod';

export const bookingSchema = z.object({
  title: z.string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z.string()
    .trim()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must not exceed 500 characters'),
  topics: z.array(z.string())
    .min(1, 'Select at least one topic')
    .max(5, 'Maximum 5 topics allowed'),
  time: z.string({ required_error: 'Please select a time slot' }),
  duration: z.number()
    .min(30, 'Minimum duration is 30 minutes')
    .max(120, 'Maximum duration is 120 minutes')
});

export type BookingFormData = z.infer<typeof bookingSchema>;