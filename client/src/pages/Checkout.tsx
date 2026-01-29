import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCreateOrderMutation } from '../hooks/useOrders';
import { getProductImageSrc } from '../utils/productMedia';

const Checkout: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const { items, total, clearCart } = useCart();
    const navigate = useNavigate();
    const createOrderMutation = useCreateOrderMutation();

    const [fullName, setFullName] = React.useState(user?.name ?? '');
    const [email, setEmail] = React.useState(user?.email ?? '');
    const [address, setAddress] = React.useState('');
    const [city, setCity] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'paypal'>('card');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    React.useEffect(() => {
        if (items.length === 0) {
            navigate('/cart', { replace: true });
        }
    }, [items.length, navigate]);

    const placeOrder = async () => {
        setError('');

        if (!fullName.trim() || !email.trim() || !address.trim() || !city.trim() || !country.trim()) {
            setError('Please complete your shipping details.');
            return;
        }

        try {
            const orderItems = items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            }));

            const order = await createOrderMutation.mutateAsync(orderItems);
            clearCart();
            navigate(`/checkout/success?orderId=${encodeURIComponent(order.id)}`, { replace: true });
        } catch (err: unknown) {
            const maybeMessage =
                typeof err === 'object' &&
                err !== null &&
                'response' in err &&
                typeof (err as { response?: unknown }).response === 'object' &&
                (err as { response?: { data?: { message?: string } } }).response?.data?.message
                    ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                    : undefined;

            setError(maybeMessage || 'Checkout failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Checkout</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            This is a demo checkout. Payment is mocked, but orders are created.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/cart')}
                        className="h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                        Back to cart
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <section className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-extrabold text-gray-900">Shipping details</h2>
                            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="text-sm font-semibold text-gray-700">
                                    Full name
                                    <input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="mt-1 w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </label>
                                <label className="text-sm font-semibold text-gray-700">
                                    Email
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </label>
                                <label className="text-sm font-semibold text-gray-700 sm:col-span-2">
                                    Address
                                    <input
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="mt-1 w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </label>
                                <label className="text-sm font-semibold text-gray-700">
                                    City
                                    <input
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="mt-1 w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </label>
                                <label className="text-sm font-semibold text-gray-700">
                                    Country
                                    <input
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="mt-1 w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-extrabold text-gray-900">Payment (mocked)</h2>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`h-11 px-4 rounded-lg border text-sm font-semibold transition-colors ${
                                        paymentMethod === 'card'
                                            ? 'border-gray-900 bg-gray-900 text-white'
                                            : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                                    }`}
                                >
                                    Credit / Debit Card
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`h-11 px-4 rounded-lg border text-sm font-semibold transition-colors ${
                                        paymentMethod === 'paypal'
                                            ? 'border-gray-900 bg-gray-900 text-white'
                                            : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                                    }`}
                                >
                                    PayPal
                                </button>
                            </div>

                            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                                {paymentMethod === 'card'
                                    ? 'Card fields are hidden in demo mode. Click “Place order” to simulate a payment.'
                                    : 'You will not be redirected in demo mode. Click “Place order” to simulate PayPal.'}
                            </div>
                        </div>
                    </section>

                    <aside className="lg:col-span-5">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-extrabold text-gray-900">Order summary</h2>
                            <div className="mt-5 space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-14 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                            <img
                                                src={getProductImageSrc(item)}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-extrabold text-gray-900 line-clamp-2">
                                                {item.name}
                                            </div>
                                            <div className="mt-1 text-xs font-semibold text-gray-600">
                                                Qty: {item.quantity} · ${Number(item.price).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="text-sm font-extrabold text-gray-900 shrink-0">
                                            ${(Number(item.price) * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-5 border-t border-gray-200 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-extrabold text-gray-900 pt-2">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => void placeOrder()}
                                disabled={createOrderMutation.isPending}
                                className="mt-6 w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-900 font-extrabold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {createOrderMutation.isPending ? 'Placing order…' : 'Place order'}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
