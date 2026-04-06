import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";
import * as crud from "../controllers/crudController";
import {
  userSchema,
  snippetSchema,
  collectionSchema,
  starSchema,
  forkSchema,
} from "@devhub/shared-schemas/schemas";

// Pre-build create schemas by omitting server-generated fields per model
const baseOmit = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

const createSchemas: Record<string, z.ZodType> = {
  user: (userSchema as any).omit({ ...baseOmit, lastLoginAt: true }),
  snippet: (snippetSchema as any).omit({ ...baseOmit, authorId: true }),
  collection: (collectionSchema as any).omit({ ...baseOmit, ownerId: true }),
  star: (starSchema as any).omit({ ...baseOmit, userId: true }),
  fork: (forkSchema as any).omit({
    ...baseOmit,
    userId: true,
    newSnippetId: true,
  }),
};

const validateModel = (req: Request, res: Response, next: NextFunction) => {
  const schema = createSchemas[req.params.model as string];
  if (!schema) return next();

  const result = schema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: result.error.issues });
    return;
  }

  req.body = result.data;
  next();
};

const router = Router();

router.get("/:model", authenticate, crud.list);
router.get("/:model/:id", authenticate, crud.getById);
router.post("/:model", authenticate, validateModel, crud.create);
router.put("/:model/:id", authenticate, validateModel, crud.update);
router.delete("/:model/:id", authenticate, crud.remove);

export default router;
