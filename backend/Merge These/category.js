import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to parse JSON bodies
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

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.sendStatus(403);
    }
};

// API URL for category operations
const API_URL = '/api/category';

// API Functions for Category Operations
const getCategories = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return null;
    }
};

const getCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
};

const createCategory = async (category) => {
    try {
        const response = await axios.post(API_URL, category);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        return null;
    }
};

const updateCategory = async (categoryId, category) => {
    try {
        const response = await axios.put(`${API_URL}/${categoryId}`, category);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        return null;
    }
};

const deleteCategory = async (categoryId) => {
    try {
        const response = await axios.delete(`${API_URL}/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        return null;
    }
};

// Routes for Category Operations
router.get('/categories', async (req, res) => {
    const categories = await getCategories();
    res.json(categories);
});

router.get('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const category = await getCategory(id);
    res.json(category);
});

router.post('/categories', authenticateToken, isAdmin, async (req, res) => {
    const category = req.body;
    const result = await createCategory(category);
    res.json(result);
});

router.put('/categories/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const category = req.body;
    const result = await updateCategory(id, category);
    res.json(result);
});

router.delete('/categories/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const result = await deleteCategory(id);
    res.json(result);
});

export default router;
