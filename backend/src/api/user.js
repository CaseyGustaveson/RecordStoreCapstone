import axios from 'axios';

const API_URL = '/api/user';

export const getUsers = async () => {

    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
}

export const getUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export const createUser = async (user) => {
    try {
        const response = await axios.post(API_URL, user);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
}

export const updateUser = async (userId, user) => {
    try {
        const response = await axios.put(`${API_URL}/${userId}`, user);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
}   

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        return null;
    }
}   
