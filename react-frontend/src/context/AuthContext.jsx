import { createContext, useState, useEffect, useContext } from 'react';
import { authApi, userApi } from '../api/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUsername = localStorage.getItem('username');
            const storedUserId = localStorage.getItem('userId');

            if (storedToken && storedUsername && storedUserId) {
                setToken(storedToken);
                setUser({
                    username: storedUsername,
                    userId: parseInt(storedUserId),
                });
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const data = await authApi.login(credentials);
            const { token, username } = data;

            // Save token FIRST so axios interceptor can use it for subsequent requests
            localStorage.setItem('token', token);
            setToken(token);

            // Get user ID (now with token in localStorage)
            const userData = await userApi.getUser(username);
            const userId = userData.id;

            localStorage.setItem('username', username);
            localStorage.setItem('userId', userId.toString());

            setUser({ username, userId });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Identifiants invalides' };
        }
    };

    const register = async (userData) => {
        try {
            await authApi.register(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Erreur lors de l\'inscription' };
        }
    };

    const verifyEmail = async (email, code) => {
        try {
            await authApi.verifyCode(email, code);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Code invalide ou expiré' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        verifyEmail,
        logout,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
