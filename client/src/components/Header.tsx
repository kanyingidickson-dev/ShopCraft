import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { itemCount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    const currentQuery = useMemo(() => {
        const sp = new URLSearchParams(location.search);
        return (sp.get('q') ?? '').trim();
    }, [location.search]);

    const [searchValue, setSearchValue] = useState(currentQuery);

    useEffect(() => {
        setSearchValue(currentQuery);
    }, [currentQuery]);

    const isActive = (path: string) => location.pathname === path;

    const quickCategories = useMemo(
        () => [
            'Electronics',
            'Fashion',
            'Home & Kitchen',
            'Beauty',
            'Books',
            'Sports & Outdoors',
            'Toys & Games',
            'Health',
        ],
        [],
    );

    const submitSearch = (value: string) => {
        const q = value.trim();
        const search = q ? `?${new URLSearchParams({ q }).toString()}` : '';
        navigate(`/products${search}`);
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 h-16">
                    <Link to="/" className="flex items-center space-x-3 group shrink-0">
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-6 duration-300 shadow-sm">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                        </div>
                        <span className="text-xl font-black text-gray-900 tracking-tight">
                            Shop<span className="text-amber-600">Craft</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-4 flex-1">
                        <form
                            className="flex-1"
                            onSubmit={(e) => {
                                e.preventDefault();
                                submitSearch(searchValue);
                            }}
                        >
                            <div className="flex items-stretch w-full">
                                <div className="hidden xl:flex items-center px-3 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-xs font-semibold text-gray-600">
                                    All
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        placeholder="Search products, brands and more"
                                        className="w-full h-10 px-4 border border-gray-300 rounded-l-lg xl:rounded-l-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                                    />
                                    {searchValue.trim().length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchValue('');
                                                submitSearch('');
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                            aria-label="Clear search"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="h-10 px-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-r-lg border border-amber-500 hover:border-amber-600 transition-colors"
                                >
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
                                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/"
                                className={`text-sm font-semibold transition-colors ${
                                    isActive('/') ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/products"
                                className={`text-sm font-semibold transition-colors ${
                                    isActive('/products')
                                        ? 'text-gray-900'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Shop
                            </Link>
                            <Link
                                to="/products?sort=price&order=asc"
                                className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Deals
                            </Link>
                            <Link
                                to="/products?sort=name&order=asc"
                                className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Best Sellers
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <Link
                            to="/cart"
                            className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                            title={itemCount > 0 ? 'View cart' : 'Your Cart is Empty'}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <span className="hidden sm:block text-sm font-semibold">Cart</span>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-amber-500 text-gray-900 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="hidden sm:flex items-center gap-2">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-bold text-gray-900 capitalize">
                                        {user?.name || 'Account'}
                                    </span>
                                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest leading-none">
                                        {user?.role}
                                    </span>
                                </div>

                                {isAdmin && (
                                    <Link
                                        to="/admin/orders"
                                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                            isActive('/admin/orders')
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        Admin
                                    </Link>
                                )}

                                <Link
                                    to="/orders"
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        isActive('/orders')
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    Orders
                                </Link>

                                <button
                                    onClick={logout}
                                    className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-3 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                                >
                                    Create account
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-2 pb-2">
                    <span className="text-xs font-semibold text-gray-500 mr-1">Categories:</span>
                    {quickCategories.slice(0, 6).map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => submitSearch(cat)}
                            className="text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors"
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default Header;
