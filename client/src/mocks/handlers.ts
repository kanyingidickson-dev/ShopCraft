import { http, HttpResponse, delay } from 'msw';
import type {
    ApiResponse,
    Order,
    OrderItem,
    OrderStatus,
    PaginatedResult,
    Product,
    User,
} from '../services/api';
import { categories, products as seededProducts } from './data/catalog';

const randomDelay = async (minMs = 250, maxMs = 900) => {
    const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    await delay(ms);
};

const base64UrlEncode = (value: string) =>
    btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

const base64UrlDecode = (value: string) => {
    const padded = value
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(value.length / 4) * 4, '=');
    return atob(padded);
};

const makeToken = (payload: { email: string; name?: string; role?: string }) => {
    const json = JSON.stringify(payload);
    return `demo.${base64UrlEncode(json)}`;
};

const parseToken = (token: string | null | undefined) => {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 2 || parts[0] !== 'demo') return null;

    try {
        const decoded = base64UrlDecode(parts[1]);
        return JSON.parse(decoded) as { email: string; name?: string; role?: string };
    } catch {
        return null;
    }
};

const getBearerToken = (request: Request) => {
    const auth = request.headers.get('authorization');
    if (!auth) return null;
    const [scheme, token] = auth.split(' ');
    if (scheme?.toLowerCase() !== 'bearer') return null;
    return token || null;
};

const ok = <T>(data: T, message = 'OK'): ApiResponse<T> => ({
    success: true,
    message,
    data,
});

const fail = (message: string, errors?: unknown): ApiResponse<never> => ({
    success: false,
    message,
    errors,
});

let inMemoryProducts: Product[] = [...seededProducts];
let inMemoryOrders: Order[] = [];

const paginate = <T>(items: T[], page: number, limit: number): PaginatedResult<T> => {
    const safeLimit = Math.max(1, limit);
    const safePage = Math.max(1, page);
    const start = (safePage - 1) * safeLimit;
    const paged = items.slice(start, start + safeLimit);

    return {
        items: paged,
        page: safePage,
        limit: safeLimit,
        total: items.length,
        totalPages: Math.max(1, Math.ceil(items.length / safeLimit)),
    };
};

