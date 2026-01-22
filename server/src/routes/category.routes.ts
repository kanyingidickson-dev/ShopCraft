import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/category.controller';
import { asyncHandler } from '../lib/asyncHandler';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { CreateCategorySchema } from '../schemas/category.schemas';

const router = Router();

router.get('/', asyncHandler(getCategories));
router.post('/', authenticate, authorize('ADMIN'), validateBody(CreateCategorySchema), asyncHandler(createCategory));

export default router;
