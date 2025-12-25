import api from './axios.config';

export const authApi = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    verifyCode: async (email, code) => {
        const response = await api.post('/auth/verify', { email, code });
        return response.data;
    },
};

export const productApi = {
    getAll: async (search = '') => {
        const response = await api.get(`/products${search ? `?search=${search}` : ''}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
};

export const cartApi = {
    getCart: async (userId) => {
        const response = await api.get(`/cart/user/${userId}`);
        return response.data;
    },

    addItem: async (item) => {
        const response = await api.post('/cart/items', item);
        return response.data;
    },

    removeItem: async (itemId) => {
        const response = await api.delete(`/cart/items/${itemId}`);
        return response.data;
    },

    clearCart: async (userId) => {
        const response = await api.delete(`/cart/user/${userId}`);
        return response.data;
    },
};

export const orderApi = {
    getUserOrders: async (userId) => {
        const response = await api.get(`/orders/user/${userId}`);
        return response.data;
    },

    getOrder: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    },

    createOrder: async (userId) => {
        const response = await api.post(`/orders/user/${userId}`);
        return response.data;
    },
};

export const userApi = {
    getUser: async (username) => {
        const response = await api.get(`/api/users/${username}`);
        return response.data;
    },
};
