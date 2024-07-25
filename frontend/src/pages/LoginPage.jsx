import React, { useState } from 'react';
import { Alert, Typography, Button, TextField, Snackbar, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';

const AuthLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            console.log('Attempting login with:', { email, password });

            const data = await loginUser({ email, password });
            console.log('Login successful:', data);

            localStorage.setItem('token', data.token);
            const role = data.role || 'USER';
            localStorage.setItem('role', role);

            setAlertMessage('Login successful!');
            setAlertSeverity('success');
            setOpenAlert(true);

            // Redirect based on user role
            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setAlertMessage(error.message || 'Login failed.');
            setAlertSeverity('error');
            setOpenAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="70vh"
            padding={3}
        >
            <Typography variant="h4" align="center" gutterBottom>Login Page</Typography>
            <Stack spacing={2} width="100%" maxWidth={400}>
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    disabled={loading}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    disabled={loading}
                />
                <Button
                    onClick={handleLogin}
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </Stack>
            <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                action={
                    <Button color="inherit" onClick={handleCloseAlert}>
                        Close
                    </Button>
                }
            >
                <Alert onClose={handleCloseAlert} severity={alertSeverity}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AuthLogin;
