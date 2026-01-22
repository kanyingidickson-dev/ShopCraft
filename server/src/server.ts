import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import prisma from './config/database';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Server is running');
});

const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down');

    server.close(async (err) => {
        if (err) {
            logger.error({ err }, 'Error closing HTTP server');
            process.exitCode = 1;
        }

        try {
            await prisma.$disconnect();
        } catch (disconnectErr) {
            logger.error({ err: disconnectErr }, 'Error disconnecting Prisma');
            process.exitCode = 1;
        } finally {
            process.exit();
        }
    });
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
