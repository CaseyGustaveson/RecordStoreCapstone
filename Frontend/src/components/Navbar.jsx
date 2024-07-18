import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, TextField } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    // Implement search logic here
    console.log('Search term:', searchTerm);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          My Record Shop
        </Typography>
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
          style={{ marginRight: '16px', width: '200px' }}
        />
        <Button color="inherit" onClick={handleSearchSubmit}>Search</Button>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Shop</Button>
        <Button color="inherit">Register</Button>
        <Button color="inherit">Login</Button>
        <IconButton color="inherit">
          <ShoppingCartIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
