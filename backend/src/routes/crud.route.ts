import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import * as crud from '../controllers/crudController';
import {
  userSchema,
  snippetSchema,
  collectionSchema,
  starSchema,
  forkSchema,
} from '@devhub/shared-schemas/schemas';

const schemas: Record<string, z.ZodType> = {
  user: userSchema,
  snippet: snippetSchema,
  collection: collectionSchema,
  star: starSchema,
  fork: forkSchema,
};

const validateModel = (req: Request, res: Response, next: NextFunction) => {
  const schema = schemas[req.params.model];
  if (!schema) return next();

  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Validation failed', details: result.error.issues });
    return;
  }
  req.body = result.data;
  next();
};

const router = Router();

router.get('/:model', authenticate, crud.list);
router.get('/:model/:id', authenticate, crud.getById);
router.post('/:model', authenticate, validateModel, crud.create);
router.put('/:model/:id', authenticate, validateModel, crud.update);
router.delete('/:model/:id', authenticate, crud.remove);

export default router;
