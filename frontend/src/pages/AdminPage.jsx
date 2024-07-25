import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // State to handle loading
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const checkAuth = () => {
            if (!token) {
                navigate('/login');
            } else if (role !== 'ADMIN') {
                navigate('/unauthorized');
            } else {
                setIsLoading(false); // Stop loading and show admin content
            }
        };

        checkAuth();
    }, [navigate, token, role]);

    if (isLoading) {
        return <Box padding={3}>Loading...</Box>;
    }

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <Box padding={3}>
            <Typography variant="h4" align="center" gutterBottom>Admin Dashboard</Typography>
            <Stack direction="row" justifyContent="center" spacing={2} flexWrap="wrap">
                {/* Admin-specific buttons */}
                <Button variant="contained" onClick={() => handleNavigation('/admin/products/add')}>Add Product</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/products/edit')}>Edit Product</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/products/delete')}>Delete Product</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/users/add')}>Add User</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/users/edit')}>Edit User</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/users/delete')}>Delete User</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/categories/add')}>Add Category</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/categories/edit')}>Edit Category</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/categories/delete')}>Delete Category</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/orders/add')}>Add Order</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/orders/edit')}>Edit Order</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/orders/delete')}>Delete Order</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/orders')}>View Orders</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/products')}>View Products</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/users')}>View Users</Button>
                <Button variant="contained" onClick={() => handleNavigation('/admin/categories')}>View Categories</Button>
                <Button variant="contained" onClick={handleLogout}>Logout</Button>
            </Stack>
        </Box>
    );
};

export default AdminPage;
