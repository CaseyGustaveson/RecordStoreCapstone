import axios from 'axios';  

const API_URL = '/api/search';

export const searchProducts = async (query) => {
    try {
        const response = await axios.get(`${API_URL}?query=${query}`);
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        return null;
    }
}

export const searchProductsByCategory = async (query, categoryId) => {
    try {
        const response = await axios.get(`${API_URL}?query=${query}&categoryId=${categoryId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error searching products by category:', error);
        return null;
    }
}
