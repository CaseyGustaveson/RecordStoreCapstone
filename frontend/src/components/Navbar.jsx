import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, TextField, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, userRole, setIsLoggedIn, setUserRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    const searchUrl = `/search?query=${encodeURIComponent(searchTerm)}`;
    navigate(searchUrl);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#000000' }}>
      <Toolbar>
        <Button color="inherit" onClick={() => handleNavigation('/')} style={{ textTransform: 'none' }}>
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
          <Button
            variant="contained"
            style={{ backgroundColor: '#76eec6', color: '#fff' }}
            onClick={handleSearchSubmit}
          >
            Search
          </Button>
        </Box>
        <Button color="inherit" onClick={() => handleNavigation('/')}>Home</Button>
        <Button color="inherit" onClick={() => handleNavigation('/products')}>Shop</Button>
        {!isLoggedIn ? (
          <>
            <Button color="inherit" onClick={() => handleNavigation('/register')}>Register</Button>
            <Button color="inherit" onClick={() => handleNavigation('/login')}>Login</Button>
          </>
        ) : (
          <>
            <IconButton color="inherit" onClick={() => handleNavigation(userRole === 'ADMIN' ? '/admin' : '/profile')}>
              <AccountCircleIcon />
              <Typography variant="body2" style={{ marginLeft: '8px' }}>Profile</Typography>
            </IconButton>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
        <IconButton color="inherit" onClick={() => handleNavigation('/cart')}>
          <ShoppingCartIcon />
        </IconButton>
        <Button onClick={() => handleNavigation('/cart')} color="inherit"></Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
