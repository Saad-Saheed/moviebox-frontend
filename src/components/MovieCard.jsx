import { useState } from 'react';
import { useToast } from '../contexts/ToastContext.jsx';
import { addToFavorites, addToWatchlist } from '../services/userMovieService.js';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie, handleRemoveFromFavorites = null, handleRemoveFromWatchlist = null }) => {
  const [loadingFav, setLoadingFav] = useState(false);
  const [loadingWatch, setLoadingWatch] = useState(false);
  const { showToast } = useToast();
  const token = localStorage.getItem('token');


  const handleAddToFavorites = async () => {
    if (!token) return showToast('Login required to add to favorites', 'warning');
    setLoadingFav(true);
    try {
      const res = await addToFavorites(movie.id);
      showToast(res.message || 'Added to favorites');
    } catch (err) {
      showToast(err.message || 'Failed to add to favorites', 'danger');
    } finally {
      setLoadingFav(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!token) return showToast('Login required to add to watchlist', 'warning');
    setLoadingWatch(true);
    try {
      const res = await addToWatchlist(movie.id);
      showToast(res.message || 'Added to watchlist');
    } catch (err) {
      showToast(err.message || 'Failed to add to watchlist', 'danger');
    } finally {
      setLoadingWatch(false);
    }
  };

  return (
    <div className="card h-100 movie-card shadow-sm">
      <Link to={`/movie/${movie.id}`} className="text-decoration-none text-dark movie-link">
        <div className="poster-wrapper">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="card-img-top movie-poster"
            alt={movie.title}
            style={{ objectFit: 'cover', height: '100%' }}
          />
        </div>
      </Link>

      <div className="card-body d-flex flex-column justify-content-between">
        <h6 className="card-title mb-1">{movie.title}</h6>
        <small className="text-muted">{movie.release_date}</small>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className={`btn btn-sm ${handleRemoveFromFavorites ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
            onClick={handleRemoveFromFavorites ? handleRemoveFromFavorites : handleAddToFavorites}
            disabled={loadingFav}
            title={handleRemoveFromFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            {loadingFav ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (
              (handleRemoveFromFavorites) ?
                (
                  <i className="bi bi-trash me-2"></i>
                ) : (
                  <i className="bi bi-heart me-2"></i>
                )
            )}
            Favorite
          </button>

          <button
            className={`btn btn-sm ${handleRemoveFromWatchlist ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
            onClick={handleRemoveFromWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
            disabled={loadingWatch}
            title={handleRemoveFromWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {loadingWatch ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (

              (handleRemoveFromWatchlist) ?
                (
                  <i className="bi bi-trash me-2"></i>
                ) : (
                  <i className="bi bi-bookmark-plus me-2"></i>
                )
            )}
            Watchlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
