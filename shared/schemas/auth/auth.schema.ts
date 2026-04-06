import { z } from "zod";
import { baseSchema } from "../base.schema";

export const signupInputSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const userSchema = baseSchema.extend({
  email: z.email(),
  lastLoginAt: z.iso.datetime().optional().readonly(),
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

export type SignupInput = z.infer<typeof signupInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
