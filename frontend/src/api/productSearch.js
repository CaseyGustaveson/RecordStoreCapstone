import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL
const PRODUCTS_API_URL = `${API_URL}/api/products`

console.log('API_URL:',API_URL)

// Fetch all products with pagination
export const getProducts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/paginate`, {  // Updated endpoint for pagination
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalPages: 1 };
  }
};

// Fetch a single product by ID
export const getProductById = async (productId) => {
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
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
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
    const response = await axios.get(API_URL, {
      params: { categoryId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

// Search products
export const getProductsBySearch = async (searchTerm = '') => {
  try {
    // Check if searchTerm is empty
    if (!searchTerm.trim()) {
      // Handle the case where no search term is provided
      const response = await axios.get(PRODUCTS_API_URL); // or a different endpoint if applicable
      console.log('API Response (no search term):', response.data);
      return response.data;
    }
    
    // Perform search with the provided searchTerm
    const response = await axios.get(PRODUCTS_API_URL, {
      params: { query: searchTerm }
    });
    console.log('API Response (with search term):', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by search:', error);
    throw error;
  }
};