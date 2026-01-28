import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ok } from '../lib/apiResponse';
import * as categoriesService from '../modules/categories/categories.service';

export const getCategories = async (req: Request, res: Response) => {
    const categories = await categoriesService.getCategories();
    res.status(StatusCodes.OK).json(
        ok(categories, 'Categories fetched', req.headers['x-request-id'] as string | undefined),
    );
};

export const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body as { name: string };
    const category = await categoriesService.createCategory(name);
    res.status(StatusCodes.CREATED).json(
        ok(category, 'Category created', req.headers['x-request-id'] as string | undefined),
    );
};
