// backend/src/api/cart.js

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
    console.error('Stack Trace:', error.stack);
    res.status(403).json({ error: 'Token verification failed' });
  }
};

// Route handlers
const getCartItems = async (req, res) => {
  try {
    console.log('Fetching cart items for user ID:', req.user.id);
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });
    console.log('Retrieved Cart Items:', cartItems);
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    console.error('Stack Trace:', error.stack);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid productId or quantity' });
  }

  try {
    console.log('Adding to cart:', { productId, quantity });
    console.log('Current user ID:', req.user.id);

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { userId: req.user.id, productId }
    });
    console.log('Existing Cart Item:', existingCartItem);

    if (existingCartItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity }
      });
      console.log('Updated Cart Item:', updatedItem);
      res.json(updatedItem);
    } else {
      const newCartItem = await prisma.cartItem.create({
        data: { userId: req.user.id, productId, quantity }
      });
      console.log('New Cart Item:', newCartItem);
      res.json(newCartItem);
    }
  } catch (error) {
    console.error('Error adding to cart:', error.message);
    console.error('Stack Trace:', error.stack);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

const updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ error: 'Quantity must be greater than zero' });
  }

  try {
    console.log('Updating cart item:', { itemId, quantity });
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
    res.json(updatedCartItem);
  } catch (error) {
    console.error('Error updating cart item:', error.message);
    console.error('Stack Trace:', error.stack);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

const removeCartItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    console.log('Removing cart item:', { itemId });
    await prisma.cartItem.delete({
      where: { id: itemId }
    });
    res.sendStatus(204);
  } catch (error) {
    console.error('Error removing cart item:', error.message);
    console.error('Stack Trace:', error.stack);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
};

const clearCart = async (req, res) => {
  try {
    console.log('Clearing cart for user ID:', req.user.id);
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });
    res.sendStatus(204);
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    console.error('Stack Trace:', error.stack);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

const checkoutCart = async (req, res) => {
  try {
    console.log('Checking out cart for user ID:', req.user.id);
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        orderItems: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }
      }
    });

    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });
    res.json(order);
  } catch (error) {
    console.error('Error checking out:', error.message);
    console.error('Stack Trace:', error.stack);
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
