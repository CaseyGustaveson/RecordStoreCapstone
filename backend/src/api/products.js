import axios from 'axios';

const API_URL = '/api/products';

export const getProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
}

export const getProduct = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export const createProduct = async ({ name, price, description, quantity, categoryId, imageUrl }) => {
    try {
        const productData = { name, price, description, quantity, categoryId, imageUrl };
        const response = await axios.post(API_URL, productData);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        return null;
    }
};

export const updateProduct = async (productId, { name, price, description, quantity, categoryId, imageUrl }) => {
    try {
        const productData = { name, price, description, quantity, categoryId, imageUrl };
        const response = await axios.put(`${API_URL}/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`${API_URL}/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        return null;
    }
}

export const getProductsByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return null;
    }
}

export const getProductsBySearch = async (search) => {
    try {
        const response = await axios.get(`${API_URL}/search/${search}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products by search:', error);
        return null;
    }
}

export const getProductsByPrice = async (price) => {
    try {
        const response = await axios.get(`${API_URL}/price/${price}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products by price:', error);
        return null;
    }
}
