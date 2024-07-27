const ProductCard = ({ product, onEdit, onSubmit }) => {
  // Fallback image in case product.imageUrl is not provided
  const defaultImage = 'https://via.placeholder.com/200x140?text=No+Image';

  return (
    <Card sx={{ width: 200, borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        alt={product.name}
        height="140"
        image={product.imageUrl || defaultImage} 
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${product.price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Release Year: {product.releaseYear}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Category: {product.category}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.quantity} in stock
        </Typography>
      </CardContent>
      <CardContent>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1 }}>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;