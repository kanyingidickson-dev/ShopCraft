import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category?: {
        id: string;
        name: string;
    };
}

export interface Category {
    id: string;
    name: string;
}

export interface OrderItem {
    productId: string;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    status: string;
    total: number;
    items: {
        id: string;
        quantity: number;
        price: number;
        product: Product;
    }[];
    createdAt: string;
}

export const authAPI = {
    register: (email: string, password: string, name: string) =>
        api.post('/auth/register', { email, password, name }),
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
};

export const productsAPI = {
    getAll: () => api.get<{ data: Product[] }>('/products'),
    getById: (id: string) => api.get<{ data: Product }>(`/products/${id}`),
    create: (product: Omit<Product, 'id' | 'category'> & { categoryId?: string }) =>
        api.post('/products', product),
};

export const categoriesAPI = {
    getAll: () => api.get<{ data: Category[] }>('/categories'),
    create: (name: string) => api.post('/categories', { name }),
};

export const ordersAPI = {
    create: (userId: string, items: OrderItem[]) =>
        api.post('/orders', { userId, items }),
    getUserOrders: (userId: string) =>
        api.get<{ data: Order[] }>(`/orders/user/${userId}`),
};

export default api;
