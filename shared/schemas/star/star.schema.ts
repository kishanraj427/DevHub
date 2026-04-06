import { z } from "zod";
import { baseSchema } from "../base.schema";

export const starSchema = baseSchema.extend({
  userId: z.string().readonly(),
  snippetId: z.string().min(1),
});

export type Star = z.infer<typeof starSchema>;

export const toggleStarResponseSchema = z.object({
  starred: z.boolean(),
  message: z.string(),
  success: z.literal(true),
});

export type ToggleStarResponse = z.infer<typeof toggleStarResponseSchema>;

export const starsCountResponseSchema = z.object({
  count: z.number(),
  success: z.literal(true),
});

export type StarsCountResponse = z.infer<typeof starsCountResponseSchema>;