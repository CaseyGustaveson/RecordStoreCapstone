import React, { useEffect, useState } from 'react';
import { getProductsBySearch } from '../api/productSearch';
import { Typography, Box, CircularProgress, TextField, Grid } from '@mui/material';
import ProductCard from '../components/ProductCard'; // Adjust the import path as needed

const SearchResultsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [filterTerm, setFilterTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const searchTerm = new URLSearchParams(window.location.search).get('query') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsBySearch(searchTerm);
        console.log('Fetched Products:', data);
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error:', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const handleSubmit = (product) => {
    // Implement submit functionality here
    console.log('Submit Product:', product);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Filter products..."
        size="small"
        value={filterTerm}
        onChange={(e) => setFilterTerm(e.target.value)}
        sx={{ marginBottom: '16px' }}
      />
      <Grid container spacing={2}>
        {filteredProducts.length === 0 ? (
          <Typography variant="body1">No products found</Typography>
        ) : (
          filteredProducts.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard
                product={product}
                onSubmit={handleSubmit}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default SearchResultsPage;
