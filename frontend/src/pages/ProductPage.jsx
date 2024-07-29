// frontend/src/pages/ProductPage.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const PRODUCTS_API_URL = `${API_URL}/api/products`;
const CATEGORIES_API_URL = `${API_URL}/api/categories`;
const CART_API_URL = `${API_URL}/api/cart`;

const Products = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(PRODUCTS_API_URL),
          axios.get(CATEGORIES_API_URL),
        ]);

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const addToCart = async (productId, quantity) => {
    try {
      const response = await axios.post(CART_API_URL, 
        { productId, quantity }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Item added to cart:', response.data);
      setSuccess('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      setError('Failed to add item to cart');
    }
  };

  const handleAddToCart = (productId) => {
    addToCart(productId, 1);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      {isLoading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : (
        <Grid container spacing={2} marginTop={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                  <Typography variant="h5">Album: {product.name}</Typography>
                  <Typography variant="body1">
                    Release Year: {product.releaseYear}
                  </Typography>
                  <Typography variant="body1">${product.price}</Typography>
                  <Typography variant="body1">
                    {product.quantity} copies available
                  </Typography>
                  <Typography variant="body1">
                    Category: {getCategoryName(product.categoryId)}
                  </Typography>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: 100, height: 100, objectFit: "contain" }}
                    key={product.id}
                  />
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
                    onClick={() => handleAddToCart(product.id)}
                    sx={{ width: "80%" }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;
