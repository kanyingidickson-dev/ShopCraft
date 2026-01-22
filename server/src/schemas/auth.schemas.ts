import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    name: z.string().min(1).max(100).optional(),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1).max(128),
});
