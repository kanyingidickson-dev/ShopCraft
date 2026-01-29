import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../services/api';
import { useCart } from '../context/CartContext';
import { useProductsQuery } from '../hooks/useProducts';
import { useCategoriesQuery } from '../hooks/useCategories';
import { getProductImageSrc } from '../utils/productMedia';

const Products: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = (searchParams.get('q') ?? '').trim();
    const categoryId = (searchParams.get('categoryId') ?? '').trim();

    const viewParam = searchParams.get('view');
    const view = (viewParam === 'grid' || viewParam === 'list' || viewParam === 'detail'
        ? viewParam
        : 'grid') as 'grid' | 'list' | 'detail';

    const sort = (searchParams.get('sort') ?? 'createdAt') as 'createdAt' | 'price' | 'name' | 'rating';
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

    const [filtersOpen, setFiltersOpen] = useState(false);

    const priceKey = `${minPriceRaw ?? ''}|${maxPriceRaw ?? ''}`;

    const FiltersPanel = useMemo(() => {
        const PriceFilter = ({ onApplied }: { onApplied: () => void }) => {
            const [minPriceInput, setMinPriceInput] = useState(minPriceRaw ?? '');
            const [maxPriceInput, setMaxPriceInput] = useState(maxPriceRaw ?? '');

            return (
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
                            setSearchParams(next);
                            onApplied();
                        }}
                        className="mt-3 w-full h-10 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg transition-colors"
                    >
                        Apply
                    </button>
                </div>
            );
        };

        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-extrabold text-gray-900 tracking-wide">Filters</h2>
                    <button
                        type="button"
                        onClick={() => {
                            const next = new URLSearchParams(searchParams);
                            next.delete('categoryId');
                            next.delete('minPrice');
                            next.delete('maxPrice');
                            next.delete('sort');
                            next.delete('order');
                            setSearchParams(next);
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
                                next.delete('q');
                                setSearchParams(next);
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
                                    next.delete('q');
                                    setSearchParams(next);
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

                <PriceFilter key={priceKey} onApplied={() => setFiltersOpen(false)} />
            </div>
        );
    }, [categories, categoryId, priceKey, searchParams, setSearchParams, minPriceRaw, maxPriceRaw]);

    const RatingStars = ({ value }: { value: number }) => {
        const full = Math.floor(value);
        const half = value - full >= 0.5;
        const stars = Array.from({ length: 5 }, (_, i) => {
            const idx = i + 1;
            const filled = idx <= full;
            const isHalf = !filled && half && idx === full + 1;
            return (
                <span key={idx} className="inline-block">
                    <svg
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill={filled || isHalf ? '#F59E0B' : '#E5E7EB'}
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.965a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.372 2.45a1 1 0 00-.364 1.118l1.287 3.965c.3.921-.755 1.688-1.54 1.118l-3.372-2.45a1 1 0 00-1.175 0l-3.372 2.45c-.784.57-1.838-.197-1.539-1.118l1.287-3.965a1 1 0 00-.364-1.118L2.05 9.392c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.291-3.965z" />
                    </svg>
                    {isHalf ? (
                        <span className="sr-only">half</span>
                    ) : null}
                </span>
            );
        });

        return <div className="flex items-center gap-1">{stars}</div>;
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
            {filtersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        aria-label="Close filters"
                        onClick={() => setFiltersOpen(false)}
                    />
                    <div className="absolute left-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl border-r border-gray-200 p-4 overflow-auto">
                        <div className="h-12 flex items-center justify-between mb-2">
                            <div className="text-sm font-extrabold text-gray-900">Filters</div>
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(false)}
                                className="w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        {FiltersPanel}
                    </div>
                </div>
            )}
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

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(true)}
                                className="lg:hidden h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-800"
                            >
                                Filters
                            </button>

                            <div className="inline-flex items-center rounded-lg border border-gray-300 bg-white overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const next = new URLSearchParams(searchParams);
                                        next.set('view', 'grid');
                                        setSearchParams(next);
                                    }}
                                    className={`h-10 px-3 text-sm font-semibold transition-colors ${
                                        view === 'grid'
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Grid
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const next = new URLSearchParams(searchParams);
                                        next.set('view', 'list');
                                        setSearchParams(next);
                                    }}
                                    className={`h-10 px-3 text-sm font-semibold transition-colors border-l border-gray-200 ${
                                        view === 'list'
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    List
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const next = new URLSearchParams(searchParams);
                                        next.set('view', 'detail');
                                        setSearchParams(next);
                                    }}
                                    className={`h-10 px-3 text-sm font-semibold transition-colors border-l border-gray-200 ${
                                        view === 'detail'
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Detailed
                                </button>
                            </div>

                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                Sort
                                <select
                                    value={`${sort}:${order}`}
                                    onChange={(e) => {
                                        const [nextSort, nextOrder] = e.target.value.split(':') as [
                                            'createdAt' | 'price' | 'name' | 'rating',
                                            'asc' | 'desc',
                                        ];
                                        const next = new URLSearchParams(searchParams);
                                        next.set('sort', nextSort);
                                        next.set('order', nextOrder);
                                        setSearchParams(next);
                                    }}
                                    className="h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm font-semibold text-gray-800"
                                >
                                    <option value="createdAt:desc">Featured</option>
                                    <option value="rating:desc">Customer rating</option>
                                    <option value="price:asc">Price: Low to High</option>
                                    <option value="price:desc">Price: High to Low</option>
                                    <option value="name:asc">Name: A to Z</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-20">{FiltersPanel}</div>
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
                    view === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col min-w-0"
                                >
                                    <div className="relative aspect-[4/5] bg-[#F1F5F9] overflow-hidden">
                                        <img
                                            src={getProductImageSrc(product)}
                                            alt={product.name}
                                            className="block w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-[1.03]"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="absolute top-3 left-3">
                                            {product.category && (
                                                <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50/90 backdrop-blur-md rounded-full border border-blue-100 shadow-sm">
                                                    {product.category.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col min-w-0">
                                        <h3 className="text-base sm:text-[17px] font-extrabold text-[#0F172A] mb-1.5 group-hover:text-gray-900 transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed font-medium">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <RatingStars value={product.rating ?? 4.2} />
                                                <span className="text-xs font-semibold text-gray-700">
                                                    {(product.rating ?? 4.2).toFixed(1)}
                                                </span>
                                                <span className="text-xs font-semibold text-gray-500">
                                                    ({product.reviewCount ?? 120})
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex items-end justify-between mb-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                        Price
                                                    </span>
                                                    <span className="text-xl font-black text-[#0F172A]">
                                                        ${Number(product.price).toFixed(2)}
                                                    </span>
                                                </div>
                                                <span
                                                    className={`text-xs font-bold px-2 py-1 rounded-md ${product.stock > 10 ? 'text-green-700 bg-green-50' : 'text-orange-700 bg-orange-50'}`}
                                                >
                                                    {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.stock === 0}
                                                className="w-full h-11 px-5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2 whitespace-nowrap"
                                            >
                                                <span>{product.stock === 0 ? 'Out of stock' : 'Add to cart'}</span>
                                                <svg
                                                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
                    ) : (
                        <div className="space-y-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                                >
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="relative w-full sm:w-56 aspect-[4/3] sm:aspect-auto sm:h-44 bg-[#F1F5F9] overflow-hidden">
                                            <img
                                                src={getProductImageSrc(product)}
                                                alt={product.name}
                                                className="block w-full h-full object-cover"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>

                                        <div className="flex-1 p-5 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                                        {product.category?.name ?? 'Shop'}
                                                    </div>
                                                    <h3 className="mt-1 text-lg font-extrabold text-[#0F172A] line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                                        Price
                                                    </div>
                                                    <div className="text-2xl font-black text-[#0F172A]">
                                                        ${Number(product.price).toFixed(2)}
                                                    </div>
                                                    <div className="mt-1">
                                                        <span
                                                            className={`text-xs font-bold px-2 py-1 rounded-md inline-block ${
                                                                product.stock === 0
                                                                    ? 'text-gray-600 bg-gray-100'
                                                                    : product.stock > 10
                                                                        ? 'text-green-700 bg-green-50'
                                                                        : 'text-orange-700 bg-orange-50'
                                                            }`}
                                                        >
                                                            {product.stock === 0
                                                                ? 'Sold out'
                                                                : product.stock > 10
                                                                    ? 'In stock'
                                                                    : `Only ${product.stock} left`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2 flex items-center gap-2">
                                                <RatingStars value={product.rating ?? 4.2} />
                                                <span className="text-xs font-semibold text-gray-700">
                                                    {(product.rating ?? 4.2).toFixed(1)}
                                                </span>
                                                <span className="text-xs font-semibold text-gray-500">
                                                    ({product.reviewCount ?? 120})
                                                </span>
                                            </div>

                                            <p className={`mt-3 text-sm text-gray-600 leading-relaxed ${view === 'detail' ? '' : 'line-clamp-2'}`}>
                                                {product.description}
                                            </p>

                                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={product.stock === 0}
                                                    className="h-11 px-5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.99] inline-flex items-center justify-center gap-2 whitespace-nowrap"
                                                >
                                                    <span>{product.stock === 0 ? 'Out of stock' : 'Add to cart'}</span>
                                                    <svg
                                                        className="w-5 h-5"
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
                                </div>
                            ))}
                        </div>
                    )
                )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Products;
