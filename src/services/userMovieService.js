import { authGet, authPost, authDelete } from './authFetch.js';

// ----- FAVORITES -----

export function getFavorites(page = 1, limit = 10) {
  return authGet(`/favorites?page=${page}&limit=${limit}`);
}

export function addToFavorites(movieId) {
  return authPost('/favorites', { movieId });
}

export function removeFromFavorites(movieId) {
  return authDelete(`/favorites/${movieId}`);
}

// ----- WATCHLIST -----

export function getWatchlist(page = 1, limit = 10) {
  return authGet(`/watchlist?page=${page}&limit=${limit}`);
}

export function addToWatchlist(movieId) {
  return authPost('/watchlist', { movieId });
}

export function removeFromWatchlist(movieId) {
  return authDelete(`/watchlist/${movieId}`);
}

// ----- RATINGS -----

// rate and update movie rating
export function rateMovie(movieId, rating) {
  return authPost('/ratings', { movieId, rating });
}

// ----- REVIEWS -----

export function getMyReviews(page = 1, limit = 10) {
  return authGet(`/reviews?page=${page}&limit=${limit}`);
}

export function postReview(movieId, review) {
  return authPost('/reviews', { movieId, review });
}

// export function updateReview(reviewId, comment) {
//   return authPatch(`/reviews/${reviewId}`, { comment });
// }

export function deleteReview(reviewId) {
  return authDelete(`/reviews/${reviewId}`);
}
