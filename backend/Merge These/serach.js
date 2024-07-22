import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = express.Router();
const API_URL = '/api/search';
const PRODUCT_API_URL = '/api/products';

// Middleware to parse JSON request body
router.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Admin Middleware
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.sendStatus(403);
    }
};

// API Functions
const searchProducts = async (query) => {
    try {
        const response = await axios.get(`${API_URL}?query=${query}`);
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        return null;
    }
};

const searchProductsByCategory = async (query, categoryId) => {
    try {
        const response = await axios.get(`${API_URL}?query=${query}&categoryId=${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error searching products by category:', error);
        return null;
    }
};

const getProducts = async () => {
    try {
        const response = await axios.get(PRODUCT_API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
};

const getProduct = async (productId) => {
    try {
        const response = await axios.get(`${PRODUCT_API_URL}/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

// Routes
router.get('/search', async (req, res) => {
    const query = req.query.query;
    const data = await searchProducts(query);
    res.json(data);
});

router.get('/search/category', async (req, res) => {
    const query = req.query.query;
    const categoryId = req.query.categoryId;
    const data = await searchProductsByCategory(query, categoryId);
    res.json(data);
});

router.get('/products', async (req, res) => {
    const data = await getProducts();
    res.json(data);
});

router.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const data = await getProduct(productId);
    res.json(data);
});

// Protected Routes
router.post('/products', authenticateToken, isAdmin, async (req, res) => {
    // Handle product creation
    res.send('Product created');
});

router.put('/products/:id', authenticateToken, isAdmin, async (req, res) => {
    // Handle product update
    res.send('Product updated');
});

router.delete('/products/:id', authenticateToken, isAdmin, async (req, res) => {
    // Handle product deletion
    res.send('Product deleted');
});

export default router;
