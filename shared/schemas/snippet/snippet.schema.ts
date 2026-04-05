import { z } from 'zod';
import { baseSchema } from '../base.schema';

export const snippetSchema = baseSchema.extend({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  code: z.string().min(1),
  language: z.string().min(1),
  isPublic: z.boolean().default(true),
  authorId: z.string().readonly(),
});

export type Snippet = z.infer<typeof snippetSchema>;
