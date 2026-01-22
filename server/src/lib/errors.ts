import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly details?: unknown;

    constructor(message: string, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, details?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad request', details?: unknown) {
        super(message, StatusCodes.BAD_REQUEST, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', details?: unknown) {
        super(message, StatusCodes.UNAUTHORIZED, details);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', details?: unknown) {
        super(message, StatusCodes.FORBIDDEN, details);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not found', details?: unknown) {
        super(message, StatusCodes.NOT_FOUND, details);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict', details?: unknown) {
        super(message, StatusCodes.CONFLICT, details);
    }
}
