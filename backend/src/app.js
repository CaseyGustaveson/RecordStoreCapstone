
import express from 'express';
import cors from 'cors';
const app = express();
import userRoutes from './routes/userRoutes';   
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import authRoutes from './routes/authRoutes';
import isAdmin from './middleware/isAdmin';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import profileRoutes from './routes/profileRoutes'; 


app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/profile', profileRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/auth', authRoutes);
app.use(isAdmin, (req, res) => {
    res.send('Welcome to the admin dashboard!');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
    res.send('Hello friend!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;
