import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const CreateOrderSchema = z.object({
    items: z
        .array(
            z.object({
                productId: z.string().uuid(),
                quantity: z.number().int().positive(),
            })
        )
        .min(1),
});

export const AdminOrdersQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    userId: z.string().uuid().optional(),
    status: z.nativeEnum(OrderStatus).optional(),
});

export const UpdateOrderStatusSchema = z.object({
    status: z.nativeEnum(OrderStatus),
});
