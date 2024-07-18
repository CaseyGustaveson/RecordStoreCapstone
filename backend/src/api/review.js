import axios from 'axios';

const API_URL = '/api/review';

export const getReviews = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return null;
    }
}

export const getReview = async (reviewId) => {
    try {
        const response = await axios.get(`${API_URL}/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching review:', error);
        return null;
    }
}

export const createReview = async (review) => {
    try {
        const response = await axios.post(API_URL, review);
        return response.data;
    } catch (error) {
        console.error('Error creating review:', error);
        return null;
    }
}

export const updateReview = async (reviewId, review) => {
    try {
        const response = await axios.put(`${API_URL}/${reviewId}`, review);
        return response.data;
    } catch (error) {
        console.error('Error updating review:', error);
        return null;
    }
}

export const deleteReview = async (reviewId) => {
    try {
        const response = await axios.delete(`${API_URL}/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting review:', error);
        return null;
    }
}

