import { useState, useEffect } from 'react';  
import axios from 'axios';
import './Cart.css';

const useCart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCart = async () => {
            try {
                // Send a GET request to the '/api/cart' endpoint
                const response = await axios.get('/api/cart');

                // Destructure cart from the response data
                const { cart } = response.data;

                // Set the cart state variable with the fetched cart data
                setCart(cart);
                setLoading(false); // Set loading to false
            } catch (error) {
                // Handle errors from the server's response
                setError(error.response.data.error);
                setLoading(false); // Set loading to false
            }
        };

        fetchCart(); // Call the fetchCart function
    }, []); // Run this effect only once when the component mounts

    // Function to remove an item from the cart
    const removeFromCart = async (itemId) => {
        try {
            // Send a DELETE request to the '/api/cart/:itemId' endpoint
            await axios.delete(`/api/cart/${itemId}`);

            // Filter out the item with the given itemId from the cart
            const updatedCart = cart.filter((item) => item.id !== itemId);

            // Update the cart state variable with the updated cart
            setCart(updatedCart);
        } catch (error) {
            // Handle errors from the server's response
            setError(error.response.data.error);
        }
    };

    return { cart, loading, error, removeFromCart };
}
export default useCart;