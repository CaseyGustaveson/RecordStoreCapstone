import axios from 'axios';

const API_URL = '/api/order';

export const getOrders = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return null;
    }
}

export const getOrder = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
}

export const createOrder = async (order) => {
    try {
        const response = await axios.post(API_URL, order);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
}

export const updateOrder = async (orderId, order) => {
    try {
        const response = await axios.put(`${API_URL}/${orderId}`, order);
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        return null;
    }
}

export const deleteOrder = async (orderId) => {
    try {
        const response = await axios.delete(`${API_URL}/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting order:', error);
        return null;
    }
}

export const completeOrder = async (orderId) => {
    try {
        const response = await axios.post(`${API_URL}/${orderId}/complete`);
        return response.data;
    } catch (error) {
        console.error('Error completing order:', error);
        return null;
    }
}

export const cancelOrder = async (orderId) => {
    try {
        const response = await axios.post(`${API_URL}/${orderId}/cancel`);
        return response.data;
    } catch (error) {
        console.error('Error canceling order:', error);
        return null;
    }
}
