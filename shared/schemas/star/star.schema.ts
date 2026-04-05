import { z } from 'zod';
import { baseSchema } from '../base.schema';

export const starSchema = baseSchema.extend({
  userId: z.string().readonly(),
  snippetId: z.string().min(1),
});

export type Star = z.infer<typeof starSchema>;
