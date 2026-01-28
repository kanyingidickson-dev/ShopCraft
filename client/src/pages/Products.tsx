import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../services/api';
import { useCart } from '../context/CartContext';
import { useProductsQuery } from '../hooks/useProducts';
import { useCategoriesQuery } from '../hooks/useCategories';

const Products: React.FC = () => {
    const [searchParams] = useSearchParams();
    const q = (searchParams.get('q') ?? '').trim();
    const categoryId = (searchParams.get('categoryId') ?? '').trim();

    const sort = (searchParams.get('sort') ?? 'createdAt') as 'createdAt' | 'price' | 'name';
    const order = (searchParams.get('order') ?? 'desc') as 'asc' | 'desc';

    const minPriceRaw = searchParams.get('minPrice');
    const maxPriceRaw = searchParams.get('maxPrice');
    const minPrice = minPriceRaw ? Number(minPriceRaw) : undefined;
    const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined;

    const { data: products = [], isLoading: loading, isError: isErrorLoading } = useProductsQuery({
        page: 1,
        limit: 48,
        q: q || undefined,
        categoryId: categoryId || undefined,
        minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
        maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
        sort,
        order,
    });
    const { data: categories = [] } = useCategoriesQuery();
    const [notification, setNotification] = useState('');
    const { addToCart } = useCart();

    const [minPriceInput, setMinPriceInput] = useState(minPriceRaw ?? '');
    const [maxPriceInput, setMaxPriceInput] = useState(maxPriceRaw ?? '');

    const escapeXml = (value: string) =>
        value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');

    const hashString = (value: string) => {
        let h = 2166136261;
        for (let i = 0; i < value.length; i++) {
            h ^= value.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    };

    const makeProductThumbDataUrl = (product: Product) => {
        const id = product.id ?? product.name;
        const categoryName = product.category?.name ?? 'Shop';

        const palettes: Record<string, { bg1: string; bg2: string; accent: string }> = {
            Electronics: { bg1: '#EEF2FF', bg2: '#E0E7FF', accent: '#1D4ED8' },
            Fashion: { bg1: '#FFF7ED', bg2: '#FFEDD5', accent: '#B45309' },
            'Home & Kitchen': { bg1: '#ECFDF5', bg2: '#D1FAE5', accent: '#047857' },
            Beauty: { bg1: '#FDF2F8', bg2: '#FCE7F3', accent: '#BE185D' },
            Books: { bg1: '#F1F5F9', bg2: '#E2E8F0', accent: '#0F172A' },
            'Sports & Outdoors': { bg1: '#ECFEFF', bg2: '#CFFAFE', accent: '#0E7490' },
            'Toys & Games': { bg1: '#FEFCE8', bg2: '#FEF9C3', accent: '#854D0E' },
            Health: { bg1: '#EFF6FF', bg2: '#DBEAFE', accent: '#1E40AF' },
        };

        const palette = palettes[categoryName] ?? { bg1: '#F8FAFC', bg2: '#E2E8F0', accent: '#0F172A' };
        const seed = hashString(`${id}:${categoryName}:${product.name}`);
        const a = 20 + (seed % 50);
        const b = 30 + ((seed >>> 8) % 50);
        const c = 40 + ((seed >>> 16) % 50);

        const safeName = escapeXml(product.name);
        const safeCategory = escapeXml(categoryName);
        const shortName = safeName.length > 28 ? `${safeName.slice(0, 27)}…` : safeName;

        const iconPaths: Record<string, string> = {
            Electronics:
                'M240 640h320c22 0 40-18 40-40V360c0-22-18-40-40-40H240c-22 0-40 18-40 40v240c0 22 18 40 40 40zm60-60V380h200v200H300z',
            Fashion:
                'M270 360l60-60h140l60 60-60 60v240H330V420l-60-60z',
            'Home & Kitchen':
                'M320 380c0-44 36-80 80-80h40c44 0 80 36 80 80v40H320v-40zm-40 80h320v180c0 44-36 80-80 80H400c-44 0-80-36-80-80V460z',
            Beauty:
                'M380 300h40v90h60v70h-160v-70h60v-90zm-40 230h200v110c0 44-36 80-80 80h-40c-44 0-80-36-80-80V530z',
            Books:
                'M300 320h220c33 0 60 27 60 60v260c-12-10-28-16-46-16H300c-33 0-60-27-60-60V380c0-33 27-60 60-60zm20 70v160h190V390H320z',
            'Sports & Outdoors':
                'M270 520h80v-60h100v60h80v80h-80v60H350v-60h-80v-80z',
            'Toys & Games':
                'M300 420h90v-90h110v90h90v110h-90v90H390v-90h-90V420zm110 20v70h70v-70h-70z',
            Health:
                'M360 330h80v90h90v80h-90v90h-80v-90h-90v-80h90v-90z',
        };

        const icon = iconPaths[categoryName] ?? iconPaths.Books;

        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.bg1}"/>
      <stop offset="1" stop-color="${palette.bg2}"/>
    </linearGradient>
    <radialGradient id="r" cx="35%" cy="30%" r="70%">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="800" height="1000" fill="url(#g)"/>
  <circle cx="${180 + a}" cy="${160 + b}" r="${140 + (a % 40)}" fill="url(#r)"/>
  <circle cx="${640 - b}" cy="${260 + c}" r="${160 + (b % 60)}" fill="url(#r)"/>

  <rect x="56" y="56" width="688" height="888" rx="56" fill="#FFFFFF" opacity="0.72"/>

  <text x="96" y="132" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="22" font-weight="800" fill="#475569">${safeCategory.toUpperCase()}</text>
  <text x="96" y="184" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="34" font-weight="900" fill="#0F172A">${shortName}</text>

  <g transform="translate(0,0)">
    <rect x="96" y="240" width="608" height="560" rx="40" fill="#FFFFFF" opacity="0.9"/>
    <path d="${icon}" fill="${palette.accent}" opacity="0.92"/>
    <path d="M160 820h480" stroke="#CBD5E1" stroke-width="6" stroke-linecap="round"/>
    <path d="M160 864h340" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round"/>
  </g>

  <rect x="96" y="900" width="210" height="52" rx="26" fill="${palette.accent}" opacity="0.12"/>
  <text x="116" y="934" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="18" font-weight="800" fill="${palette.accent}">ShopCraft</text>
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

        return images[product.name] ?? makeProductThumbDataUrl(product);
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
        <div className="min-h-screen bg-[#F8FAFC] py-10">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-4 text-left">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                            Shop
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 font-medium max-w-2xl">
                            Browse categories, filter by price, and sort results like a real marketplace.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-900">{products.length}</span> items
                            {q ? (
                                <>
                                    <span className="text-gray-400"> · </span>
                                    <span className="font-semibold text-gray-900">Search:</span> “{q}”
                                </>
                            ) : null}
                        </div>

                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            Sort
                            <select
                                value={`${sort}:${order}`}
                                onChange={(e) => {
                                    const [nextSort, nextOrder] = e.target.value.split(':') as [
                                        'createdAt' | 'price' | 'name',
                                        'asc' | 'desc',
                                    ];
                                    const next = new URLSearchParams(searchParams);
                                    next.set('sort', nextSort);
                                    next.set('order', nextOrder);
                                    window.location.hash = `#/products?${next.toString()}`;
                                }}
                                className="h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm font-semibold text-gray-800"
                            >
                                <option value="createdAt:desc">Featured</option>
                                <option value="price:asc">Price: Low to High</option>
                                <option value="price:desc">Price: High to Low</option>
                                <option value="name:asc">Name: A to Z</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <aside className="lg:col-span-3">
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-20">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-extrabold text-gray-900 tracking-wide">
                                    Filters
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const next = new URLSearchParams(searchParams);
                                        next.delete('categoryId');
                                        next.delete('minPrice');
                                        next.delete('maxPrice');
                                        next.delete('sort');
                                        next.delete('order');
                                        window.location.hash = `#/products?${next.toString()}`;
                                        setMinPriceInput('');
                                        setMaxPriceInput('');
                                    }}
                                    className="text-xs font-semibold text-gray-600 hover:text-gray-900"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-3">
                                    Category
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const next = new URLSearchParams(searchParams);
                                            next.delete('categoryId');
                                            window.location.hash = `#/products?${next.toString()}`;
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                                            !categoryId
                                                ? 'bg-gray-900 text-white border-gray-900'
                                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        All Categories
                                    </button>

                                    {categories.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => {
                                                const next = new URLSearchParams(searchParams);
                                                next.set('categoryId', c.id);
                                                window.location.hash = `#/products?${next.toString()}`;
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                                                categoryId === c.id
                                                    ? 'bg-gray-900 text-white border-gray-900'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-2">
                                <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-3">
                                    Price
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                                            Min
                                        </label>
                                        <input
                                            value={minPriceInput}
                                            onChange={(e) => setMinPriceInput(e.target.value)}
                                            inputMode="decimal"
                                            placeholder="0"
                                            className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                                            Max
                                        </label>
                                        <input
                                            value={maxPriceInput}
                                            onChange={(e) => setMaxPriceInput(e.target.value)}
                                            inputMode="decimal"
                                            placeholder="999"
                                            className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const next = new URLSearchParams(searchParams);
                                        const min = minPriceInput.trim();
                                        const max = maxPriceInput.trim();
                                        if (min) next.set('minPrice', min);
                                        else next.delete('minPrice');
                                        if (max) next.set('maxPrice', max);
                                        else next.delete('maxPrice');
                                        window.location.hash = `#/products?${next.toString()}`;
                                    }}
                                    className="mt-3 w-full h-10 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </aside>

                    <section className="lg:col-span-9">

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col min-w-0"
                            >
                                <div className="relative aspect-[4/5] bg-[#F1F5F9] overflow-hidden">
                                    <img
                                        src={getProductImageSrc(product)}
                                        alt={product.name}
                                        className="block w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-[1.03]"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute top-4 left-4">
                                        {product.category && (
                                            <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50/90 backdrop-blur-md rounded-full border border-blue-100 shadow-sm">
                                                {product.category.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col min-w-0">
                                    <h3 className="text-lg font-extrabold text-[#0F172A] mb-2 group-hover:text-gray-900 transition-colors line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed font-medium">
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
                                            className="w-full py-3.5 px-5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center space-x-2 group/btn"
                                        >
                                            <span>
                                                {product.stock === 0
                                                    ? 'Out of Stock'
                                                    : 'Add to cart'}
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
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Products;
