import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import type { User } from '../services/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const bootstrap = async () => {
            setIsLoading(true);
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }

            const isDemoMode = !import.meta.env.VITE_API_URL;

            try {
                const meResponse = await authAPI.me();
                const nextUser = meResponse.data.data?.user ?? null;
                setUser(nextUser);
                if (nextUser) {
                    localStorage.setItem('user', JSON.stringify(nextUser));
                } else {
                    localStorage.removeItem('user');
                }
                return;
            } catch {
                // fall through to refresh
            }

            try {
                const refreshResponse = await authAPI.refresh();
                const accessToken = refreshResponse.data?.data?.accessToken as string | undefined;
                if (accessToken) {
                    setToken(accessToken);
                    localStorage.setItem('token', accessToken);
                }

                const meResponse = await authAPI.me();
                const nextUser = meResponse.data.data?.user ?? null;
                setUser(nextUser);
                if (nextUser) {
                    localStorage.setItem('user', JSON.stringify(nextUser));
                } else {
                    localStorage.removeItem('user');
                }
            } catch {
                if (isDemoMode) {
                    try {
                        const demoEmail = 'demo@shopcraft.demo';
                        const demoPassword = 'password123';
                        const response = await authAPI.login(demoEmail, demoPassword);
                        const { user: demoUser, accessToken } = response.data.data;
                        setUser(demoUser);
                        setToken(accessToken);
                        localStorage.setItem('token', accessToken);
                        localStorage.setItem('user', JSON.stringify(demoUser));
                        return;
                    } catch {
                        // fall through
                    }
                }

                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        };

        void bootstrap().finally(() => setIsLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authAPI.login(email, password);
        const { user, accessToken } = response.data.data;
        setUser(user);
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const register = async (email: string, password: string, name: string) => {
        const response = await authAPI.register(email, password, name);
        const { user, accessToken } = response.data.data;
        setUser(user);
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        authAPI.logout().catch(() => {
            // ignore
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'ADMIN',
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
