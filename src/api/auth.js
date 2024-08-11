import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();


// Middleware for Authentication
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) return res.sendStatus(403);

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.sendStatus(403);
    }
};
// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.sendStatus(403);
    }
};

// Controller functions
const register = async (req, res) => {
    console.log('Request body:', req.body); // Log the request body

    const { email, password, firstname, lastname, phone,address,role} = req.body;

    if (!email || !password || !firstname || !lastname||!phone||!address) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstname,
                lastname, 
                phone,
                address, 
                role: role || 'USER',
            },
        });
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET,{ 
         expiresIn: '1h', 


        });
        res.status(201).json({ token });
    } catch (error) {
        console.error('Error during registration:', error); // Log error details
        res.status(500).json({ error: 'Registration failed' });
    }
};




const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
        });;

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};



const refreshToken = (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshToken.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
        });
        res.json({ accessToken });
    });
};


// Define routes directly in the file
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);



export default router;