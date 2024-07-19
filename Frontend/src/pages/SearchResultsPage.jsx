import React, { useState } from 'react';
import { Container, Typography, TextField, Grid, CircularProgress, Alert, Card, CardContent, CardMedia, Button } from '@mui/material';
import { getProductsBySearch } from '../api/productSearch';

const SearchResultsPage = ({ showSearchBar }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getProductsBySearch(searchTerm);
            if (result) {
                setProducts(result);
            } else {
                setError('No products found');
            }
        } catch (err) {
            setError('Error fetching products');
        }
        setLoading(false);
    };

    return (
        <Container>
            {showSearchBar && (
                <TextField
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            handleSearchSubmit();
                        }
                    }}
                    InputProps={{
                        style: { backgroundColor: 'white' },
                    }}
                    style={{ marginBottom: '16px', width: '100%' }}
                />
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
                                        <Typography variant="h6">{product.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {product.description}
                                        </Typography>
                                        <Typography variant="h6">${product.price}</Typography>
                                        <Button variant="contained" color="primary" style={{ marginTop: '16px' }}>
                                            View Details
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (<Grid item xs={12} container justifyContent="center" alignItems="center" style={{minHeight:'60vh'}}>
                                    <Typography variant="body1" align="center">No results found</Typography>
                                    </Grid>
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default SearchResultsPage;
