import { env } from './env';

export const refreshTokenCookieName = 'refresh_token';

export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/api/v1/auth',
};
