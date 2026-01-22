import { OrderStatus, Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import * as ordersRepository from './orders.repository';

export type OrderItemInput = {
    productId: string;
    quantity: number;
};

export const createOrder = async (userId: string, items: OrderItemInput[]) => {
    if (!items || items.length === 0) {
        throw new BadRequestError('Order items are required');
    }

    return prisma.$transaction(async (tx) => {
        let total = 0;
        const orderItems: Array<{ productId: string; quantity: number; price: Prisma.Decimal }> = [];

        for (const item of items) {
            const product = await ordersRepository.findProductById(tx, item.productId);

            if (!product) {
                throw new BadRequestError(`Product ${item.productId} not found`);
            }

            const updated = await ordersRepository.decrementProductStockIfAvailable(tx, {
                productId: item.productId,
                quantity: item.quantity,
            });

            if (updated.count !== 1) {
                throw new BadRequestError(`Insufficient stock for ${product.name}`);
            }

            total += Number(product.price) * item.quantity;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            });
        }

        return ordersRepository.createOrderWithItems(tx, { userId, total, items: orderItems });
    });
};

export const getOrdersForUser = async (userId: string) => {
    return ordersRepository.findOrdersByUserId(userId);
};

export type AdminOrdersListParams = {
    page: number;
    limit: number;
    userId?: string;
    status?: OrderStatus;
};

export const listOrdersAdmin = async (params: AdminOrdersListParams) => {
    const page = Math.max(1, params.page);
    const limit = Math.min(100, Math.max(1, params.limit));

    const status = params.status;

    const where: Prisma.OrderWhereInput = {
        ...(params.userId ? { userId: params.userId } : {}),
        ...(status ? { status } : {}),
    };

    const [total, items] = await Promise.all([
        ordersRepository.countOrders(where),
        ordersRepository.findOrders({
            where,
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

export const updateOrderStatusAdmin = async (orderId: string, status: OrderStatus) => {
    const existing = await ordersRepository.findOrderByIdAdmin(orderId);
    if (!existing) {
        throw new NotFoundError('Order not found');
    }

    return ordersRepository.updateOrderStatusAdmin(orderId, status);
};
