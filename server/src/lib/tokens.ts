import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type AccessTokenPayload = {
    userId: string;
    role: string;
};

export const signAccessToken = (payload: AccessTokenPayload) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL });
};

export const generateRefreshToken = () => {
    const token = crypto.randomBytes(48).toString('base64url');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return { token, tokenHash };
};
