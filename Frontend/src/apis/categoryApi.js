import axios from 'axios';

const API_URL = 'http://localhost:3001/api/category';

export const getCategories = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return null;
    }
};

export const getCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/${categoryId}`);   
        return response.data;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
};

export const createCategory = async (category, token) => {
    try {
        const response = await axios.post(API_URL, category, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        return null;
    }
};

export const updateCategory = async (categoryId, category, token) => {
    try {
        const response = await axios.put(`${API_URL}/${categoryId}`, category, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });  
        return response.data;
    }
    catch (error) {
        console.error('Error updating category:', error);
        return null;
    }
};

export const deleteCategory = async (categoryId, token) => {
    try {
        const response = await axios.delete(`${API_URL}/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });    
        return response.data;
    }
    catch (error) {
        console.error('Error deleting category:', error);
        return null;
    }
};

