import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCreateOrderMutation } from '../hooks/useOrders';
import { getProductImageSrc } from '../utils/productMedia';

const Cart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = React.useState('');

    const createOrderMutation = useCreateOrderMutation();

    const handleCheckout = async () => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }

        setError('');

        try {
            const orderItems = items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            }));

            await createOrderMutation.mutateAsync(orderItems);
            clearCart();
            navigate('/orders');
        } catch (err: unknown) {
            const maybeMessage =
                typeof err === 'object' &&
                err !== null &&
                'response' in err &&
                typeof (err as { response?: unknown }).response === 'object' &&
                (err as { response?: { data?: { message?: string } } }).response?.data?.message
                    ? (err as { response?: { data?: { message?: string } } }).response?.data
                          ?.message
                    : undefined;

            setError(maybeMessage || 'Checkout failed');
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-8">Add some products to get started!</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                        >
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
                            >
                                <div className="w-full sm:w-24 h-28 sm:h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                    <img
                                        src={getProductImageSrc(item)}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                                    <p className="text-xl font-bold text-gray-900 mt-2">
                                        ${Number(item.price).toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between sm:justify-start sm:items-center gap-4">
                                    <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-semibold">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={item.quantity >= item.stock}
                                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50"
                                    >
                                        +
                                    </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-600 hover:text-red-700 font-semibold"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={createOrderMutation.isPending}
                                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {createOrderMutation.isPending
                                    ? 'Processing...'
                                    : 'Proceed to Checkout'}
                            </button>
                            <button
                                onClick={clearCart}
                                className="w-full mt-3 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
