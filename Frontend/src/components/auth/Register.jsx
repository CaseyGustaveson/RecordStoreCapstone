import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    // State variables for user input and error handling
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            // Send a POST request to register endpoint with email and password
            const response = await axios.post('/api/auth/register', { email, password });

            // Destructure accessToken and user from response data
            const { accessToken, user } = response.data;

            // Store accessToken and user object in localStorage for persistent login
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));

            // Clear any previous error messages upon successful registration
            setError('');

            // Redirect to profile page after successful registration
            window.location.href = '/profile';
        } catch (error) {
            // Handle errors from server response
            setError(error.response.data.error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                {/* Input field for email */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required // Email input is required
                />
                {/* Input field for password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required // Password input is required
                />
                {/* Submit button */}
                <button type="submit">Register</button>
            </form>
            {/* Display error message if there's an error */}
            {error && <p>{error}</p>}
        </div>
    );
};

export default Register;
