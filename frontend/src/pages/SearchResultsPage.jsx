import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress, Alert, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { getProductsBySearch } from '../api/productSearch';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResultsPage = ({ showSearchBar = true }) => {
  const query = useQuery();
  const initialSearchTerm = query.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialSearchTerm) {
      handleSearchSubmit(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (term = searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching products with search term:', term); // Log search term
      const result = await getProductsBySearch(term);
      console.log('Search results:', result); // Log search results
      if (result && result.length > 0) {
        setProducts(result);
      } else {
        setError('No products found');
      }
    } catch (err) {
      console.error('Error fetching products:', err); // Log any errors
      setError('Error fetching products');
    }
    setLoading(false);
  };

  return (
    <Container>
      {showSearchBar && (
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Search Results
        </Typography>
      )}
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={4}>
          {products.length ? (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card>
                  {product.imageUrl && (
                    <CardMedia
                      component="img"
                      alt={product.name}
                      height="140"
                      image={product.imageUrl}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h5">{product.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.description}
                    </Typography>
                    <Typography variant="h6">${product.price}</Typography>
                    <Button variant="contained" color="primary" onClick={() => { /* Handle add to cart */ }}>
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No products available</Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default SearchResultsPage;
