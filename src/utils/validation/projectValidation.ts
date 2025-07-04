import * as z from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const projectSchema = z.object({
    title: z.string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    
    category: z.string()
        .min(2, "Category must be at least 2 characters")
        .max(50, "Category must be less than 50 characters"),
    
    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be less than 500 characters"),
    
    projectLink: z.string()
        .url("Please enter a valid URL")
        .optional()
        .or(z.literal("")),
    
    coverImage: z
    .custom<FileList | File>()
    .optional()
    .superRefine((files, ctx) => {
        if (files instanceof FileList && files.length > 0) {
            const file = files[0];
            if (file.size > MAX_FILE_SIZE) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Max file size is 5MB"
                });
            }
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Only .jpg, .jpeg, .png and .webp formats are supported"
                });
            }
        }
        return true;
    }),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;