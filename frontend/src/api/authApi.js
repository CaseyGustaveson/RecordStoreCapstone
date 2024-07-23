// src/api/authApi.js
const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async ({ email, password }) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(errorData.error || 'Login failed.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error during login:', error);
        throw new Error(error.message || 'An unexpected error occurred.');
    }
};
