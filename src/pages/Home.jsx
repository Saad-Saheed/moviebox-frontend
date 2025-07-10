import { useEffect, useState } from 'react';
import { fetchDiscoverMovies, fetchTrendingMovies, fetchTopRatedMovies } from '../services/movieService.js';
import MovieGrid from '../components/MovieGrid.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function Home() {
  const [discover, setDiscover] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loadingDiscover, setLoadingDiscover] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingTopRated, setLoadingTopRated] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchDiscoverMovies()
      .then(res => setDiscover(res.data))
      .catch(err => showToast(err.message, 'danger'))
      .finally(() => setLoadingDiscover(false));

    fetchTrendingMovies()
      .then(res => setTrending(res.data))
      .catch(err => showToast(err.message, 'danger'))
      .finally(() => setLoadingTrending(false));

    fetchTopRatedMovies()
      .then(res => setTopRated(res.data))
      .catch(err => showToast(err.message, 'danger'))
      .finally(() => setLoadingTopRated(false));
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mt-5 mb-3">Discovered Movies</h2>
      {loadingDiscover ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '20vh' }}>
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <MovieGrid movies={discover.results} />
      )}

      <h2 className="mt-5 mb-3">Trending Now</h2>
      {loadingTrending ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '20vh' }}>
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <MovieGrid movies={trending.results} />
      )}

      <h2 className="mt-5 mb-3">Top Rated</h2>
      {loadingTopRated ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '20vh' }}>
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <MovieGrid movies={topRated.results} />
      )}
    </div>
  );
}