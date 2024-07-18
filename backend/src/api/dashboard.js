import axios from 'axios'

const API_URL = '/api/dashboard'

export const getDashboard = async () => {
    try {
        const response = await axios.get(API_URL)
        return response.data
    } catch (error) {
        console.error('Error fetching dashboard:', error)
        return null
    }
}
