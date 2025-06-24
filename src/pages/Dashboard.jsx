import { useEffect, useState } from 'react';
import {
    getFavorites,
    getWatchlist,
    removeFromFavorites,
    removeFromWatchlist,
} from '../services/userMovieService.js';
import MovieCard from '../components/MovieCard.jsx';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext.jsx';

const Dashboard = () => {
    const [favorites, setFavorites] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    const fetchData = async () => {
        try {
            setError('');
            setLoading(true);

            const [favRes, watchRes] = await Promise.all([
                getFavorites(1, 4),
                getWatchlist(1, 4),
            ]);

            setFavorites(favRes.data.favorites);
            setWatchlist(watchRes.data.watchlist);
        } catch (err) {
            setError('Failed to load dashboard data. Please try again later.');
            console.error('Error loading dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (movieId) => {
        try {
            await removeFromFavorites(movieId);
            // setFavorites(favorites.filter((movie) => movie.movieId !== movieId));
            showToast('Removed from favorite', 'success');
            fetchData();
        } catch (err) {
            showToast(err.message, 'danger');
        }
    };

    const handleRemoveWatchlist = async (movieId) => {
        try {
            await removeFromWatchlist(movieId);
            // setWatchlist(watchlist.filter((movie) => movie.movieId !== movieId));
            showToast('Removed from watchlist', 'success');
            fetchData();
        } catch (err) {
            showToast(err.message, 'danger');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status"></div>
    </div>;
    if (error) return <div className="alert alert-danger mt-4">{error}</div>;

    return (
        <div className="container mt-5">
            <h2>My Dashboard</h2>


            <div className="my-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Favorite Movies</h4>
                    <Link to="/me/favorites" className="btn btn-sm btn-outline-primary">View All</Link>
                </div>
                <div className="row g-4">
                    {favorites.length === 0 ? (
                        <p>No favorite movies found.</p>
                    ) : (
                        favorites.map((item) => (
                            <div key={item.id} className="col-sm-6 col-md-4 col-lg-3">
                                <MovieCard movie={item.movie} 
                                    handleRemoveFromFavorites={() => handleRemoveFavorite(item.movie.id)} 
                                    handleRemoveFromWatchlist={() => handleRemoveWatchlist(item.movie.id)}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Watchlist */}
            <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Watchlist</h4>
                    <Link to="/me/watchlist" className="btn btn-sm btn-outline-primary">View All</Link>
                </div>
                <div className="row">
                    {watchlist.length === 0 ? (
                        <p>No watchlist movies found.</p>
                    ) : (
                        watchlist.map((item) => (
                            <div key={item.id} className="col-md-3 mb-3">
                                <MovieCard movie={item.movie} 
                                handleRemoveFromFavorites={() => handleRemoveFavorite(item.movie.id)} 
                                handleRemoveFromWatchlist={() => handleRemoveWatchlist(item.movie.id)}                                
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
