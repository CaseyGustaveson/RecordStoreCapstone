import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import {checkout } from '../api/cartApi';
import axios from 'axios';

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
            const response = await axios.get(`${API_URL}/cart`, {
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

    const handleCheckout = async () => {
        const token = localStorage.getItem('token');
        try {
            const result = await checkout(token);
            setAlertMessage(result.message || 'Checkout successful!');
            setOpenAlert(true);
            // Optionally, redirect to a different page or clear the cart
            // For example:
            // window.location.href = '/order-summary';
        } catch (error) {
            setAlertMessage('Error during checkout. Please try again.');
            setOpenAlert(true);
        }
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
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
                                            // Add quantity change handler here if needed
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
                                        onClick={() => handleCheckout()}
                                        sx={{ width: '80%' }}
                                    >
                                        Checkout
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Snackbar
                open={openAlert}
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
