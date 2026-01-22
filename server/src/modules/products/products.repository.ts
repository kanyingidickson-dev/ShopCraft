import type { Prisma } from '@prisma/client';
import prisma from '../../config/database';

export const countProducts = (where: Prisma.ProductWhereInput) => {
    return prisma.product.count({ where });
};

export const findProducts = (args: {
    where: Prisma.ProductWhereInput;
    orderBy: Prisma.ProductOrderByWithRelationInput;
    skip: number;
    take: number;
}) => {
    const { where, orderBy, skip, take } = args;

    return prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take,
    });
};

export const createProduct = (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId?: string;
}) => {
    return prisma.product.create({
        data,
    });
};

export const findProductById = (id: string) => {
    return prisma.product.findUnique({
        where: { id },
        include: { category: true },
    });
};
