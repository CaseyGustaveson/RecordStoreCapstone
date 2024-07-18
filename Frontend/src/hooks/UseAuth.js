import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Send a GET request to the '/api/auth/me' endpoint
                const response = await axios.get('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                // Destructure user from the response data
                const { user } = response.data;

                // Set the user state variable with the fetched user data
                setUser(user);
                setLoading(false); // Set loading to false
            } catch (error) {
                // Handle errors from the server's response
                setError(error.response.data.error);
                setLoading(false); // Set loading to false
            }
        };

        fetchUser(); // Call the fetchUser function
    }, []); // Run this effect only once when the component mounts

    return { user, loading, error };
};

export default useAuth;