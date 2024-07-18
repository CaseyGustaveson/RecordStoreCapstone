import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;  'http://localhost:3001';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
}

const register = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
  });
  return response.data;
}

export default {
    login,
    register,
    };