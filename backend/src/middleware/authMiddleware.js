import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error authenticating token:', error);
    return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Not an admin.' });
  }
};

export { authenticateToken, isAdmin };