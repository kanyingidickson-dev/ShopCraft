import type { Prisma } from '@prisma/client';
import { NotFoundError } from '../../lib/errors';
import * as productsRepository from './products.repository';

export type ProductListParams = {
    page: number;
    limit: number;
    q?: string;
    sort?: 'createdAt' | 'price' | 'name';
    order?: 'asc' | 'desc';
};

export const listProducts = async (params: ProductListParams) => {
    const page = Math.max(1, params.page);
    const limit = Math.min(100, Math.max(1, params.limit));
    const q = params.q?.trim() ?? '';
    const sort = params.sort ?? 'createdAt';
    const order = params.order ?? 'desc';

    const where: Prisma.ProductWhereInput = q
        ? {
              OR: [
                  { name: { contains: q, mode: 'insensitive' } },
                  { description: { contains: q, mode: 'insensitive' } },
              ],
          }
        : {};

    const orderBy: Prisma.ProductOrderByWithRelationInput =
        sort === 'price'
            ? { price: order === 'asc' ? 'asc' : 'desc' }
            : sort === 'name'
              ? { name: order === 'asc' ? 'asc' : 'desc' }
              : { createdAt: order === 'asc' ? 'asc' : 'desc' };

    const [total, items] = await Promise.all([
        productsRepository.countProducts(where),
        productsRepository.findProducts({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
        }),
    ]);

    return {
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
};

export const createProduct = async (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId?: string;
}) => {
    return productsRepository.createProduct(data);
};

export const getProductById = async (id: string) => {
    const product = await productsRepository.findProductById(id);

    if (!product) {
        throw new NotFoundError('Product not found');
    }

    return product;
};
