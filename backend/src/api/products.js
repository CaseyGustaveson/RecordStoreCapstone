import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Authentication Middleware
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.sendStatus(403);
    }
};

// API URL for product operations
const API_URL = '/api/products';

// API Functions for Product Operations
const getProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
};

const getProduct = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

const createProduct = async ({ name, price, description, quantity, categoryId, imageUrl }) => {
    try {
        const productData = { name, price, description, quantity, categoryId, imageUrl };
        const response = await axios.post(API_URL, productData);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        return null;
    }
};

const updateProduct = async (productId, { name, price, description, quantity, categoryId, imageUrl }) => {
    try {
        const productData = { name, price, description, quantity, categoryId, imageUrl };
        const response = await axios.put(`${API_URL}/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
};

const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`${API_URL}/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        return null;
    }
};

const getProductsByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return null;
    }
};

const getProductsBySearch = async (search) => {
    try {
        const response = await axios.get(`${API_URL}/search/${search}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products by search:', error);
        return null;
    }
};

// Routes for Product Operations
router.get('/products', async (req, res) => {
    const products = await getProducts();
    res.json(products);
});

router.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await getProduct(id);
    res.json(product);
});

router.post('/products', authenticateToken, isAdmin, async (req, res) => {
    const productData = req.body;
    const result = await createProduct(productData);
    res.json(result);
});

router.put('/products/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const productData = req.body;
    const result = await updateProduct(id, productData);
    res.json(result);
});

router.delete('/products/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const result = await deleteProduct(id);
    res.json(result);
});

router.get('/products/category/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    const products = await getProductsByCategory(categoryId);
    res.json(products);
});

router.get('/products/search/:search', async (req, res) => {
    const { search } = req.params;
    const products = await getProductsBySearch(search);
    res.json(products);
});

export default router;
