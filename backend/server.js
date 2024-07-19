import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import {isAdmin } from './src/middleware/isAdmin.js';


const app = express();
const port = process.env.PORT || 3001;


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
}));

// Routes
import authRoutes from './src/routes/authRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import reviewRoute from './src/routes/reviewRoute.js';


// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/review', reviewRoute);


// Default route
app.get('/', (req, res) => {
  res.send('Hello friend!');
});

// Admin Dashboard route
app.get('/admin', isAdmin, (req, res) => {
  res.send('Welcome to the admin dashboard!');
});


// Example API routes for categories
app.get('/api/category', (req, res) => {
  res.json({ message: 'Get all categories' });
});

app.get('/api/category/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get category with id ${id}` });
});

app.post('/api/category', isAdmin, (req, res) => {
  const category = req.body;
  res.json({ message: 'Create new category', category });
});

app.put('/api/category/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  const category = req.body;
  res.json({ message: `Update category with id ${id}`, category });
});

app.delete('/api/category/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete category with id ${id}` });
});

app.get('/api/products', (req, res) => {
  res.json({ message: 'Get all products' });
}
);

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get product with id ${id}` });
}
);

app.post('/api/products', isAdmin, (req, res) => {
  const product = req.body;
  res.json({ message: 'Create new product', product });
})

app.put('/api/products/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  const product = req.body;
  res.json({ message: `Update product with id ${id}`, product });
})

app.delete('/api/products/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete product with id ${id}` });
})

app.get('/api/orders', (req, res) => {
  res.json({ message: 'Get all orders' });
})

app.get('/api/orders/:id', (req, res) => {  
  const { id } = req.params;
  res.json({ message: `Get order with id ${id}` });
})

app.post('/api/orders', (req, res) => {
  const order = req.body;
  res.json({ message: 'Create new order', order });
})

app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const order = req.body;
  res.json({ message: `Update order with id ${id}`, order });
})

app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete order with id ${id}` });
})

app.get('/api/users', (req, res) => {
  res.json({ message: 'Get all users' });
})

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get user with id ${id}` });
})

app.post('/api/users', (req, res) => {
  const user = req.body;
  res.json({ message: 'Create new user', user });
})

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = req.body;
  res.json({ message: `Update user with id ${id}`, user });
}
)

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete user with id ${id}` });
})

app.get('/api/reviews', (req, res) => {
  res.json({ message: 'Get all reviews' });
})

app.get('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get review with id ${id}` });
})

app.post('/api/reviews', (req, res) => {
  const review = req.body;
  res.json({ message: 'Create new review', review });
})

app.put('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const review = req.body;
  res.json({ message: `Update review with id ${id}`, review });
})

app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete review with id ${id}` });
})

app.get('/auth/login', (req, res) => {
  res.json({ message: 'Login' });
});
app.get('/auth/register', (req, res) => {
  res.json({ message: 'Register' });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
