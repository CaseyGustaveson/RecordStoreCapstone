import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import isAdmin from './src/middleware/isAdmin.js';




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



// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);



// Default route
app.get('/', (req, res) => {
  res.send('Hello friend!');
});

// Admin Dashboard route
app.get('/admin', isAdmin, (req, res) => {
  res.send('Welcome to the admin dashboard!');
});


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

app.get('/api/profiles', (req, res) => {
  res.json({ message: 'Get all profiles' });
})

app.get('/api/profiles/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get profile with id ${id}` });
})

app.post('/api/profiles', (req, res) => {
  const profile = req.body;
  res.json({ message: 'Create new profile', profile });
})

app.put('/api/profiles/:id', (req, res) => {
  const { id } = req.params;
  const profile = req.body;
  res.json({ message: `Update profile with id ${id}`, profile });
})

app.delete('/api/profiles/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete profile with id ${id}` });
})

app.get('/api/cart', (req, res) => {
  res.json({ message: 'Get all cart items' });
})

app.get('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get cart item with id ${id}` });
})

app.post('/api/cart', (req, res) => {
  const cartItem = req.body;
  res.json({ message: 'Create new cart item', cartItem });
})

app.put('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  const cartItem = req.body;
  res.json({ message: `Update cart item with id ${id}`, cartItem });
})

app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete cart item with id ${id}` });
})


app.get('/api/auth/login', (req, res) => {
  res.json({ message: 'Login' });
});
app.get('/api/auth/register', (req, res) => {
  res.json({ message: 'Register' });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
