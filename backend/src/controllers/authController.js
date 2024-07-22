import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Register a new user
export const register = async (req, res) => {
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

// Login an existing user
export const login = async (req, res) => {
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

// Logout (token-based authentication)
export const logout = (req, res) => {
    // Since JWTs are stateless, the logout functionality is handled client-side
    res.status(200).json({ message: 'Logout successful' });
};
