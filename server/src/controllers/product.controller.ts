import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ok } from '../lib/apiResponse';
import * as productsService from '../modules/products/products.service';

export const getProducts = async (req: Request, res: Response) => {
    const query = req.query as unknown as {
        page: number;
        limit: number;
        q?: string;
        sort: 'createdAt' | 'price' | 'name';
        order: 'asc' | 'desc';
    };

    const result = await productsService.listProducts({
        page: query.page,
        limit: query.limit,
        q: query.q,
        sort: query.sort,
        order: query.order,
    });

    res.status(StatusCodes.OK).json(
        ok(
            {
                items: result.items,
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
            },
            'Products fetched',
            req.headers['x-request-id'] as string | undefined,
        ),
    );
};

export const createProduct = async (req: Request, res: Response) => {
    const { name, description, price, stock, categoryId } = req.body as {
        name: string;
        description: string;
        price: number;
        stock: number;
        categoryId?: string;
    };

    const product = await productsService.createProduct({
        name,
        description,
        price,
        stock,
        categoryId,
    });

    res.status(StatusCodes.CREATED).json(
        ok(product, 'Product created', req.headers['x-request-id'] as string | undefined),
    );
};

export const getProductById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const product = await productsService.getProductById(id);

    res.status(StatusCodes.OK).json(
        ok(product, 'Product fetched', req.headers['x-request-id'] as string | undefined),
    );
};
