import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Middleware for Authentication
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Authorization header:', authHeader); // Debug

    if (!token) {
        console.log('No token provided'); // Debug
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        console.log('Decoded token:', decoded); // Debug
        console.log('User from token:', user); // Debug

        if (!user) {
            console.log('User not found'); // Debug
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.sendStatus(403);
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    console.log('User role:', req.user ? req.user.role : 'No user'); // Debug

    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.sendStatus(403);
    }
};

// Controller functions
const register = async (req, res) => {
    const { firstname, lastname, email, phone, password, role } = req.body;

    console.log('Register request body:', req.body); // Debug

    if (!firstname || !lastname || !email || !password) {
        console.log('Missing required fields'); // Debug
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                phone,
                password: hashedPassword,
                role: role || 'USER',
            },
        });

        console.log('User created:', user); // Debug

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({ token });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    console.log('Login request body:', req.body); // Debug

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        console.log('User found:', user); // Debug

        if (!user) {
            console.log('Invalid email or password'); // Debug
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.log('Invalid password'); // Debug
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

const logout = (req, res) => {
    console.log('Logout request received'); // Debug
    res.status(200).json({ message: 'Logout successful' });
};

// Define routes directly in the file
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/logout', logout);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
