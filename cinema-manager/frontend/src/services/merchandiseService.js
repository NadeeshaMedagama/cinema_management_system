import api from './api';

const merchandiseService = {
  // Get all active merchandise
  getAllMerchandise: async () => {
    const response = await api.get('/merchandise');
    return response.data;
  },

  // Get all merchandise (admin only)
  getAllMerchandiseAdmin: async () => {
    const response = await api.get('/merchandise/all');
    return response.data;
  },

  // Get merchandise by ID
  getMerchandiseById: async (id) => {
    const response = await api.get(`/merchandise/${id}`);
    return response.data;
  },

  // Get merchandise by category
  getMerchandiseByCategory: async (category) => {
    const response = await api.get(`/merchandise/category/${category}`);
    return response.data;
  },

  // Get bundle merchandise
  getBundleMerchandise: async () => {
    const response = await api.get('/merchandise/bundles');
    return response.data;
  },

  // Create new merchandise (admin only)
  createMerchandise: async (merchandiseData) => {
    const response = await api.post('/merchandise', merchandiseData);
    return response.data;
  },

  // Update merchandise (admin only)
  updateMerchandise: async (id, merchandiseData) => {
    const response = await api.put(`/merchandise/${id}`, merchandiseData);
    return response.data;
  },

  // Delete merchandise (admin only)
  deleteMerchandise: async (id) => {
    const response = await api.delete(`/merchandise/${id}`);
    return response.data;
  },

  // Update stock (admin only)
  updateStock: async (id, quantity) => {
    const response = await api.patch(`/merchandise/${id}/stock?quantity=${quantity}`);
    return response.data;
  }
};

export default merchandiseService;
