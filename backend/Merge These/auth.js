import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Create Express Router
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

// Controller functions
const register = async (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const user = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                phone,
                password: hashedPassword,
            },
        });

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h', // Set token expiration if needed
        });

        // Send the token as the response
        res.status(201).json({ token });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h', // Set token expiration if needed
        });

        // Send the token as the response
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

const logout = (req, res) => {
    // Since JWTs are stateless, the logout functionality is handled client-side
    res.status(200).json({ message: 'Logout successful' });
};

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
