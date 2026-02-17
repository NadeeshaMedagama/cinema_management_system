import API from './api';

const contactService = {
  submitContact: async (contactData) => {
    const response = await API.post('/contacts', contactData);
    return response.data;
  },

  getAllContacts: async () => {
    const response = await API.get('/contacts');
    return response.data;
  },

  getContactsByStatus: async (status) => {
    const response = await API.get(`/contacts/status/${status}`);
    return response.data;
  },

  updateContactStatus: async (id, status) => {
    const response = await API.put(`/contacts/${id}/status?status=${status}`);
    return response.data;
  },

  deleteContact: async (id) => {
    await API.delete(`/contacts/${id}`);
  }
};

export default contactService;
