import type { Prisma } from '@prisma/client';
import prisma from '../../config/database';

export const findOrdersByUserId = (userId: string) => {
    return prisma.order.findMany({
        where: { userId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};

export const countOrders = (where: Prisma.OrderWhereInput) => {
    return prisma.order.count({ where });
};

export const findOrders = (args: { where: Prisma.OrderWhereInput; skip: number; take: number }) => {
    const { where, skip, take } = args;

    return prisma.order.findMany({
        where,
        include: {
            user: { select: { id: true, email: true, name: true, role: true } },
            items: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
    });
};

export const findOrderByIdAdmin = (id: string) => {
    return prisma.order.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, email: true, name: true, role: true } },
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
};

export const updateOrderStatusAdmin = (id: string, status: Prisma.OrderUpdateInput['status']) => {
    return prisma.order.update({
        where: { id },
        data: { status },
        include: {
            user: { select: { id: true, email: true, name: true, role: true } },
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
};

export const findProductById = (tx: Prisma.TransactionClient, id: string) => {
    return tx.product.findUnique({
        where: { id },
    });
};

export const decrementProductStockIfAvailable = (
    tx: Prisma.TransactionClient,
    args: { productId: string; quantity: number },
) => {
    return tx.product.updateMany({
        where: {
            id: args.productId,
            stock: { gte: args.quantity },
        },
        data: {
            stock: { decrement: args.quantity },
        },
    });
};

export const createOrderWithItems = (
    tx: Prisma.TransactionClient,
    args: {
        userId: string;
        total: number;
        items: Array<{ productId: string; quantity: number; price: Prisma.Decimal }>;
    },
) => {
    return tx.order.create({
        data: {
            userId: args.userId,
            total: args.total,
            items: {
                create: args.items,
            },
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
};
