import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

const products = [
  { id: 1, name: 'Album 1', image: '/path/to/image1.jpg', price: '$29.99' },
  { id: 2, name: 'Album 2', image: '/path/to/image2.jpg', price: '$19.99' },
  // Add more products as needed
];

const ProductGrid = () => {
  return (
    <Grid container spacing={4} style={{ padding: '20px' }}>
      {products.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={product.image}
              alt={product.name}
            />
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {product.price}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Add to Cart
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
