import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const CheckoutSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const orderId = (searchParams.get('orderId') ?? '').trim();

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center mx-auto">
                        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Order placed</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Payment was mocked successfully. Your order has been created.
                    </p>

                    {orderId ? (
                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm">
                            <span className="text-gray-500 font-semibold">Order ID</span>
                            <span className="font-extrabold text-gray-900">{orderId}</span>
                        </div>
                    ) : null}

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link
                            to="/orders"
                            className="h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold inline-flex items-center justify-center"
                        >
                            View orders
                        </Link>
                        <Link
                            to="/products"
                            className="h-11 rounded-xl border border-gray-300 bg-white text-gray-900 font-extrabold inline-flex items-center justify-center hover:bg-gray-50"
                        >
                            Continue shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
