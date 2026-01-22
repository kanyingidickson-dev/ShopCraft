import { Router } from 'express';
import { createOrder, getMyOrders, getOrdersAdmin, updateOrderStatusAdmin } from '../controllers/order.controller';
import { asyncHandler } from '../lib/asyncHandler';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { AdminOrdersQuerySchema, CreateOrderSchema, UpdateOrderStatusSchema } from '../schemas/order.schemas';

const router = Router();

router.post('/', authenticate, validateBody(CreateOrderSchema), asyncHandler(createOrder));
router.get('/me', authenticate, asyncHandler(getMyOrders));
router.get('/', authenticate, authorize('ADMIN'), validateQuery(AdminOrdersQuerySchema), asyncHandler(getOrdersAdmin));
router.patch(
    '/:id/status',
    authenticate,
    authorize('ADMIN'),
    validateBody(UpdateOrderStatusSchema),
    asyncHandler(updateOrderStatusAdmin)
);

export default router;
