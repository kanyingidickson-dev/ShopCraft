import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { StatusCodes } from 'http-status-codes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import orderRoutes from './routes/order.routes';
import authRoutes from './routes/auth.routes';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorMiddleware } from './middleware/error.middleware';
import { openapi } from './openapi';

const app: Application = express();

app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(
    cors({
        origin: env.CORS_ORIGINS.split(',').map((s) => s.trim()),
        credentials: true,
    })
);
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 300,
        standardHeaders: true,
        legacyHeaders: false,
    })
);

app.use((req, res, next) => {
    const existing = req.headers['x-request-id'];
    const requestId = typeof existing === 'string' && existing.trim().length > 0 ? existing : crypto.randomUUID();

    (req.headers as Record<string, unknown>)['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);

    next();
});
app.use(
    pinoHttp({
        logger,
        customProps: (req) => ({
            requestId: req.headers['x-request-id'],
        }),
    })
);

// Routes
app.use('/api/v1/auth', authRoutes);
app.get('/api/v1/openapi.json', (req, res) => res.status(StatusCodes.OK).json(openapi));
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(StatusCodes.OK).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'ShopCraft API',
    });
});

app.use(errorMiddleware);

export default app;
