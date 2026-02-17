import api from './api';

const cartService = {
  // Get current user's cart
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (merchandiseId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', {
        merchandiseId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (merchandiseId, quantity) => {
    try {
      const response = await api.put('/cart/update', {
        merchandiseId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (merchandiseId) => {
    try {
      const response = await api.delete(`/cart/remove/${merchandiseId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Checkout
  checkout: async () => {
    try {
      const response = await api.post('/cart/checkout');
      return response.data;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  }
};

export default cartService;
