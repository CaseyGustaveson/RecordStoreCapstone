import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = express.Router();
const API_URL = '/api/user';

// Middleware to parse JSON bodies
router.use(express.json());

// Middleware for Authentication
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

// Controller functions
const getUsers = async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.sendStatus(500);
    }
};

const getUserById = async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.sendStatus(500);
    }
};

const createUser = async (req, res) => {
    try {
        const response = await axios.post(API_URL, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating user:', error);
        res.sendStatus(500);
    }
};

const updateUser = async (req, res) => {
    try {
        const response = await axios.put(`${API_URL}/${req.params.id}`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error updating user:', error);
        res.sendStatus(500);
    }
};

const deleteUser = async (req, res) => {
    try {
        const response = await axios.delete(`${API_URL}/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.sendStatus(500);
    }
};

// Routes
router.get('/', authenticateToken, isAdmin, getUsers);
router.get('/:id', authenticateToken, isAdmin, getUserById);
router.post('/', createUser);
router.put('/:id', authenticateToken, isAdmin, updateUser);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

export default router;
