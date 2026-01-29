import axios from 'axios';

const API_URL =
    (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_URL || '/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            typeof originalRequest.url === 'string' &&
            !originalRequest.url.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = axios
                        .post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
                        .then((refreshResponse) => {
                            const accessToken = refreshResponse.data?.data?.accessToken as
                                | string
                                | undefined;
                            if (!accessToken) {
                                throw error;
                            }
                            return accessToken;
                        })
                        .finally(() => {
                            refreshPromise = null;
                        });
                }

                const accessToken = await refreshPromise;
                if (!accessToken) {
                    throw error;
                }

                localStorage.setItem('token', accessToken);
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    },
);

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    requestId?: string;
    data?: T;
    errors?: unknown;
};

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number | string;
    rating?: number;
    reviewCount?: number;
    stock: number;
    category?: {
        id: string;
        name: string;
    };
}

export type PaginatedResult<T> = {
    items: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export interface Category {
    id: string;
    name: string;
}

export interface OrderItem {
    productId: string;
    quantity: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
    id: string;
    userId: string;
    user?: {
        id: string;
        email: string;
        name: string | null;
        role: string;
    };
    status: OrderStatus;
    total: number | string;
    items: {
        id: string;
        quantity: number;
        price: number | string;
        product: Product;
    }[];
    createdAt: string;
}

export const authAPI = {
    register: (email: string, password: string, name: string) =>
        api.post('/auth/register', { email, password, name }),
    login: (email: string, password: string) => api.post('/auth/login', { email, password }),
    refresh: () => api.post('/auth/refresh', {}),
    logout: () => api.post('/auth/logout', {}),
    me: () => api.get<ApiResponse<{ user: User }>>('/auth/me'),
};

export const productsAPI = {
    getAll: (params?: {
        page?: number;
        limit?: number;
        q?: string;
        categoryId?: string;
        minPrice?: number;
        maxPrice?: number;
        sort?: 'createdAt' | 'price' | 'name' | 'rating';
        order?: 'asc' | 'desc';
    }) => api.get<ApiResponse<PaginatedResult<Product>>>('/products', { params }),
    getById: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`),
    create: (product: Omit<Product, 'id' | 'category'> & { categoryId?: string }) =>
        api.post('/products', product),
};

export const categoriesAPI = {
    getAll: () => api.get<ApiResponse<Category[]>>('/categories'),
    create: (name: string) => api.post('/categories', { name }),
};

export const ordersAPI = {
    create: (items: OrderItem[]) => api.post('/orders', { items }),
    getMyOrders: () => api.get<ApiResponse<Order[]>>('/orders/me'),
    getAllAdmin: (params?: {
        page?: number;
        limit?: number;
        userId?: string;
        status?: OrderStatus;
    }) => api.get<ApiResponse<PaginatedResult<Order>>>('/orders', { params }),
    updateStatusAdmin: (orderId: string, status: OrderStatus) =>
        api.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status }),
};

export default api;
