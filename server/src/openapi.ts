export const openapi = {
    openapi: '3.0.3',
    info: {
        title: 'ShopCraft API',
        version: '1.0.0',
    },
    servers: [{ url: '/api/v1' }],
    paths: {
        '/auth/register': {},
        '/auth/login': {},
        '/auth/refresh': {},
        '/auth/logout': {},
        '/auth/me': {},
        '/products': {},
        '/products/{id}': {},
        '/categories': {},
        '/orders': {},
        '/orders/me': {},
    },
} as const;
