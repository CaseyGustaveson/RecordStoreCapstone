import dotenv from 'dotenv';
import express from 'express';
const app = express();
const port = process.env.PORT || 3001;


// Middleware to parse JSON bodies
app.use(express.json());
app.use(dotenv.config());

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
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/category', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/profile', profileRoutes);
app.use('/users', userRoutes);
app.use('/review', reviewRoute);



// Default route
app.get('/', (req, res) => {
  res.send('Hello friend!');
});

// Admin Dashboard route
// 
app.use(isAdmin, (req, res) => {
  res.send('Welcome to the admin dashboard!');
});

app.get('/api/category', (req, res) => {
  res.json({ message: 'Get all categories' });
});

app.get('/api/category/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get category with id ${id}` });
});

app.post('/api/category',isAdmin, (req, res) => {
  const category = req.body;
  res.json({ message: 'Create new category', category });
});

app.put('/api/category/:id',isAdmin, (req, res) => {
  const { id } = req.params;
  const category = req.body;
  res.json({ message: `Update category with id ${id}`, category });
});

app.delete('/api/category/:id',isAdmin, (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete category with id ${id}` });
});


app.get('/api/products', (req, res) => {
  res.json({ message: 'Get all products' });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get product with id ${id}` });
});

app.post('/api/products',isAdmin, (req, res) => {
  const product = req.body;
  // Logic to create a new product in the database
  res.json({ message: 'Create new product', product });
});

app.put('/api/products/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  const product = req.body;
  res.json({ message: `Update product with id ${id}`, product });
});

app.delete('/api/products/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete product with id ${id}` });
});

app.get('/api/products/category/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get products by category with id ${id}` });
});

// User routes
app.get('/api/user', (req, res) => {
  res.json({ message: 'Get all users' });
});

app.get('/api/user/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get user with id ${id}` });
});

app.post('/api/user', (req, res) => {
  const user = req.body;
  res.json({ message: 'Create new user', user });
});

app.put('/api/user/:id', (req, res) => {
  const { id } = req.params;
  const user = req.body;
  res.json({ message: `Update user with id ${id}`, user });
});

app.delete('/api/user/:id',isAdmin, (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete user with id ${id}` });
});


app.get('/api/order', (req, res) => {
  res.json({ message: 'Get all orders' });
});

app.get('/api/order/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get order with id ${id}` });
});

app.post('/api/order', (req, res) => {
  const order = req.body;
  res.json({ message: 'Create new order', order });
});

app.put('/api/order/:id', (req, res) => {
  const { id } = req.params;
  const order = req.body;
  res.json({ message: `Update order with id ${id}`, order });
});

app.delete('/api/order/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete order with id ${id}` });
});

app.post('/api/order/:id/complete', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Complete order with id ${id}` });
});

//Profile routes
app.get('/api/profile', (req, res) => {
  res.json({ message: 'Get user profile' });
});

app.put('/api/profile', (req, res) => {
  const profile = req.body;
  res.json({ message: 'Update user profile', profile });
});

app.delete('/api/profile',isAdmin, (req, res) => {
  res.json({ message: 'Delete user profile' });
});

//Cart routes
app.get('/api/cart', (req, res) => {
  res.json({ message: 'Get user cart' });
});

app.post('/api/cart', (req, res) => {
  res.json({ message: 'Add item to cart' });
});

app.put('/api/cart/:id', (req, res) => {
  res.json({ message: 'Update cart item' });
});

app.delete('/api/cart/:id', (req, res) => {
  res.json({ message: 'Remove item from cart' });
});

app.delete('/api/cart', (req, res) => {
  res.json({ message: 'Clear cart' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
