import API from './api';

const seatService = {
  // Get all seats for a showtime
  getSeatsByShowtime: async (showtimeId) => {
    const response = await API.get(`/seats/showtime/${showtimeId}`);
    return response.data;
  },

  // Get available seats for a showtime
  getAvailableSeats: async (showtimeId) => {
    const response = await API.get(`/seats/showtime/${showtimeId}/available`);
    return response.data;
  },

  // Get booked seats for a showtime
  getBookedSeats: async (showtimeId) => {
    const response = await API.get(`/seats/showtime/${showtimeId}/booked`);
    return response.data;
  },

  // Get seat by ID
  getSeatById: async (id) => {
    const response = await API.get(`/seats/${id}`);
    return response.data;
  }
};

export default seatService;
