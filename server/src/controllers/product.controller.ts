import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../config/database';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: { category: true }
        });
        res.status(StatusCodes.OK).json({ data: products });
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch products' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        // Add validation here in real app

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                categoryId
            }
        });
        res.status(StatusCodes.CREATED).json({ data: product });
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create product' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });

        if (!product) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
            return;
        }

        res.status(StatusCodes.OK).json({ data: product });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch product' });
    }
};
