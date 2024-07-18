import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Hero = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        backgroundColor: '#eceff1',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <Typography variant="h2" gutterBottom>
        Welcome to My Record Shop
      </Typography>
      <Typography variant="h5" gutterBottom>
        Your one-stop shop for the best records
      </Typography>
      <Button variant="contained" color="primary" size="large">
        Shop Now
      </Button>
    </Box>
  );
};

export default Hero;
