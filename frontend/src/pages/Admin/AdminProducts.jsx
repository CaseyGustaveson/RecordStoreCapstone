import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3001/api/products";
const CATEGORY_API_URL = "http://localhost:3001/api/categories";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    releaseYear: "",
    price: "",
    quantity: "",
    categoryId: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const checkAuth = () => {
      if (!token) {
        navigate("/login");
      } else if (role !== "ADMIN") {
        navigate("/");
      } else {
        fetchInitialData();
      }
    };

    const fetchInitialData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(CATEGORY_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (Array.isArray(productsResponse.data) && Array.isArray(categoriesResponse.data)) {
          setProducts(productsResponse.data);
          setCategories(categoriesResponse.data);
        } else {
          throw new Error("Unexpected response format");
        }
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, token, role]);

  const addProduct = async () => {
    try {
      const response = await axios.post(API_URL, newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts([...products, response.data]);
      setNewProduct({
        name: "",
        releaseYear: "",
        price: "",
        quantity: "",
        categoryId: "",
        imageUrl: "",
      });
      setSuccess("Product added successfully");
    } catch (error) {
      setError("Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product.id !== id));
      setSuccess("Product deleted successfully");
    } catch (error) {
      setError("Failed to delete product");
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Stack spacing={2} direction="row">
        <TextField
          label="Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <TextField
          label="Release Year"
          value={newProduct.releaseYear}
          onChange={(e) =>
            setNewProduct({ ...newProduct, releaseYear: e.target.value })
          }
        />
        <TextField
          label="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <TextField
          label="Quantity"
          value={newProduct.quantity}
          onChange={(e) =>
            setNewProduct({ ...newProduct, quantity: e.target.value })
          }
        />
        <TextField
          label="Category"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
        />
        <TextField
          label="Image URL"
          value={newProduct.imageUrl}
          onChange={(e) =>
            setNewProduct({ ...newProduct, imageUrl: e.target.value })
          }
        />
        <FormControl>
          <Select
            value={newProduct.categoryId}
            onChange={(e) =>
              setNewProduct({ ...newProduct, categoryId: e.target.value })
            }
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={addProduct}>
          Add Product
        </Button>
      </Stack>
      <Box marginTop={2}>
        {products.map((product) => (
          <Box
            key={product.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding={2}
            border="1px solid #ccc"
            borderRadius={5}
            marginBottom={2}
          >
            <Box>
              <Typography variant="h6">Album: {product.name}</Typography>
              <Typography variant="body1">Release Year: {product.releaseYear}</Typography>
              <Typography variant="body1">${product.price}</Typography>
              <Typography variant="body1">{product.quantity} copies available</Typography>
              <Typography variant="body1"> {product.category}Category</Typography>
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: 100, height: 100, objectFit: "contain" }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={() => deleteProduct(product.id)}
            >
              Delete
            </Button>
          </Box>
        ))}
      </Box>
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

export default AdminProducts;
