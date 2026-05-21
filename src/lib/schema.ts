import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^[\d\s\-().+]*$/,
      "Please enter a valid phone number",
    )
    .optional()
    .or(z.literal("")),
  service: z.string().optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
  preferredContact: z.enum(["email", "phone"]).optional(),
  city: z.string().optional().or(z.literal("")),
  // Honeypot field — should always be empty
  website: z.string().max(0, "Invalid submission").optional(),
  turnstileToken: z.string().min(1, "Security verification failed"),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export const contactResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type ContactResponse = z.infer<typeof contactResponseSchema>;

// Turnstile siteverify response schema
export const turnstileVerifySchema = z.object({
  success: z.boolean(),
  "error-codes": z.array(z.string()).optional(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
});
