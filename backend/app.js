import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import isAdmin from './src/middleware/isAdmin.js';
import cartRoutes from './src/routes/cartRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Route middleware
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Admin Dashboard route
app.get('/admin', isAdmin, (req, res) => {
    res.send('Welcome to the admin dashboard!');
});

// Default route
app.get('/', (req, res) => {
    res.send('Hello friend!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
