import { z } from 'zod';

export const collectionOnSnippetsSchema = z.object({
  snippetId: z.string().min(1),
  collectionId: z.string().min(1),
  createdAt: z.iso.datetime().readonly(),
  updatedAt: z.iso.datetime().readonly(),
  deletedAt: z.iso.datetime().optional().nullable().readonly(),
});

export type CollectionOnSnippets = z.infer<typeof collectionOnSnippetsSchema>;
