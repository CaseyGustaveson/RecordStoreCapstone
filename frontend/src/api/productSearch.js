import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/products';

// Fetch all products
export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Fetch a single product by ID
export const getProduct = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, productData, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

// Update an existing product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`${API_URL}/${productId}`, productData, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    await axios.delete(`${API_URL}/${productId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return null;
  }
};

// Fetch products by category
export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/search/category`, {
      params: { categoryId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

// Search products
export const getProductsBySearch = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { query: searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};
