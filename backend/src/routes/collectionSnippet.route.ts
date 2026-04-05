import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as ctrl from '../controllers/collectionSnippetController';

const router = Router();

router.get('/:collectionId/snippets', authenticate, ctrl.list);
router.post('/:collectionId/snippets/:snippetId', authenticate, ctrl.add);
router.delete('/:collectionId/snippets/:snippetId', authenticate, ctrl.remove);

export default router;
