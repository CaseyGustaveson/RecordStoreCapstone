import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Ensure this matches your backend API
const CART_API_URL = `${API_URL}/api/cart`;

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchCartItems(token);
    }, []);

    const fetchCartItems = async (token) => {
        setLoading(true);
        try {
            const response = await axios.get(CART_API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setCartItems(response.data);
        } catch (error) {
            setAlertMessage('Failed to fetch cart items. Please try again later.');
            setOpenAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const updateProductQuantity = async (productId, newQuantity) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${CART_API_URL}/${productId}`, { quantity: newQuantity }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            fetchCartItems(token); // Refresh cart items
        } catch (error) {
            setAlertMessage('Error updating product quantity. Please try again.');
            setOpenAlert(true);
        }
    };

    const handleQuantityChange = (productId, event) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            updateProductQuantity(productId, newQuantity); 
        }
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const handleRemoveFromCart = async (itemId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${CART_API_URL}/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            fetchCartItems(token); // Refresh cart items
        } catch (error) {
            setAlertMessage('Error removing item from cart. Please try again.');
            setOpenAlert(true);
        }
    };

    return (
        <Box padding={2}>
            <Typography variant="h4" gutterBottom>
                Your Cart
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : cartItems.length === 0 ? (
                <Typography variant="h6">Your cart is empty</Typography>
            ) : (
                <Grid container spacing={2} marginTop={2}>
                    {cartItems.map(item => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            padding={2}
            border="1px solid #ccc"
            borderRadius={5}
            height="100%"
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
            >
                <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: '5px' }}
                />
                <Typography variant="h6" marginTop={1}>
                    {item.product.name}
                </Typography>
                <Typography variant="body1">
                    Price: ${item.product.price}
                </Typography>
                <Box display="flex" alignItems="center" marginTop={1}>
                    <Typography variant="body1">Quantity: </Typography>
                    <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, e)}
                        sx={{ width: '60px', marginLeft: '10px' }}
                    />
                </Box>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
                marginTop={2}
            >
                <Button
                    variant="contained"
                    onClick={() => handleRemoveFromCart(item.id)}
                    sx={{ width: '80%' }}
                >
                    Remove from Cart
                </Button>
            </Box>
        </Box>
    </Grid>
))}
                </Grid>
            )}
            <Snackbar
                open={!!alertMessage}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
            >
                <Alert onClose={handleCloseAlert} severity={alertMessage.includes('Error') ? 'error' : 'success'}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CartPage;
