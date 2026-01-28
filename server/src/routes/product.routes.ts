import { Router } from 'express';
import { getProducts, createProduct, getProductById } from '../controllers/product.controller';
import { asyncHandler } from '../lib/asyncHandler';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { CreateProductSchema, ProductListQuerySchema } from '../schemas/product.schemas';

const router = Router();

router.get('/', validateQuery(ProductListQuerySchema), asyncHandler(getProducts));
router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validateBody(CreateProductSchema),
    asyncHandler(createProduct),
);
router.get('/:id', asyncHandler(getProductById));

export default router;
