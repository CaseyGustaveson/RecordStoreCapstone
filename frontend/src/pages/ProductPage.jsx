import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3001/api/products";
const CATEGORY_API_URL = "http://localhost:3001/api/categories";
const CART_API_URL = "http://localhost:3001/api/cart";

const Products = () => {
  const navigate = useNavigate();
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
          axios.get(API_URL),
          axios.get(CATEGORY_API_URL),
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
  }, []);[];

  const addToCart = async (productId) => {
    try {
      await axios.post(
        CART_API_URL,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Product added to cart successfully");
    } catch (error) {
      setError("Failed to add product to cart");
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
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
                  onClick={() => addToCart(product.id)}
                  sx={{ width: "80%" }}
                >
                  Add to Cart
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
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
