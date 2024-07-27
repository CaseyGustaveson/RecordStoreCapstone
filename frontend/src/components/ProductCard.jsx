import React from 'react';
import { Card, CardContent, Typography, CardMedia, Button, Stack } from '@mui/material';

const ProductCard = ({ product, onEdit, onSubmit }) => {
  const defaultImage = 'https://via.placeholder.com/200x140?text=No+Image';

  return (
    <Card sx={{ width: 160, borderRadius: 2, boxShadow: 3, margin: 1 }}>
      <CardMedia
        component="img"
        alt={product.name}
        height="100"
        image={product.imageUrl || defaultImage} 
        sx={{ objectFit: 'cover' }} 
      />
      <CardContent sx={{ padding: 1 }}>
        <Typography variant="h6" component="div" sx={{ mb: 0.5, textAlign: 'center', fontSize: '0.9rem' }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem' }}>
          ${product.price.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem' }}>
          Release Year: {product.releaseYear}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem' }}>
          Category: {product.category.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem' }}>
          {product.quantity} in stock
        </Typography>
      </CardContent>
      <CardContent sx={{ paddingTop: 0, paddingBottom: 1 }}>
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Button variant="contained" color="primary" size="small" onClick={() => onEdit(product)}>
            Edit
          </Button>
          <Button variant="contained" color="secondary" size="small" onClick={() => onSubmit(product)}>
            Submit
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
