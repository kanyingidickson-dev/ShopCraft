import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const RawEnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(5000),
    DATABASE_URL: z
        .string()
        .min(1)
        .default('postgresql://postgres:postgres@localhost:5432/shopcraft?schema=public'),
    JWT_SECRET: z.string().min(32).optional(),
    ACCESS_TOKEN_TTL: z.string().default('15m'),
    REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
    CORS_ORIGINS: z.string().default('http://localhost:5173'),
});

const rawEnv = RawEnvSchema.parse(process.env);

const isProduction = rawEnv.NODE_ENV === 'production';

export const env = {
    ...rawEnv,
    JWT_SECRET:
        rawEnv.JWT_SECRET ??
        (isProduction
            ? (() => {
                  throw new Error('JWT_SECRET must be set in production');
              })()
            : 'dev-only-jwt-secret-change-me-change-me-change-me'),
} as const;
