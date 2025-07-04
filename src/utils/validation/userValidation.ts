import * as z from "zod";

export const registrationSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    contact: z
      .string()
      .regex(/^\d{10,}$/, "Please enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[@$!%*?&#^]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(8, "Confirm Password must match the password"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });

  export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  });

  export type LoginFormData = z.infer<typeof loginSchema>;

  export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address").nonempty("Email is required"),
  });

  export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[@$!%*?&#^]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export const editProfileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()),
  avatarUrl: z.string().optional(),
  socialLinks: z.object({
    github: z.string().url('Invalid URL').optional().or(z.literal('')),
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
    portfolio: z.string().url('Invalid URL').optional().or(z.literal(''))
  })
})

export const profileSchema = z.object({
  username: z.string().trim()
    .min(2, 'Username must be at least 2 characters')
    .max(30, 'Username must not exceed 30 characters').refine((val) => val.trim().length >= 2, {
        message: 'Username should be at least 2 characters',
      }),
  email: z.string().email(),
  contact: z.union([
    z.string()
      .min(10, 'Contact number must be at least 10 digits')
      .max(15, 'Contact number must not exceed 15 digits')
      .regex(/^\d+$/, 'Contact must contain only numbers'),
    z.number()
  ]).optional(),
  location: z.string().optional(),
  bio: z.string().trim().min(10, 'Bio should be at least 10 characters').refine((val) => val.trim().length >= 10, {
    message: 'Bio should be at least 10 characters',
  }),
  profilePicture: z.string().optional(),
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),
  socialLinks: z.object({
    github: z.string().url().optional().nullable(),
    linkedIn: z.string().url().optional().nullable(),
    twitter: z.string().url().optional().nullable(),
    portfolio: z.string().url().optional().nullable()
  })
})

export type ProfileFormData = z.infer<typeof profileSchema>
