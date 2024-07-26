import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, TextField, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
  
  
    console.log('Token from localStorage:', token);
    console.log('Role from localStorage:', role);
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    const searchUrl = `/search?query=${encodeURIComponent(searchTerm)}`;
    console.log('Navigating to:', searchUrl); // Log the URL
    navigate(searchUrl);
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

  const handleProfileClick = () => {
    if (userRole === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/user'); // Assuming '/user' is the profile page for regular users
    }
  };

  const handleLogoutClick = () => {
    console.log('Logging out...'); 
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
    console.log('Logged out'); // Debugging line
    navigate('/login');
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#000000' }}>
      <Toolbar>
        <Button color='inherit' onClick={handleHomeClick} style={{ textTransform: 'none' }}>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            My Record Shop
          </Typography>
        </Button>
        <Box display="flex" alignItems="center" style={{ marginLeft: 'auto' }}>
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
        {!isLoggedIn ? (
          <>
            <Button color="inherit" onClick={handleRegisterClick}>Register</Button>
            <Button color="inherit" onClick={handleLoginClick}>Login</Button>
          </>
        ) : (
          <>
            <IconButton color="inherit" onClick={handleProfileClick}>
              <AccountCircleIcon />
            </IconButton>
            <Button color="inherit" onClick={handleLogoutClick}>Logout</Button>
          </>
        )}
        <IconButton color="inherit">
          <ShoppingCartIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
