import API from './api';

const userService = {
  getProfile: async () => {
    const response = await API.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await API.put('/users/profile', userData);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await API.get(`/users/${userId}`);
    return response.data;
  },

  createAdminUser: async (adminData) => {
    const response = await API.post('/users/admin', adminData);
    return response.data;
  },

  getAllAdmins: async () => {
    const response = await API.get('/users/admins');
    return response.data;
  },
};

export default userService;
