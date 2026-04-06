import { z } from "zod";
import { baseSchema } from "../base.schema";

export const snippetSchema = baseSchema.extend({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  code: z.string().min(1),
  language: z.string().min(1),
  isPublic: z.boolean().default(true),
  gistUrl: z.string().url().optional().nullable().readonly(),
  authorId: z.string().readonly(),
});

export type Snippet = z.infer<typeof snippetSchema>;

export const searchSnippetsResponseSchema = z.object({
  snippets: z.array(
    snippetSchema.extend({
      _count: z.object({ stars: z.number() }),
    }),
  ),
  success: z.literal(true),
});

export type SearchSnippetsResponse = z.infer<
  typeof searchSnippetsResponseSchema
>;
