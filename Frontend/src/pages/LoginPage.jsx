import React, { useState } from 'react';
import { Alert, Typography, Button, TextField, Snackbar, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('role', data.user.role); // Store role
                
                setAlertMessage('Login successful!');
                setAlertSeverity('success');
                setOpenAlert(true);
                
                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setAlertMessage(data.error || 'Login failed.');
                setAlertSeverity('error');
                setOpenAlert(true);
            }
        } catch (error) {
            console.error(error);
            setAlertMessage('An unexpected error occurred.');
            setAlertSeverity('error');
            setOpenAlert(true);
        }
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Box padding={3}>
            <Typography variant="h4" align="center" gutterBottom>Login Page</Typography>
            <Stack spacing={2} width="100%">
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{maxWidth: 400}}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{maxWidth: 400}}
                />
                <Button
                    onClick={handleLogin}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{maxWidth: 400}}
                >
                    Login
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

export default LoginPage;
