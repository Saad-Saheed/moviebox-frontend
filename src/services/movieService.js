const API_BASE = import.meta.env.VITE_BACKEND_URL;

// Helper function to handle fetch responses
async function handleResponse(response) {
  const result = await response.json();
  if (!response.ok) {
    throw result; // return the error data as it is coming from the backend
  }
  return result;
}

// Get discovered movies
export async function fetchDiscoverMovies(page = 1, limit = 10) {
  const res = await fetch(`${API_BASE}/movies/discover?page=${page}&limit=${limit}`);
  return await handleResponse(res);
}

// Get trending movies
export async function fetchTrendingMovies(page = 1, limit = 10) {
  const res = await fetch(`${API_BASE}/movies/trending?page=${page}&limit=${limit}`);
  return await handleResponse(res);
}

// Get top-rated movies
export async function fetchTopRatedMovies(page = 1, limit = 10) {
  const res = await fetch(`${API_BASE}/movies/top-rated?page=${page}&limit=${limit}`);
  return await handleResponse(res);
}

// Get movie details by TMDB movie ID
export async function fetchMovieDetails(movieId) {
  const res = await fetch(`${API_BASE}/movies/${movieId}`);
  return await handleResponse(res);
}

export const fetchSimilarMovies = async (id) => {
  const res = await fetch(`${API_BASE}/movies/${id}/similar`);
  return await handleResponse(res);
};

export const getMovieReviews = async (movieId, page = 1, limit = 10) => {
  const res = await fetch(`${API_BASE}/movies/${movieId}/reviews?page=${page}&limit=${limit}`);
  return await handleResponse(res);
};

export const getMovieAverageRating = async (movieId) => {
  const res = await fetch(`${API_BASE}/movies/${movieId}/ratings/average`);
  return await handleResponse(res);
}

export const getUserReviewForMovie = async (movieId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/movies/${movieId}/user/review`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await handleResponse(res);
};

export const getUserRatingForMovie = async (movieId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/movies/${movieId}/user/rating`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await handleResponse(res);
};

// Search for movies
export async function searchMovies(query, page = 0, limit = 20) {
  const res = await fetch(`${API_BASE}/movies/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  return await handleResponse(res);
}

export const isInFavorites = async (movieId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/favorites/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await handleResponse(res);
};

export const isInWatchlist = async (movieId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/watchlist/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await handleResponse(res);
};
