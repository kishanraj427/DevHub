import { z } from "zod";
import { baseSchema } from "../base.schema";

export const collectionSchema = baseSchema.extend({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  ownerId: z.string().readonly(),
});

export type Collection = z.infer<typeof collectionSchema>;
