import API from './api';

const bookingService = {
  // Get all bookings (admin only)
  getAllBookings: async () => {
    const response = await API.get('/bookings');
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async (userId) => {
    const response = await API.get(`/bookings/user/${userId}`);
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await API.get(`/bookings/${id}`);
    return response.data;
  },

  // Get booking by code
  getBookingByCode: async (bookingCode) => {
    const response = await API.get(`/bookings/code/${bookingCode}`);
    return response.data;
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const response = await API.post('/bookings', bookingData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    await API.delete(`/bookings/${id}/cancel`);
  },

  // Get bookings by status (admin only)
  getBookingsByStatus: async (status) => {
    const response = await API.get(`/bookings/status/${status}`);
    return response.data;
  }
};

export default bookingService;
