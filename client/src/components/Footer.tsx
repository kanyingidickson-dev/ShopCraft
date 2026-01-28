import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-auto border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
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
                        </div>
                        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                            A modern demo storefront built for speed and clarity. Explore categories,
                            search instantly, and checkout with confidence.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-extrabold text-gray-900 tracking-wide mb-4">
                            About Us
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Company Info
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Press
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-extrabold text-gray-900 tracking-wide mb-4">
                            Help & Support
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Customer Service
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Shipping & Returns
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-extrabold text-gray-900 tracking-wide mb-4">
                            Legal & Social
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Terms of Use
                                </a>
                            </li>
                            <li>
                                <div className="flex items-center gap-3 pt-2">
                                    <a
                                        href="#"
                                        aria-label="Facebook"
                                        className="text-gray-500 hover:text-gray-900 transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5A3.5 3.5 0 0114.2 6h2.3v3h-2c-.9 0-1.2.5-1.2 1.1V12H17l-.5 3h-2.7v7A10 10 0 0022 12z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        aria-label="Twitter"
                                        className="text-gray-500 hover:text-gray-900 transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M18.5 2h3.7l-8.1 9.2L23.6 22h-7.2l-5.6-6.6L4.9 22H1.2l8.7-10L.7 2h7.4l5 5.9L18.5 2zm-1.3 18h2.1L7.6 3.9H5.4L17.2 20z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        aria-label="Instagram"
                                        className="text-gray-500 hover:text-gray-900 transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 4a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm6-2.3a1 1 0 11-2 0 1 1 0 012 0z" />
                                        </svg>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-xs text-gray-500">
                        © {new Date().getFullYear()} ShopCraft. All rights reserved.
                    </div>

                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-xs font-semibold">Payments</span>
                        <span className="inline-flex items-center gap-2">
                            <span className="px-2 py-1 rounded border border-gray-200 text-[11px] font-bold text-gray-700">
                                VISA
                            </span>
                            <span className="px-2 py-1 rounded border border-gray-200 text-[11px] font-bold text-gray-700">
                                MasterCard
                            </span>
                            <span className="px-2 py-1 rounded border border-gray-200 text-[11px] font-bold text-gray-700">
                                PayPal
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
