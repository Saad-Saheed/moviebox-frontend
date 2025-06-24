import { useEffect, useState } from 'react';
import { getWatchlist, removeFromWatchlist } from '../services/userMovieService.js';
import MovieCard from '../components/MovieCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const handleDelete = async (movieId) => {
    try {
      await removeFromWatchlist(movieId); // or removeFromWatchlist
      setWatchlist((prev) => prev.filter(item => item.movie.id !== movieId));
      showToast('Removed from watchlist', 'success');
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };


  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const res = await getWatchlist(page, limit);
        setWatchlist(res.data.watchlist || []);
        setTotalCount(res.data.total_results || 0);
      } catch (err) {
        showToast(err.message || 'Failed to load watchlist movies.', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [page]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Watchlist</h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : watchlist.length === 0 ? (
        <p>You haven't added any movies to your watchlist yet.</p>
      ) : (
        <>
          <div className="row g-4">
            {watchlist.map((item) => (
              <div key={item.id} className="col-sm-6 col-md-4 col-lg-3">
                <MovieCard movie={item.movie} handleRemoveFromWatchlist={() => handleDelete(item.movie.id)} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              maxVisible={7} // Optional: adjust to 5, 7, or 9 for wider/narrower UI
            />
          )}
        </>
      )}
    </div>
  );
};

export default Watchlist;
