import API from './api';

const movieService = {
  getAllMovies: async () => {
    const response = await API.get('/movies');
    return response.data;
  },

  getMovieById: async (id) => {
    const response = await API.get(`/movies/${id}`);
    return response.data;
  },

  getNowShowing: async () => {
    const response = await API.get('/movies/now-showing');
    return response.data;
  },

  getComingSoon: async () => {
    const response = await API.get('/movies/coming-soon');
    return response.data;
  },

  getFeatured: async () => {
    const response = await API.get('/movies/featured');
    return response.data;
  },

  getPopular: async () => {
    const response = await API.get('/movies/popular');
    return response.data;
  },

  getMostViewed: async () => {
    const response = await API.get('/movies/most-viewed');
    return response.data;
  },

  searchMovies: async (query) => {
    const response = await API.get(`/movies/search?q=${query}`);
    return response.data;
  },

  getByCategory: async (categoryId) => {
    const response = await API.get(`/movies/category/${categoryId}`);
    return response.data;
  },

  getByGenre: async (genre) => {
    const response = await API.get(`/movies/genre/${genre}`);
    return response.data;
  },

  incrementView: async (id) => {
    const response = await API.post(`/movies/${id}/view`);
    return response.data;
  },

  // Admin operations
  createMovie: async (movieData) => {
    const response = await API.post('/movies', movieData);
    return response.data;
  },

  updateMovie: async (id, movieData) => {
    const response = await API.put(`/movies/${id}`, movieData);
    return response.data;
  },

  deleteMovie: async (id) => {
    await API.delete(`/movies/${id}`);
  }
};

export default movieService;
