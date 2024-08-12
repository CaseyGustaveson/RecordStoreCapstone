import express from 'express';
import dotenv from 'dotenv';
import dotenv from 'dotenv';
import cors from 'cors';
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

app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});