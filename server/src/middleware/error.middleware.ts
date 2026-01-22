import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { fail } from '../lib/apiResponse';
import { AppError } from '../lib/errors';

export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    const requestId = req.headers['x-request-id'] as string | undefined;

    if (res.headersSent) {
        next(err);
        return;
    }

    if (err instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json(fail('Validation failed', err.flatten(), requestId));
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json(fail(err.message, err.details, requestId));
        return;
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(StatusCodes.CONFLICT).json(fail('Resource already exists', undefined, requestId));
            return;
        }

        res.status(StatusCodes.BAD_REQUEST).json(fail('Database error', { code: err.code }, requestId));
        return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(fail('Internal server error', undefined, requestId));
};
