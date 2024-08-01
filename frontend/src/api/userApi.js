import axios from 'axios';

// Configure the axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Base URL for your backend
});

export const getUserProfile = async (token) => {
    try {
        const response = await api.get('/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateUserProfile = async (token, { name, email, password }) => {
    try {
        const response = await axios.put(`${API_URL}/profile`, { name, email, password }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error updating user profile');
    }
};

export const getAllUsers = async (token) => {
    try {
        const response = await api.get('/user', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
