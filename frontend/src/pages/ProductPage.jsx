import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, TextField } from '@mui/material';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API_URL = 'http://localhost:3001/api/products';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [releaseYear, setReleaseYear] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [name, releaseYear, price, quantity, products, category]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL);
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

        if (releaseYear) {
            const releaseYearInt = parseInt(releaseYear, 10);
            if (!isNaN(releaseYearInt)) {
                filtered = filtered.filter(product => product.releaseYear === releaseYearInt);
            }
        }

        if (price) {
            const priceNumber = parseFloat(price);
            if (!isNaN(priceNumber)) {
                filtered = filtered.filter(product => product.price <= priceNumber);
            }
        }

        if (quantity) {
            const quantityInt = parseInt(quantity, 10);
            if (!isNaN(quantityInt)) {
                filtered = filtered.filter(product => product.quantity >= quantityInt);
            }
        }

        setFilteredProducts(filtered);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Products</Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h6">Name</Typography>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Typography variant="h6">Release Year</Typography>
                <TextField
                    label="Release Year"
                    variant="outlined"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                />
                <Typography variant="h6">Price</Typography>
                <TextField
                    label="Max Price"
                    variant="outlined"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <Typography variant="h6">Available Quantity</Typography>
                <TextField
                    label='Available Quantity'
                    variant="outlined"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
            </Stack>
            <TextField
                label="Category"
                variant="outlined"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
            <Stack spacing={2}>
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </Stack>
        </Box>
    );
};

export default ProductsPage