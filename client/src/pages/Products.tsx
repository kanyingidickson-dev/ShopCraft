import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../services/api';
import { useCart } from '../context/CartContext';
import { useProductsQuery } from '../hooks/useProducts';

const Products: React.FC = () => {
    const [searchParams] = useSearchParams();
    const q = (searchParams.get('q') ?? '').trim();

    const { data: products = [], isLoading: loading, isError: isErrorLoading } = useProductsQuery({
        page: 1,
        limit: 48,
        q: q || undefined,
        sort: 'createdAt',
        order: 'desc',
    });
    const [notification, setNotification] = useState('');
    const { addToCart } = useCart();

    const makePlaceholderDataUrl = (name: string, category?: string) => {
        const title = category ? `${category} · ${name}` : name;
        const initials = name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0]!.toUpperCase())
            .join('');

        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#E2E8F0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#g)"/>
  <rect x="40" y="40" width="720" height="920" rx="48" fill="#FFFFFF" opacity="0.65"/>
  <text x="80" y="140" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="28" font-weight="700" fill="#334155">${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
  <text x="400" y="560" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="140" font-weight="800" fill="#0F172A" opacity="0.9">${initials || 'SC'}</text>
  <text x="400" y="640" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="24" font-weight="600" fill="#475569" opacity="0.9">ShopCraft</text>
</svg>`;

        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };

    const getProductImageSrc = (product: Product) => {
        const baseUrl = import.meta.env.BASE_URL;
        const images: Record<string, string> = {
            'Wireless Headphones': `${baseUrl}images/headphones.png`,
            'Smart Watch': `${baseUrl}images/watch.png`,
            'Running Shoes': `${baseUrl}images/shoes.png`,
            'Laptop Stand': `${baseUrl}images/laptop_stand.png`,
            'Coffee Maker': `${baseUrl}images/coffee_maker.png`,
            'LED Desk Lamp': `${baseUrl}images/lamp.png`,
        };

        return images[product.name] ?? makePlaceholderDataUrl(product.name, product.category?.name);
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        setNotification(`${product.name} added to cart!`);
        setTimeout(() => setNotification(''), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-500 font-medium">
                        Elevating your shopping experience...
                    </p>
                </div>
            </div>
        );
    }

    if (isErrorLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-gray-600 mb-6">Failed to load products</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-16">
            {notification && (
                <div className="fixed top-24 right-8 bg-gray-900/90 backdrop-blur-md text-white px-8 py-4 rounded-2xl shadow-2xl z-50 animate-slide-in flex items-center space-x-3 border border-gray-800">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <span className="font-medium">{notification}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0 text-left">
                    <div>
                        <h1 className="text-5xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                            Premium Collection
                        </h1>
                        <p className="text-lg text-gray-500 font-medium max-w-lg">
                            Expertly curated products designed to elevate your lifestyle and empower
                            your productivity.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-semibold text-gray-400">
                        <span>Home</span>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                        <span className="text-blue-600">Products</span>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-24 text-center shadow-lg border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <span className="text-5xl">📦</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            No products available
                        </h3>
                        <p className="text-gray-500 text-lg mb-8">
                            We're currently updating our catalog with new premium arrivals.
                        </p>
                        <button
                            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            onClick={() => window.location.reload()}
                        >
                            Refresh
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-blue-50 overflow-hidden flex flex-col"
                            >
                                <div className="relative aspect-[4/5] bg-[#F1F5F9] overflow-hidden">
                                    <img
                                        src={getProductImageSrc(product)}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-4 left-4">
                                        {product.category && (
                                            <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50/90 backdrop-blur-md rounded-full border border-blue-100 shadow-sm">
                                                {product.category.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-[#1E293B] mb-2 group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed font-medium">
                                        {product.description}
                                    </p>

                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                    Price
                                                </span>
                                                <span className="text-2xl font-black text-[#0F172A]">
                                                    ${Number(product.price).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                                    Availability
                                                </span>
                                                <span
                                                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${product.stock > 10 ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}
                                                >
                                                    {product.stock > 0
                                                        ? `${product.stock} Units`
                                                        : 'Sold Out'}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock === 0}
                                            className="w-full py-4 px-6 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-xl active:scale-95 flex items-center justify-center space-x-2 group/btn"
                                        >
                                            <span>
                                                {product.stock === 0
                                                    ? 'Out of Stock'
                                                    : 'Add to Collection'}
                                            </span>
                                            <svg
                                                className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
