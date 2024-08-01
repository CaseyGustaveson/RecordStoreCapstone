import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, TextField, CircularProgress, Stack } from '@mui/material';
import { getUserProfile, updateUserProfile } from '../api/userApi'; 

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const data = await getUserProfile(token); 
                setUser(data);
                setFormData({ name: data.name, email: data.email, password: '' });
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(token, formData);
            alert('Profile updated successfully');
            setEditMode(false); // Exit edit mode on successful update
        } catch (err) {
            setError(err);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error fetching profile: {error.message}</Typography>;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <Container style={{ textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '10px' }}>
                {editMode ? (
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h4" gutterBottom>Edit Profile</Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                                <Button type="submit" variant="contained" color="primary">Save</Button>
                                <Button type="button" variant="outlined" color="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
                            </Stack>
                        </Stack>
                    </form>
                ) : (
                    <div>
                        <Typography variant="h2" gutterBottom>Welcome, {user.email}!</Typography>
                        <Typography variant="h6" paragraph>Manage your account details here.</Typography>
                        <Button variant="contained" color="primary" size="large" style={{ marginTop: '20px' }} onClick={() => setEditMode(true)}>Edit Profile</Button>
                        <Grid container spacing={2} sx={{ mt: 4 }}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">Email: {user.email}</Typography>
                                <Typography variant="body1">Name: {user.name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {/* Add other user details here */}
                            </Grid>
                        </Grid>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default ProfilePage;
