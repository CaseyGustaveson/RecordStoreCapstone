import React, { useEffect, useState } from 'react';  
import { Box, Button, Typography, Stack, TextField, FormControl, Select, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/products';  // Correct API base URL

const AdminProducts = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', quantity: '', categoryId: '', imageUrl: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const checkAuth = () => {
            if (!token) {
                navigate('/login');
            } else if (role !== 'ADMIN') {
                navigate('/');
            } else {
                fetchProducts();
            }
        };

        checkAuth();
    }, [navigate, token, role]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                throw new Error('Unexpected response format');
            }
            setIsLoading(false);
        } catch (error) {
            setError('Failed to fetch products');
            setIsLoading(false);
        }
    };

    const addProduct = async () => {
        try {
            const response = await axios.post(API_URL, newProduct, { headers: { Authorization: `Bearer ${token}` } });
            setProducts([...products, response.data]);
            setNewProduct({ name: '', description: '', price: '', quantity: '', categoryId: '', imageUrl: '' });
            setSuccess('Product added successfully');
        } catch (error) {
            setError('Failed to add product');
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setProducts(products.filter(product => product.id !== id));
            setSuccess('Product deleted successfully');
        } catch (error) {
            setError('Failed to delete product');
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <Box padding={2}>
            <Typography variant="h4" gutterBottom>Products</Typography>
            <Stack spacing={2} direction="row">
                <TextField label="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                <TextField label="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                <TextField label="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                <TextField label="Quantity" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} />
                <TextField label="Image URL" value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} />
                <FormControl>
                    <Select value={newProduct.categoryId} onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}>
                        <MenuItem value="">Select Category</MenuItem>
                        <MenuItem value="1">Category 1</MenuItem>
                        <MenuItem value="2">Category 2</MenuItem>
                        <MenuItem value="3">Category 3</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={addProduct}>Add Product</Button>
            </Stack>
            <Box marginTop={2}>
                {products.map(product => (
                    <Box key={product.id} display="flex" alignItems="center" justifyContent="space-between" padding={2} border="1px solid #ccc" borderRadius={5} marginBottom={2}>
                        <Box>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography variant="body1">{product.description}</Typography>
                            <Typography variant="body1">{product.price}</Typography>
                            <Typography variant="body1">{product.quantity}</Typography>
                            <Typography variant="body1">{product.categoryId}</Typography>
                            <img src={product.imageUrl} alt={product.name} style={{ width: 100, height: 100, objectFit: 'contain' }} />
                        </Box>
                        <Button variant="contained" onClick={() => deleteProduct(product.id)}>Delete</Button>
                    </Box>
                ))}
            </Box>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>
            <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
                <Alert severity="success">{success}</Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminProducts;
