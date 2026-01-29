import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProductImageSrc } from '../utils/productMedia';

type CartDrawerProps = {
    open: boolean;
    onClose: () => void;
};

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
    const { items, updateQuantity, removeFromCart, total, itemCount, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60]">
            <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="Close cart"
                onClick={onClose}
            />

            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col">
                <div className="h-16 px-5 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-extrabold text-gray-900">Cart</h2>
                        <span className="text-xs font-semibold text-gray-500">({itemCount})</span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="flex-1 overflow-auto px-5 py-4">
                    {items.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-4xl mb-3">🛒</div>
                            <p className="text-sm font-semibold text-gray-900">Your cart is empty</p>
                            <p className="text-sm text-gray-600 mt-1">Add a few items to get started.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    navigate('/products');
                                }}
                                className="mt-6 h-10 px-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800"
                            >
                                Browse products
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                        <img
                                            src={getProductImageSrc(item)}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-sm font-extrabold text-gray-900 line-clamp-2">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    ${Number(item.price).toFixed(2)}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-xs font-semibold text-gray-500 hover:text-gray-900"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-900"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-900 disabled:opacity-40"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="text-sm font-extrabold text-gray-900">
                                                ${(Number(item.price) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-gray-600">Subtotal</span>
                        <span className="text-base font-extrabold text-gray-900">${total.toFixed(2)}</span>
                    </div>

                    {!isAuthenticated ? (
                        <div className="text-xs text-gray-600 mb-3">
                            Sign in at checkout to place your order.
                        </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                navigate('/cart');
                            }}
                            className="h-10 rounded-lg border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50"
                        >
                            View cart
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                navigate('/checkout');
                            }}
                            disabled={items.length === 0}
                            className="h-10 rounded-lg bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold disabled:opacity-40"
                        >
                            Checkout
                        </button>
                    </div>

                    {items.length > 0 ? (
                        <button
                            type="button"
                            onClick={() => clearCart()}
                            className="mt-3 w-full h-10 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Clear cart
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
