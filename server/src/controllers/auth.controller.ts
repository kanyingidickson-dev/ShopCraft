import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/database';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/env';
import { refreshTokenCookieName, refreshTokenCookieOptions } from '../config/cookies';
import { ok } from '../lib/apiResponse';
import { NotFoundError, ConflictError, UnauthorizedError } from '../lib/errors';
import { generateRefreshToken, signAccessToken } from '../lib/tokens';
import type { AuthRequest } from '../middleware/auth.middleware';

const revokeAllRefreshTokensForUser = async (userId: string) => {
    await prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
    });
};

export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body as {
        email: string;
        password: string;
        name?: string;
    };

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new ConflictError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    const accessToken = signAccessToken({ userId: user.id, role: user.role });

    const { token: refreshToken, tokenHash } = generateRefreshToken();
    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            tokenHash,
            expiresAt,
        },
    });

    res.cookie(refreshTokenCookieName, refreshToken, {
        ...refreshTokenCookieOptions,
        maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.CREATED).json(
        ok(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                accessToken,
            },
            'User registered',
            req.headers['x-request-id'] as string | undefined,
        ),
    );
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });

    const { token: refreshToken, tokenHash } = generateRefreshToken();
    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            tokenHash,
            expiresAt,
        },
    });

    res.cookie(refreshTokenCookieName, refreshToken, {
        ...refreshTokenCookieOptions,
        maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json(
        ok(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                accessToken,
            },
            'Logged in',
            req.headers['x-request-id'] as string | undefined,
        ),
    );
};

export const refresh = async (req: Request, res: Response) => {
    const refreshToken = (req as Request & { cookies?: Record<string, string> }).cookies?.[
        refreshTokenCookieName
    ];

    if (!refreshToken) {
        throw new UnauthorizedError('Refresh token missing');
    }

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const existing = await prisma.refreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
    });

    if (!existing) {
        throw new UnauthorizedError('Invalid refresh token');
    }

    if (existing.expiresAt <= new Date()) {
        throw new UnauthorizedError('Invalid refresh token');
    }

    if (existing.revokedAt) {
        await revokeAllRefreshTokensForUser(existing.userId);
        throw new UnauthorizedError('Invalid refresh token');
    }

    const now = new Date();
    const { token: nextRefreshToken, tokenHash: nextHash } = generateRefreshToken();
    const nextExpiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    const rotated = await prisma.$transaction(async (tx) => {
        const updateResult = await tx.refreshToken.updateMany({
            where: { id: existing.id, revokedAt: null },
            data: { revokedAt: now },
        });

        if (updateResult.count !== 1) {
            return false;
        }

        await tx.refreshToken.create({
            data: {
                userId: existing.userId,
                tokenHash: nextHash,
                expiresAt: nextExpiresAt,
            },
        });

        return true;
    });

    if (!rotated) {
        await revokeAllRefreshTokensForUser(existing.userId);
        throw new UnauthorizedError('Invalid refresh token');
    }

    const accessToken = signAccessToken({ userId: existing.userId, role: existing.user.role });

    res.cookie(refreshTokenCookieName, nextRefreshToken, {
        ...refreshTokenCookieOptions,
        maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json(
        ok({ accessToken }, 'Token refreshed', req.headers['x-request-id'] as string | undefined),
    );
};

export const logout = async (req: Request, res: Response) => {
    const refreshToken = (req as Request & { cookies?: Record<string, string> }).cookies?.[
        refreshTokenCookieName
    ];

    if (refreshToken) {
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        await prisma.refreshToken.updateMany({
            where: { tokenHash, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }

    res.clearCookie(refreshTokenCookieName, refreshTokenCookieOptions);
    res.status(StatusCodes.OK).json(
        ok(null, 'Logged out', req.headers['x-request-id'] as string | undefined),
    );
};

export const me = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        throw new UnauthorizedError('Authentication required');
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    res.status(StatusCodes.OK).json(
        ok({ user }, 'Me', req.headers['x-request-id'] as string | undefined),
    );
};
