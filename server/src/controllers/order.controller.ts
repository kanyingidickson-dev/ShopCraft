import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';
import type { OrderStatus } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth.middleware';
import { ok } from '../lib/apiResponse';
import { BadRequestError } from '../lib/errors';
import * as ordersService from '../modules/orders/orders.service';

export const createOrder = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        throw new BadRequestError('Missing authenticated user');
    }

    const { items } = req.body as { items: ordersService.OrderItemInput[] };

    const order = await ordersService.createOrder(userId, items);

    res.status(StatusCodes.CREATED).json(
        ok(order, 'Order created', req.headers['x-request-id'] as string | undefined),
    );
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        throw new BadRequestError('Missing authenticated user');
    }

    const orders = await ordersService.getOrdersForUser(userId);

    res.status(StatusCodes.OK).json(
        ok(orders, 'Orders fetched', req.headers['x-request-id'] as string | undefined),
    );
};

export const getOrdersAdmin = async (req: Request, res: Response) => {
    const query = req.query as unknown as {
        page: number;
        limit: number;
        userId?: string;
        status?: OrderStatus;
    };

    const result = await ordersService.listOrdersAdmin({
        page: query.page,
        limit: query.limit,
        userId: query.userId,
        status: query.status,
    });

    res.status(StatusCodes.OK).json(
        ok(result, 'Orders fetched', req.headers['x-request-id'] as string | undefined),
    );
};

export const updateOrderStatusAdmin = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const body = req.body as { status: OrderStatus };

    const order = await ordersService.updateOrderStatusAdmin(id, body.status);
    res.status(StatusCodes.OK).json(
        ok(order, 'Order updated', req.headers['x-request-id'] as string | undefined),
    );
};
