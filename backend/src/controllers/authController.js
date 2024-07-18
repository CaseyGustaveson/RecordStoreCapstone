import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, firstname, lastname, phone, email, password, role } = req.body;
    // Default role to 'user' if not specified
    const userRole = role || 'user';
    // Hash the password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, firstname, lastname, phone, email, password: hashedPassword, role: userRole },
    });

    // Create JWT payload and sign it
    const payload = { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45m' });
    res.status(200).json({ accessToken, user: newUser });
  } catch (error) {
    console.error('Error in register function:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Log in an existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('Invalid Credentials: User not found');
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      // Create JWT payload and sign it
      const payload = { id: user.id, username: user.username, email: user.email, role: user.role };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45m' });
      res.status(200).json({ accessToken, user });
    } else {
      console.log('Invalid Credentials: Incorrect password');
      res.status(400).json({ error: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error('Error in login function:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = async (req, res) => {
  try {
    // Destroy the access token
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error in logout function:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

