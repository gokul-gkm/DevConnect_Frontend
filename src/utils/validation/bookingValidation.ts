import { z } from "zod";

export const bookingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters")
    .refine(
      (value) => /[A-Za-z]{3,}/.test(value),
      "Title must contain meaningful words"
    ),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must not exceed 500 characters")
    .refine(
      (value) => value.split(/\s+/).length >= 5,
      "Description must contain at least 5 words"
    )
    .refine(
      (value) => {
        const lettersCount = value.replace(/[^A-Za-z]/g, "").length;
        return lettersCount >= 15;
      },
      "Description must contain meaningful text"
  ),

  topics: z
    .array(z.string().trim().min(1))
    .min(1, "Select at least one topic")
    .max(5, "Maximum 5 topics allowed"),

  time: z.string({
    required_error: "Please select a time slot",
  }),

  duration: z
    .number({
      required_error: "Duration is required",
      invalid_type_error: "Duration must be a number",
    })
    .min(30, "Minimum duration is 30 minutes")
    .max(120, "Maximum duration is 120 minutes"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
