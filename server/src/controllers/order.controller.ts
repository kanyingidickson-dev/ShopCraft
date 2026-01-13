import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../config/database';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, items } = req.body;

        let total = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (!product) {
                res.status(StatusCodes.BAD_REQUEST).json({ error: `Product ${item.productId} not found` });
                return;
            }

            if (product.stock < item.quantity) {
                res.status(StatusCodes.BAD_REQUEST).json({ error: `Insufficient stock for ${product.name}` });
                return;
            }

            const itemTotal = Number(product.price) * item.quantity;
            total += itemTotal;

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });
        }

        const order = await prisma.order.create({
            data: {
                userId,
                total,
                items: {
                    create: orderItems
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            });
        }

        res.status(StatusCodes.CREATED).json({ data: order });
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create order' });
    }
};

export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(StatusCodes.OK).json({ data: orders });
    } catch (error) {
        console.error('Get User Orders Error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch orders' });
    }
};
