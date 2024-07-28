import Axios from 'axios';

const CART_API_URL = 'http://localhost:3001/api/cart';  



export const fetchCartItems = async (token) => {
  try {
    return await Axios.get(CART_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return null;
  }
}

export const addToCart = async (productId, token) => {
  try {
    const response = await Axios.post(
      CART_API_URL,
      { productId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding product to cart:', error);
    throw error;
  }
}

export const updateProductQuantity = async (productId, newQuantity, token) => {
  try {
      const response = await Axios.put(`${CART_API_URL}/${productId}`, 
          { quantity: newQuantity },
          {
              headers: { Authorization: `Bearer ${token}` },
          }
      );
      return response.data;
  } catch (error) {
      console.error('Error updating product quantity:', error);
      throw error;
  }
};
  
export const deleteItem = async (productId, token) => {
  try {
    const response = await Axios.delete(`${CART_API_URL}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}


export const clearCart = async (token) => {
  try {
    const response = await Axios.delete(CART_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

export const checkoutCart = async (token) => {
  try {
    const response = await Axios.post(`${CART_API_URL}/checkout`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking out cart:', error);
    throw error;
  }
}




