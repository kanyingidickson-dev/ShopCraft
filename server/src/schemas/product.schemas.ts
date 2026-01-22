import { z } from 'zod';

export const CreateProductSchema = z.object({
    name: z.string().min(1).max(200),
    description: z.string().min(1).max(5000),
    price: z.number().positive(),
    stock: z.number().int().min(0),
    categoryId: z.string().uuid().optional(),
});

export const ProductListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().trim().min(1).optional(),
    sort: z.enum(['createdAt', 'price', 'name']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
});
