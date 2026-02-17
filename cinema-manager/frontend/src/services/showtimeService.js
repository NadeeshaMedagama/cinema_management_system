import API from './api';

const showtimeService = {
  // Get all showtimes
  getAllShowtimes: async () => {
    const response = await API.get('/showtimes');
    return response.data;
  },

  // Get showtime by ID
  getShowtimeById: async (id) => {
    const response = await API.get(`/showtimes/${id}`);
    return response.data;
  },

  // Get showtimes by movie ID
  getShowtimesByMovieId: async (movieId) => {
    const response = await API.get(`/showtimes/movie/${movieId}`);
    return response.data;
  },

  // Get upcoming showtimes
  getUpcomingShowtimes: async () => {
    const response = await API.get('/showtimes/upcoming');
    return response.data;
  },

  // Create showtime (admin only)
  createShowtime: async (showtimeData) => {
    const response = await API.post('/showtimes', showtimeData);
    return response.data;
  },

  // Update showtime (admin only)
  updateShowtime: async (id, showtimeData) => {
    const response = await API.put(`/showtimes/${id}`, showtimeData);
    return response.data;
  },

  // Delete showtime (admin only)
  deleteShowtime: async (id) => {
    await API.delete(`/showtimes/${id}`);
  }
};

export default showtimeService;
