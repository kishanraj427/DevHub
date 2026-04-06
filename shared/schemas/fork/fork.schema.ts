import { z } from "zod";
import { baseSchema } from "../base.schema";

export const forkSchema = baseSchema.extend({
  originalSnippetId: z.string().min(1),
  newSnippetId: z.string().readonly(),
  userId: z.string().readonly(),
});

export type Fork = z.infer<typeof forkSchema>;

export const createForkResponseSchema = z.object({
  message: z.string(),
  fork: forkSchema,
  success: z.literal(true),
});

export type CreateForkResponse = z.infer<typeof createForkResponseSchema>;

export const forkCountResponseSchema = z.object({
  count: z.number(),
  success: z.literal(true),
});

export type ForkCountResponse = z.infer<typeof forkCountResponseSchema>;
