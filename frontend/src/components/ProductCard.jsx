import React from 'react';
import { Card, CardContent, Typography, CardMedia, Button, Stack } from '@mui/material';

const ProductCard = ({ product, onEdit, onSubmit }) => {

  const defaultImage = 'https://via.placeholder.com/200x140?text=No+Image';

  return (
    <Card sx={{ width: 200, borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        alt={product.name}
        height="140"
        image={product.imageUrl || defaultImage} // Fallback image
        sx={{ objectFit: 'cover' }} // Ensure image covers the area
      />
      <CardContent>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${product.price.toFixed(2)} 
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Release Year: {product.releaseYear}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Category: {product.category.name} 
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.quantity} in stock
        </Typography>
      </CardContent>
      <CardContent>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1 }}>
          <Button variant="contained" color="primary" onClick={() => onEdit(product)}>
            Edit
          </Button>
          <Button variant="contained" color="secondary" onClick={() => onSubmit(product)}>
            Submit
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
