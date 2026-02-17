import api from './api';

const foodService = {
  // Get all available food items
  getAllFoods: async () => {
    const response = await api.get('/food');
    return response.data;
  },
  
  // Get all food items (including unavailable) - admin only
  getAllFoodItems: async () => {
    const response = await api.get('/food/all');
    return response.data;
  },

  // Admin: Get all food items (including inactive)
  getAllFoodsAdmin: async () => {
    const response = await api.get('/food/all');
    return response.data;
  },

  // Get food by ID
  getFoodById: async (id) => {
    const response = await api.get(`/food/${id}`);
    return response.data;
  },

  // Get foods by category
  getFoodsByCategory: async (category) => {
    const response = await api.get(`/food/category/${category}`);
    return response.data;
  },

  // Create new food (admin only)
  createFood: async (foodData) => {
    const response = await api.post('/food', foodData);
    return response.data;
  },

  // Update food (admin only)
  updateFood: async (id, foodData) => {
    const response = await api.put(`/food/${id}`, foodData);
    return response.data;
  },

  // Delete food (admin only)
  deleteFood: async (id) => {
    const response = await api.delete(`/food/${id}`);
    return response.data;
  }
};

export default foodService;
