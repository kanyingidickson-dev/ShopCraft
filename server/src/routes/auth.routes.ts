import { Router } from 'express';
import { login, logout, me, refresh, register } from '../controllers/auth.controller';
import { asyncHandler } from '../lib/asyncHandler';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { LoginSchema, RegisterSchema } from '../schemas/auth.schemas';

const router = Router();

router.post('/register', validateBody(RegisterSchema), asyncHandler(register));
router.post('/login', validateBody(LoginSchema), asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));
router.get('/me', authenticate, asyncHandler(me));

export default router;
