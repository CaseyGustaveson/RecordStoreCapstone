import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(403).json({ error: 'Invalid user' });
    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(403).json({ error: 'Token verification failed' });
  }
};

// Route handlers
const getCartItems = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid productId or quantity' });
  }

  try {
    const existingCartItem = await prisma.cartItem.findFirst({
      where: { userId: req.user.id, productId }
    });

    if (existingCartItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity }
      });
      res.json(updatedItem);
    } else {
      const newCartItem = await prisma.cartItem.create({
        data: { userId: req.user.id, productId, quantity }
      });
      res.json(newCartItem);
    }
  } catch (error) {
    console.error('Error adding to cart:', error.message);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

const updateCartItem = async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const { quantity } = req.body;
  if (isNaN(itemId) || itemId <= 0 || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid item ID or quantity' });
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId }
    });

    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this cart item' });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
    res.json(updatedCartItem);
  } catch (error) {
    console.error('Error updating cart item:', error.message);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

const removeCartItem = async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  if (isNaN(itemId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    await prisma.cartItem.delete({ where: { id: itemId } });
    res.sendStatus(204);
  } catch (error) {
    console.error('Error removing cart item:', error.message);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
};

const clearCart = async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.sendStatus(204);
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

const checkoutCart = async (req, res) => {
  try {
    console.log('Checking out for user:', req.user.id);
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    let totalQuantity = 0;
    for (const item of cartItems) {
      console.log('Checking out item:', item);
      totalQuantity += item.quantity;
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${item.productId}` });
      }

      await prisma.product.update({
        where: { id: product.id },
        data: { quantity: product.quantity - item.quantity }
      });
    }

    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Error checking out cart:', error.message);
    res.status(500).json({ error: 'Failed to checkout cart' });
  }
};

// Define routes
router.get('/', authenticateToken, getCartItems);
router.post('/', authenticateToken, addToCart);
router.put('/:itemId', authenticateToken, updateCartItem);
router.delete('/:itemId', authenticateToken, removeCartItem);
router.delete('/', authenticateToken, clearCart);
router.post('/checkout', authenticateToken, checkoutCart);

export default router;
