import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Pagination,
} from '@mui/material';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const PRODUCTS_API_URL = import.meta.env.VITE_PRODUCTS_API_URL;
const CATEGORIES_API_URL = import.meta.env.VITE_CATEGORY_API_URL;
const CART_API_URL = import.meta.env.VITE_CART_API_URL;

const Products = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log('Fetching products and categories...');
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${PRODUCTS_API_URL}?page=${currentPage}&limit=${itemsPerPage}`),
          axios.get(CATEGORIES_API_URL),
        ]);

        const productsData = productsResponse.data.products || productsResponse.data || [];
        const categoriesData = categoriesResponse.data.categories || categoriesResponse.data || [];
        const totalPages = productsResponse.data.totalPages || 1;

        setProducts(productsData);
        setCategories(categoriesData);
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [currentPage, itemsPerPage]);

  const addToCart = async (productId, quantity) => {
    try {
      const response = await axios.post(
        CART_API_URL,
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
      if (error.response?.status === 403) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem("token");
        setToken(null);
      } else {
        setError('Failed to add item to cart');
      }
    }
  };

  const handleAddToCart = (productId) => {
    if (!token) {
      setError('Please log in to add items to the cart.');
      return;
    }
    addToCart(productId, 1);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      {isLoading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : (
        <>
          <Grid container spacing={2} marginTop={2}>
            {products.length ? (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard
                    product={product}
                    onAdd={() => handleAddToCart(product.id)}
                  />
                </Grid>
              ))
            ) : (
              <Typography>No products available</Typography>
            )}
          </Grid>
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
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