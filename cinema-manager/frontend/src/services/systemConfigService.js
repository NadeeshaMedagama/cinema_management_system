import API from './api';

const systemConfigService = {
  // Get all system configurations
  getAllConfigs: async () => {
    const response = await API.get('/system-config');
    return response.data;
  },

  // Get config by key
  getConfigByKey: async (configKey) => {
    const response = await API.get(`/system-config/${configKey}`);
    return response.data;
  },

  // Get config value only
  getConfigValue: async (configKey) => {
    const response = await API.get(`/system-config/${configKey}/value`);
    return response.data;
  },

  // Create new config (admin only)
  createConfig: async (configData) => {
    const response = await API.post('/system-config', configData);
    return response.data;
  },

  // Update config (admin only)
  updateConfig: async (configKey, value) => {
    const response = await API.put(`/system-config/${configKey}`, value);
    return response.data;
  },

  // Delete config (admin only)
  deleteConfig: async (id) => {
    const response = await API.delete(`/system-config/${id}`);
    return response.data;
  },

  // Initialize default configs (admin only)
  initializeDefaults: async () => {
    const response = await API.post('/system-config/initialize');
    return response.data;
  }
};

export default systemConfigService;
