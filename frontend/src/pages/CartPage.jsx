import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, TextField, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/products';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        // Fetch cart items from your cart storage or API
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            // Example fetch request for cart items
            const response = await axios.get('/api/cart');
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const updateProductQuantity = async (productId, newQuantity) => {
        try {
            await axios.put(`${API_URL}/${productId}`, { quantity: newQuantity });
            fetchCartItems(); // Refresh cart items
        } catch (error) {
            console.error('Error updating product quantity:', error);
            setOpenAlert(true); // Show alert for error
        }
    };

    const handleQuantityChange = (productId, event) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (newQuantity >= 0) {
            updateProductQuantity(productId, newQuantity);
        }
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Cart</Typography>
            <Stack spacing={2}>
                {cartItems.map(item => (
                    <Box key={item.id} sx={{ borderBottom: '1px solid gray', pb: 2 }}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="body2">${item.price}</Typography>
                        <TextField
                            label="Quantity"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e)}
                        />
                    </Box>
                ))}
            </Stack>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="error">
                    Error updating product quantity!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CartPage;
