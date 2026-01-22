import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { itemCount } = useCart();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center transform transition-transform group-hover:rotate-12 duration-300 shadow-lg shadow-blue-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black text-[#0F172A] tracking-tighter">
                            Shop<span className="text-blue-600">Craft</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/products"
                            className={`text-sm font-bold tracking-wide transition-colors ${isActive('/products') ? 'text-blue-600' : 'text-gray-500 hover:text-[#0F172A]'
                                }`}
                        >
                            COLLECTIONS
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        to="/admin/orders"
                                        className={`text-sm font-bold tracking-wide transition-colors ${isActive('/admin/orders') ? 'text-blue-600' : 'text-gray-500 hover:text-[#0F172A]'
                                            }`}
                                    >
                                        ADMIN
                                    </Link>
                                )}
                                <Link
                                    to="/orders"
                                    className={`text-sm font-bold tracking-wide transition-colors ${isActive('/orders') ? 'text-blue-600' : 'text-gray-500 hover:text-[#0F172A]'
                                        }`}
                                >
                                    ORDERS
                                </Link>
                                <Link
                                    to="/cart"
                                    className="relative p-2 text-gray-500 hover:text-[#0F172A] transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-blue-500/40 border-2 border-white">
                                            {itemCount}
                                        </span>
                                    )}
                                </Link>
                                <div className="h-6 w-[1px] bg-gray-200"></div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-black text-[#0F172A] capitalize">
                                            {user?.name || 'Pro Member'}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                                            {user?.role}
                                        </span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all duration-300"
                                        title="Sign Out"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-[#0F172A] transition-colors"
                                >
                                    SIGN IN
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-xl active:scale-95"
                                >
                                    JOIN US
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
