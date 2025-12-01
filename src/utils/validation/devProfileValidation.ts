import {z} from 'zod'

export const developerProfileSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters'),
  email: z.string().trim().email('Invalid email address'),
  bio: z.string().trim().min(10, 'Bio must be at least 10 characters'),
  contact: z.union([z.string().trim(), z.number()])
    .transform(val => val.toString())
    .refine((val) => val.length >= 10, { message: 'Contact number must be at least 10 digits' }),
  location: z.string().trim().optional(),
  jobTitle: z.string().trim().min(2, 'Job title is required'),
  companyName: z.string().trim().min(2, 'Company name is required'),
  experience: z.union([z.string().trim(), z.number()])
    .transform(val => val.toString())
    .refine((val) => Number(val) >= 0 && Number(val) <= 50, {
      message: 'Experience must be between 0 and 50 years'
    }),
  hourlyRate: z.string().trim().min(1, 'Session cost is required'),
  degree: z.string().trim().min(2, 'Degree is required'),
  institution: z.string().trim().min(2, 'Institution is required'),
  year: z.union([z.string().trim(), z.number()])
    .transform(val => val.toString())
    .refine((val) => {
      const year = Number(val);
      const currentYear = new Date().getFullYear();
      return year >= 1950 && year <= currentYear + 5;
    }, {
      message: 'Please enter a valid graduation year'
    }),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedIn: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid URL').optional().or(z.literal('')),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
});

export type DeveloperProfileFormData = z.infer<typeof developerProfileSchema>;