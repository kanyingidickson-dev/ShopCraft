import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

type LoginForm = z.infer<typeof LoginSchema>;

const Login: React.FC = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const isDemoMode = !import.meta.env.VITE_API_URL;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: isDemoMode ? 'demo@shopcraft.demo' : '',
            password: isDemoMode ? 'password123' : '',
        },
    });

    const onSubmit = async (values: LoginForm) => {
        setError('');
        setLoading(true);

        try {
            await login(values.email, values.password);
            navigate('/products');
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

            setError(maybeMessage || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="mt-2 text-gray-600">Sign in to your account</p>
                    </div>

                    {(error || errors.email?.message || errors.password?.message) && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error || errors.email?.message || errors.password?.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                {...register('email')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                {...register('password')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
