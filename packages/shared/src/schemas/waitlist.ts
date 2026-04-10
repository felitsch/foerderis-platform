import { z } from "zod";

export const waitlistFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters"),
});

export type WaitlistFormData = z.infer<typeof waitlistFormSchema>;
