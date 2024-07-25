import { useNavigate } from 'react-router-dom';

export const loginUser = async ({ email, password }) => {
    const navigate = useNavigate();

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        if (data.role === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/');
        }

        return data;
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error(error.message || 'Login failed.');
    }
};