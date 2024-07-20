import axios from 'axios';

const API_URL = '/api/cart';

export const getCart = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        return null;
    }
}

export const addToCart = async (productId, quantity) => {
    try {
        const response = await axios.post(API_URL, { productId, quantity });
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return null;
    }
}

export const updateCartItem = async (itemId, quantity) => {
    try {
        const response = await axios.put(`${API_URL}/${itemId}`, { quantity });
        return response.data;
    } catch (error) {
        console.error('Error updating cart item:', error);
        return null;
    }
}

export const removeCartItem = async (itemId) => {
    try {
        const response = await axios.delete(`${API_URL}/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing cart item:', error);
        return null;
    }
}

export const clearCart = async () => {
    try {
        const response = await axios.delete(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error clearing cart:', error);
        return null;
    }
}

export const checkoutCart = async () => {
    try {
        const response = await axios.post(`${API_URL}/checkout`);
        return response.data;
    } catch (error) {
        console.error('Error checking out cart:', error);
        return null;
    }
}