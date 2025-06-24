import { useEffect, useState } from 'react';
import { getFavorites, removeFromFavorites } from '../services/userMovieService.js';
import MovieCard from '../components/MovieCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const handleDelete = async (movieId) => {
    try {
      await removeFromFavorites(movieId); // or removeFromWatchlist
      setFavorites((prev) => prev.filter(item => item.movie.id !== movieId));
      showToast('Removed from favorites', 'success');
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await getFavorites(page, limit);
        setFavorites(res.data.favorites || []);
        setTotalCount(res.data.total_results || 0);
      } catch (err) {
        showToast(err.message || 'Failed to load favorite movies.', "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [page]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Favorite Movies</h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : favorites.length === 0 ? (
        <p className="text-muted text-center">You haven't added any favorites yet.</p>
      ) : (
        <>
          <div className="row g-4">
            {favorites.map((item) => (
              <div key={item.id} className="col-sm-6 col-md-4 col-lg-3">
                <MovieCard movie={item.movie} handleRemoveFromFavorites={() => handleDelete(item.movie.id)} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              maxVisible={7} // Optional: adjust visible range
            />
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;
