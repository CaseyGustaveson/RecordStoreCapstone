import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import dotenv from 'dotenv';

dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.REACT_APP_ACCESS_TOKEN_SECRET;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = user;
    } catch (error) {
      console.error('Error authenticating token:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied' });
  }
};

export { authenticateToken, isAdmin };
