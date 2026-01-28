import type { Category, Product } from '../../services/api';

export const categories: Category[] = [
    { id: 'c1', name: 'Audio' },
    { id: 'c2', name: 'Wearables' },
    { id: 'c3', name: 'Accessories' },
    { id: 'c4', name: 'Home' },
];

export const products: Product[] = [
    {
        id: 'p1',
        name: 'Wireless Headphones',
        description: 'Noise-cancelling over-ear headphones with premium sound and all-day comfort.',
        price: 149.99,
        stock: 12,
        category: categories[0],
    },
    {
        id: 'p2',
        name: 'Smart Watch',
        description:
            'A sleek smartwatch with fitness tracking, notifications, and long battery life.',
        price: 199.0,
        stock: 7,
        category: categories[1],
    },
    {
        id: 'p3',
        name: 'Running Shoes',
        description: 'Lightweight performance runners designed for daily training and comfort.',
        price: 129.5,
        stock: 18,
        category: categories[2],
    },
    {
        id: 'p4',
        name: 'Laptop Stand',
        description: 'Ergonomic aluminum laptop stand for better posture and desk aesthetics.',
        price: 59.99,
        stock: 9,
        category: categories[2],
    },
    {
        id: 'p5',
        name: 'Coffee Maker',
        description: 'Compact coffee maker with programmable brew and consistent extraction.',
        price: 89.0,
        stock: 5,
        category: categories[3],
    },
    {
        id: 'p6',
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with warm/cool modes and a minimal footprint.',
        price: 39.99,
        stock: 14,
        category: categories[3],
    },
];
