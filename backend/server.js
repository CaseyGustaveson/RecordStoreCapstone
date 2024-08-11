import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';  // This is necessary for __dirname in ES modules

import authRoutes from './src/api/auth.js'; 
import categoryRoutes from './src/api/categories.js';
import productRoutes from './src/api/products.js';
import profileRoutes from './src/api/profile.js';
import userRoutes from './src/api/users.js';
import cartRoutes from './src/api/cart.js';
import checkoutRoutes from './src/api/checkout.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// This is needed to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
