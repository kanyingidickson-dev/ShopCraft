import { Router } from 'express';
import { createOrder, getUserOrders } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/user/:userId', authenticate, getUserOrders);

export default router;
