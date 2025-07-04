import { z } from 'zod';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const developerSchema = z.object({
  username: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  bio: z.string().min(10, 'Bio should be at least 10 characters'),
  expertise: z.array(z.string()).min(1, 'Select at least one expertise').max(5, 'Maximum 5 expertise allowed'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  sessionCost: z.number().min(100, 'Minimum session cost is $100').max(1000, 'Maximum session cost is $1000'),

  degree: z.string().min(2, 'Degree is required'),
  institution: z.string().min(2, 'Institution is required'),
  year: z.string().min(4, 'Valid year is required'),

  jobTitle: z.string().min(2, 'Job title is required'),
  company: z.string().min(2, 'Company name is required'),
  experience: z.string().min(1, 'Experience is required'),

  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid Portfolio URL').optional().or(z.literal('')),
  
  profilePicture: z.any()
    .refine((file) => file instanceof File, 'Profile image is required')
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    ).optional(),
    
  resume: z.any()
    .refine((file) => file instanceof File, 'Resume is required')
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
    .refine(
      (file) => ACCEPTED_RESUME_TYPES.includes(file?.type),
      'Only .pdf, .doc and .docx formats are supported'
    ).optional()
});

export type DeveloperFormData = z.infer<typeof developerSchema>;