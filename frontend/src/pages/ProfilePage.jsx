import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, CircularProgress } from '@mui/material';
import { getUserProfile } from '../api/userApi'; // Import the getUserProfile function

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const data = await getUserProfile(token); // Use the getUserProfile function
                setUser(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error fetching profile: {error.message}</Typography>;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <Container style={{ textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '10px' }}>
                <Typography variant="h2" gutterBottom>Welcome, {user.email}!</Typography>
                <Typography variant="h6" paragraph>Manage your account details here.</Typography>
                <Button variant="contained" color="primary" size="large" style={{ marginTop: '20px' }} href="/profile/edit">Edit Profile</Button>
                <Grid container spacing={2} sx={{ mt: 4 }}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">Email: {user.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* Add other user details here */}
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default ProfilePage;
