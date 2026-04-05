import { z } from 'zod';
import { baseSchema } from '../base.schema';

export const forkSchema = baseSchema.extend({
  originalSnippetId: z.string().min(1),
  newSnippetId: z.string().readonly(),
  userId: z.string().readonly(),
});

export type Fork = z.infer<typeof forkSchema>;
