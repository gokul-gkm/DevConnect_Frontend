import parsePhoneNumberFromString from 'libphonenumber-js';
import {z} from 'zod'

export const developerProfileSchema = z.object({
  username: z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(40, "Name must not exceed 40 characters")
  .regex(
    /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
    "Name can contain letters, numbers, and single spaces only"
  )
  .refine(
    (value) => (value.match(/[a-zA-Z]/g)?.length ?? 0) >= 3,
    {
      message: "Name must contain at least 3 letters",
    }
  ),


  email: z
    .string()
    .trim()
    .min(5, "Email is too short")
    .email("Invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must have at least 3 characters before @"
    ),
  bio: z.string().trim().min(10, 'Bio must be at least 10 characters'),
  contact: z.string().refine((value) => {
    const phone = parsePhoneNumberFromString(value);
    return phone?.isValid();
  }, {
    message: "Enter a valid international phone number",
  }),
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