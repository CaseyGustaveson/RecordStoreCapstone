import axios from 'axios';

// Configure the axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Base URL for your backend
});

// Fetch user profile
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

// Fetch all users (admin only)
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
