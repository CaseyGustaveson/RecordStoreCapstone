import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../contexts'; // Adjust the path as per your project structure
import { useApi } from '../hooks'; // Adjust the path as per your project structure

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
    const { request, loading, error } = useApi('/api/cart'); // Example endpoint, adjust as needed

    useEffect(() => {
        // Fetch cart items on component mount
        const fetchCartItems = async () => {
            try {
                const data = await request('/');
                cartItems.setCartItems(data); // Assuming setCartItems updates state in CartContext
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };
        fetchCartItems();
    }, [cartItems, request]);

    const handleRemove = async (itemId) => {
        try {
            await request(`/${itemId}`, 'DELETE');
            removeFromCart(itemId); // Assuming removeFromCart updates state in CartContext
        } catch (error) {
            console.error(`Error removing item ${itemId} from cart:`, error);
        }
    };

    const handleClear = async () => {
        try {
            await request('/', 'DELETE');
            clearCart(); // Assuming clearCart updates state in CartContext
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    return (
        <div>
            <h2>Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cartItems.map((item) => (
                        <li key={item.id}>
                            <div>
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p>Price: ${item.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <button onClick={() => handleRemove(item.id)}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={handleClear} disabled={loading}>
                {loading ? 'Clearing...' : 'Clear Cart'}
            </button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
};

export default Cart;
