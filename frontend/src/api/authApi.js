const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async ({ email, password }) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
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

        return data;
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error(error.message || 'Login failed.');
    }
};