const requireUser = (request: Request): User | null => {
    const token = getBearerToken(request);
    const payload = parseToken(token);
    if (!payload?.email) return null;

    const role = payload.role ?? (payload.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER');

    return {
        id: `u_${payload.email.toLowerCase()}`,
        email: payload.email,
        name: payload.name ?? null,
        role,
    };
};

const nowIso = () => new Date().toISOString();

const seedOrdersIfNeeded = () => {
    if (inMemoryOrders.length > 0) return;

    const demoAdmin: User = {
        id: 'u_admin',
        email: 'admin@shopcraft.demo',
        name: 'Admin',
        role: 'ADMIN',
    };

    const demoUser: User = {
        id: 'u_demo',
        email: 'demo@shopcraft.demo',
        name: 'Demo User',
        role: 'USER',
    };

    const order1: Order = {
        id: 'o1',
        userId: demoUser.id,
        user: demoUser,
        status: 'PAID',
        total: 149.99,
        items: [
            {
                id: 'oi1',
                quantity: 1,
                price: 149.99,
                product: inMemoryProducts[0],
            },
        ],
        createdAt: nowIso(),
    };

    const order2: Order = {
        id: 'o2',
        userId: demoAdmin.id,
        user: demoAdmin,
        status: 'PENDING',
        total: 199.0,
        items: [
            {
                id: 'oi2',
                quantity: 1,
                price: 199.0,
                product: inMemoryProducts[1],
            },
        ],
        createdAt: nowIso(),
    };

    inMemoryOrders = [order1, order2];
};

export const handlers = [
    http.get('/api/v1/products', async ({ request }) => {
        await randomDelay();

        const url = new URL(request.url);
        const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
        const categoryId = (url.searchParams.get('categoryId') ?? '').trim();
        const minPriceRaw = url.searchParams.get('minPrice');
        const maxPriceRaw = url.searchParams.get('maxPrice');
        const minPrice = minPriceRaw ? Number(minPriceRaw) : null;
        const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : null;
        const sort = (url.searchParams.get('sort') ?? 'createdAt') as
            | 'createdAt'
            | 'price'
            | 'name'
            | 'rating';
        const order = (url.searchParams.get('order') ?? 'desc') as 'asc' | 'desc';
        const page = Number(url.searchParams.get('page') ?? 1);
        const limit = Number(url.searchParams.get('limit') ?? 20);

        let items = [...inMemoryProducts];

        if (q) {
            items = items.filter((p) =>
                [p.name, p.description, p.category?.name]
                    .filter(Boolean)
                    .some((v) => String(v).toLowerCase().includes(q)),
            );
        }

        if (categoryId) {
            items = items.filter((p) => p.category?.id === categoryId);
        }

        if (minPrice !== null && !Number.isNaN(minPrice)) {
            items = items.filter((p) => Number(p.price) >= minPrice);
        }

        if (maxPrice !== null && !Number.isNaN(maxPrice)) {
            items = items.filter((p) => Number(p.price) <= maxPrice);
        }

        if (sort === 'name') {
            items.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'price') {
            items.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sort === 'rating') {
            items.sort((a, b) => Number(a.rating ?? 0) - Number(b.rating ?? 0));
        }

        if (order === 'desc') {
            items.reverse();
        }

        const paged = paginate(items, page, limit);
        const body = ok<PaginatedResult<Product>>(paged);
        return HttpResponse.json(body);
    }),

    http.get('/api/v1/products/:id', async ({ params }) => {
        await randomDelay();

        const product = inMemoryProducts.find((p) => p.id === params.id);
        if (!product) {
            return HttpResponse.json(fail('Product not found'), { status: 404 });
        }

        return HttpResponse.json(ok<Product>(product));
    }),

    http.post('/api/v1/products', async ({ request }) => {
        await randomDelay();

        const user = requireUser(request);
        if (!user || user.role !== 'ADMIN') {
            return HttpResponse.json(fail('Unauthorized'), { status: 401 });
        }

        const payload = (await request.json()) as {
            name: string;
            description: string;
            price: number | string;
            stock: number;
            categoryId?: string;
        };

        const category = categories.find((c) => c.id === payload.categoryId);
        const created: Product = {
            id: `p_${Math.random().toString(16).slice(2)}`,
            name: payload.name,
            description: payload.description,
            price: payload.price,
            stock: payload.stock,
            category,
        };

        inMemoryProducts = [created, ...inMemoryProducts];
        return HttpResponse.json(ok<Product>(created), { status: 201 });
    }),

    http.get('/api/v1/categories', async () => {
        await randomDelay();
        return HttpResponse.json(ok(categories));
    }),

    http.post('/api/v1/categories', async ({ request }) => {
        await randomDelay();

        const user = requireUser(request);
        if (!user || user.role !== 'ADMIN') {
            return HttpResponse.json(fail('Unauthorized'), { status: 401 });
        }

        const payload = (await request.json()) as { name: string };
        const created = { id: `c_${Math.random().toString(16).slice(2)}`, name: payload.name };
        categories.push(created);
        return HttpResponse.json(ok(created), { status: 201 });
    }),

    http.post('/api/v1/auth/register', async ({ request }) => {
        await randomDelay();

        const payload = (await request.json()) as { email: string; password: string; name: string };

        const role = payload.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
        const accessToken = makeToken({ email: payload.email, name: payload.name, role });

        const user: User = {
            id: `u_${payload.email.toLowerCase()}`,
            email: payload.email,
            name: payload.name,
            role,
        };

        return HttpResponse.json(ok({ user, accessToken }, 'Registered'), { status: 201 });
    }),

    http.post('/api/v1/auth/login', async ({ request }) => {
        await randomDelay();

        const payload = (await request.json()) as { email: string; password: string };

        const role = payload.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
        const accessToken = makeToken({ email: payload.email, role });

        const user: User = {
            id: `u_${payload.email.toLowerCase()}`,
            email: payload.email,
            name: payload.email.split('@')[0] || null,
            role,
        };

        return HttpResponse.json(ok({ user, accessToken }, 'Logged in'));
    }),

    http.post('/api/v1/auth/refresh', async ({ request }) => {
        await randomDelay();

        const token = getBearerToken(request);
        const parsed = parseToken(token);
        if (!parsed?.email) {
            return HttpResponse.json(fail('Unauthorized'), { status: 401 });
        }

        const email = parsed.email;
        const name = parsed.name ?? null;
        const role = parsed.role ?? (email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER');
        const accessToken = makeToken({ email, name: name ?? undefined, role });

        return HttpResponse.json(ok({ accessToken }));
    }),

    http.post('/api/v1/auth/logout', async () => {
        await randomDelay();
        return HttpResponse.json(ok({}));
    }),

    http.get('/api/v1/auth/me', async ({ request }) => {
        await randomDelay();

        const user = requireUser(request);
        if (!user) {
            return HttpResponse.json(fail('Unauthorized'), { status: 401 });
        }

        return HttpResponse.json(ok({ user }));
    }),

    http.post('/api/v1/orders', async ({ request }) => {
        await randomDelay(400, 1100);

        const user = requireUser(request);
        if (!user) {
            return HttpResponse.json(fail('Unauthorized'), { status: 401 });
        }

        seedOrdersIfNeeded();

        const payload = (await request.json()) as { items: OrderItem[] };

        const items = payload.items.map((item, idx) => {
            const product = inMemoryProducts.find((p) => p.id === item.productId);
            if (!product) {
                throw new Error('Invalid product');
            }
            const price = Number(product.price);
            return {
                id: `oi_${Math.random().toString(16).slice(2)}_${idx}`,
                quantity: item.quantity,
                price,
                product,
            };
        });

        const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

        const created: Order = {
            id: `o_${Math.random().toString(16).slice(2)}`,
            userId: user.id,
            user,
            status: 'PENDING',
            total,
            items,
            createdAt: nowIso(),
        };

        inMemoryOrders = [created, ...inMemoryOrders];
        return HttpResponse.json(ok<Order>(created), { status: 201 });
    }),

    http.get('/api/v1/orders/me', async ({ request }) => {
        await randomDelay();

        const user = requireUser(request);
        if (!user) {
            return HttpResponse.json(fail('Unauthorized'), { status: 401 });
        }

        seedOrdersIfNeeded();
        const mine = inMemoryOrders.filter((o) => o.userId === user.id);
        return HttpResponse.json(ok(mine));
    }),

    http.get('/api/v1/orders', async ({ request }) => {
        await randomDelay();

        const user = requireUser(request);
        if (!user || user.role !== 'ADMIN') {
            return HttpResponse.json(fail('Unauthorized'), { status: 401 });
        }

        seedOrdersIfNeeded();

        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') ?? 1);
        const limit = Number(url.searchParams.get('limit') ?? 20);
        const status = url.searchParams.get('status') as OrderStatus | null;
        const userId = url.searchParams.get('userId');

        let rows = [...inMemoryOrders];

        if (status) {
            rows = rows.filter((o) => o.status === status);
        }

        if (userId) {
            rows = rows.filter((o) => o.userId === userId);
        }

        const paged = paginate(rows, page, limit);
        return HttpResponse.json(ok(paged));
    }),

    http.patch('/api/v1/orders/:orderId/status', async ({ request, params }) => {
        await randomDelay();

        const user = requireUser(request);
        if (!user || user.role !== 'ADMIN') {
            return HttpResponse.json(fail('Unauthorized'), { status: 401 });
        }

        seedOrdersIfNeeded();

        const payload = (await request.json()) as { status: OrderStatus };

        const idx = inMemoryOrders.findIndex((o) => o.id === params.orderId);
        if (idx === -1) {
            return HttpResponse.json(fail('Order not found'), { status: 404 });
        }

        const updated: Order = { ...inMemoryOrders[idx], status: payload.status };
        inMemoryOrders = [updated, ...inMemoryOrders.filter((o) => o.id !== updated.id)];
        return HttpResponse.json(ok(updated));
    }),
];
