import React, { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';

const CartItem = ({ item }) => {
  const { updateCartItem, removeCartItem } = useContext(CartContext);

  const handleIncrement = () => {
    updateCartItem(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateCartItem(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeCartItem(item.id);
  };

  return (
    <div className="cart-item">
      <h3>{item.name}</h3>
      <p>Price: ${item.price}</p>
      <p>Quantity: {item.quantity}</p>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
};

export default CartItem;
