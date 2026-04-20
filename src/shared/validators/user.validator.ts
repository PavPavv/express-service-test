import { z } from "zod";

import { EMAIL_REGEX, ISO_DATE_REGEX } from '../consts';

export const createUserSchema = z.object({
  email: z.string().regex(EMAIL_REGEX, "Invalid email"),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.string().regex(ISO_DATE_REGEX, "Invalid date"),
});

export const loginSchema = z.object({
  email: z.string().regex(EMAIL_REGEX, "Invalid email"),
  password: z.string(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  birthDate: z
    .string()
    .regex(ISO_DATE_REGEX, "Invalid date")
    .transform((str) => new Date(str))
    .optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
