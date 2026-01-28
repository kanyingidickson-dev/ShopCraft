import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ForbiddenError, UnauthorizedError } from '../lib/errors';

export interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedError('Authentication required');
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch {
        next(new UnauthorizedError('Invalid or expired token'));
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            next(new ForbiddenError('Insufficient permissions'));
            return;
        }
        next();
    };
};
