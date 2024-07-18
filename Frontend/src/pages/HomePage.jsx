import React from 'react';
import { Container, Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    marginTop: 20,
  },
  card: {
    maxWidth: 345,
    margin: 10,
  },
  media: {
    height: 300,
  },
});

const products = [
  {
    id: 1,
    name: 'Vinyl Record 1',
    image: 'https://via.placeholder.com/300',
    description: 'Description of the vinyl record.',
  },
  {
    id: 2,
    name: 'Vinyl Record 2',
    image: 'https://via.placeholder.com/300',
    description: 'Description of the vinyl record.',
  },
  // Add more products as needed
];

const HomePage = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography variant="h4" component="h1" gutterBottom>
        Featured Products
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={product.image}
                  title={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {product.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
