import { useEffect, useState } from 'react';
import { fetchDiscoverMovies, fetchTrendingMovies, fetchTopRatedMovies } from '../services/movieService.js';
import MovieGrid from '../components/MovieGrid.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function Home() {
  const [discover, setDiscover] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadMovies() {
      try {
        const [discoverRes, trendingRes, topRatedRes] = await Promise.all([
          fetchDiscoverMovies(),
          fetchTrendingMovies(),
          fetchTopRatedMovies(),
        ]);

        setDiscover(discoverRes.data);
        setTrending(trendingRes.data);
        setTopRated(topRatedRes.data);
      } catch (err) {
        showToast(err.message, 'danger');
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
    <div className="spinner-border text-primary" role="status"></div>
  </div>;

  return (
    <>
      <div className="container py-4">
        <h2 className="mt-5 mb-3">Discovered Movies</h2>
        <MovieGrid movies={discover.results} />

        <h2 className="mt-5 mb-3">Trending Now</h2>
        <MovieGrid movies={trending.results} />

        <h2 className="mt-5 mb-3">Top Rated</h2>
        <MovieGrid movies={topRated.results} />
      </div>
    </>
  );
}
