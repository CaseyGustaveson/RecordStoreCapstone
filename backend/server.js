import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './src/api/auth.js'; 
import userRoutes from './src/api/profile.js'; 
import categoryRoutes from './src/api/category.js';
import productRoutes from './src/api/products.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});
