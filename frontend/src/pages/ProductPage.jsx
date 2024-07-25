import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, TextField, Snackbar, Alert, Card, CardContent } from '@mui/material';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API_URL = 'http://localhost:3001/api/products';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [name, description, price, quantity, products]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log('Products fetched:', response.data);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const applyFilters = () => {
        let filtered = products;

        if (name) {
            filtered = filtered.filter(product => product.name.toLowerCase().includes(name.toLowerCase()));
        }

        if (description) {
            filtered = filtered.filter(product => product.description.toLowerCase().includes(description.toLowerCase()));
        }

        if (price) {
            filtered = filtered.filter(product => product.price <= parseFloat(price));
        }

        if (quantity) {
            filtered = filtered.filter(product => product.quantity >= parseInt(quantity));
        }

        setFilteredProducts(filtered);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Products</Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    label="Max Price"
                    variant="outlined"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </Stack>
            <Stack spacing={2}>
            {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </Stack>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success">
                    Product action was successful!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductsPage;
