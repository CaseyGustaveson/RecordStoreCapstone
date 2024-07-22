import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, TextField, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    console.log('Search term:', searchTerm);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const handleRegisterClick = () => {
    navigate('/register');
  };
  
  const handleHomeClick = () => {
    navigate('/');
  };
  
  const handleProductClick = () => {
    navigate('/products');
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#000000' }}>
      <Toolbar>
        <Button color = 'inherit' onClick={handleHomeClick} style = {{textTransform: 'none'}}>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          My Record Shop
          </Typography>
          </Button>
        <Box display="flex" alignItems="center" style={{marginLeft:'auto'}}>
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
            style={{ marginRight: '8px', width: '200px' }}
          />
          <Button variant="contained" style={{ backgroundColor: '#76eec6', color: '#fff' }} onClick={handleSearchSubmit}>
            Search
          </Button>
        </Box>
        <Button color="inherit" onClick={handleHomeClick}>Home</Button>
        <Button color="inherit" onClick={handleProductClick}>Shop</Button>
        <Button color="inherit" onClick={handleRegisterClick}>Register</Button>
        <Button color="inherit" onClick={handleLoginClick}>Login</Button>
        <IconButton color="inherit">
          <ShoppingCartIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
