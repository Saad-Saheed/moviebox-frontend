import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  fetchMovieDetails,
  fetchSimilarMovies,
  getMovieAverageRating,
  getMovieReviews,
  getUserRatingForMovie,
  getUserReviewForMovie,
  isInFavorites,
  isInWatchlist
} from '../services/movieService.js';
import './MovieDetail.css';
import { addToFavorites, addToWatchlist, postReview, rateMovie } from '../services/userMovieService.js';
import ReviewCard from '../components/ReviewCard.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

const MovieDetail = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [inFavorites, setInFavorites] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState('');
  const [averageRating, setAverageRating] = useState(null);

  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  const handleAddToFavorites = async () => {
    try {
      const res = await addToFavorites(id);
      setInFavorites(true);
      showToast(res.message || 'Added to favorites!');
    } catch (error) {
      showToast(error?.statusCode === 403
        ? 'You must be logged in to add to favorites'
        : error.message || 'Failed to add to favorites', (error?.statusCode === 403 ? 'warning' : 'danger'));
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      const res = await addToWatchlist(id);
      setInWatchlist(true);
      showToast(res.message || 'Added to watchlist!');
    } catch (error) {
      showToast(error?.statusCode === 403
        ? 'You must be logged in to add to watchlist'
        : error.message || 'Failed to add to watchlist', (error?.statusCode === 403 ? 'warning' : 'danger'));
    }
  };

  const fetchExtraDetails = async () => {
    try {
      // 1. All Reviews
      const reviewsRes = await getMovieReviews(id);
      setReviews(reviewsRes.data.reviews || []);

      // 2. Average Rating     
      const ratingData = await getMovieAverageRating(id);
      setAverageRating(ratingData.data?.averageRating || null);

      // 3. User’s Rating
      if (token) {
        const userRatingRes = await getUserRatingForMovie(id);
        setUserRating(userRatingRes?.data?.rating || '');

        const userReviewRes = await getUserReviewForMovie(id);
        setUserReview(userReviewRes?.data?.review || '');
      }
    } catch (err) {
      console.error('Failed to fetch ratings or reviews', err);
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data.data);

        const similarRes = await fetchSimilarMovies(id);
        setSimilarMovies(similarRes.data.results || []);
      } catch (err) {
        setError(err.message || 'Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };

    const checkStatus = async () => {
      try {
        const favPromise = isInFavorites(id);
        const watchPromise = isInWatchlist(id);

        const [favResult, watchResult] = await Promise.allSettled([favPromise, watchPromise]);

        if (favResult.status === 'fulfilled') {
          setInFavorites(favResult.value.statusCode === 200);
        }
        if (watchResult.status === 'fulfilled') {
          setInWatchlist(watchResult.value.statusCode === 200);
        }
      } catch (error) {
        console.error('Error checking movie status:', error);
      }
    };

    fetchMovie();
    checkStatus();
    fetchExtraDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  return (
    <div className="container py-5">
      {/* Tabs nav */}
      <ul className="nav nav-tabs mt-5 mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'similar' ? 'active' : ''}`}
            onClick={() => setActiveTab('similar')}
          >
            Similar Movies
          </button>
        </li>
      </ul>

      {/* OVERVIEW TAB */}
      <div className="tab-content mt-3">
        <div className={`tab-pane ${activeTab === 'overview' ? 'active' : ''}`}>
          <div className="row align-items-start">
            <div className="col-md-4 mb-4 mb-md-0">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="img-fluid rounded shadow"
              />
            </div>

            <div className="col-md-8">
              <h2 className="mb-3">{movie.title}</h2>
              <p className="text-muted"><strong>Tagline:</strong> <em>{movie.tagline || 'N/A'}</em></p>
              <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
              <p><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</p>
              <p><strong>Language:</strong> {movie.original_language?.toUpperCase()}</p>
              <p><strong>Release Date:</strong> {movie.release_date}</p>
              <p><strong>Rating:</strong> ⭐ {movie.vote_average}</p>
              <p className="lead">{movie.overview}</p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <button className={`btn ${inFavorites ? 'btn-success' : 'btn-outline-primary'}`} onClick={handleAddToFavorites} disabled={inFavorites}>
                  {inFavorites ? '✓ In Favorites' : 'Add to Favorites'}
                </button>

                <button className={`btn ${inWatchlist ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={handleAddToWatchlist} disabled={inWatchlist}>
                  {inWatchlist ? '✓ In Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* REVIEWS TAB */}
        <div className={`tab-pane ${activeTab === 'reviews' ? 'active' : ''}`}>
          <h4 className="mt-5">Your Rating</h4>
          {!token ? (
            <div className="alert alert-info">Login to rate this movie.</div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setRatingSubmitting(true);
                try {
                  const res = await rateMovie(id, parseInt(userRating));
                  showToast(res.message || 'Rating submitted successfully!');
                  fetchExtraDetails();
                } catch (err) {
                  showToast(err.message, 'danger')
                } finally {
                  setRatingSubmitting(false);
                }
              }}
            >
              <div className="mb-3">
                <label className="form-label">Rate this movie</label>
                <select
                  className="form-select"
                  value={userRating}
                  onChange={(e) => setUserRating(e.target.value)}
                  required
                >
                  <option value="">Select a rating</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <option key={star} value={star}>{star} Star{star > 1 && 's'}</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary" disabled={ratingSubmitting}>
                {ratingSubmitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </form>
          )}

          <h4 className="mt-5">Your Review</h4>
          {!token ? (
            <div className="alert alert-info">Login to write a review.</div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setReviewSubmitting(true);
                try {
                  const res = await postReview(id, userReview);
                  showToast(res.message);
                  fetchExtraDetails();
                } catch (err) {
                  showToast(err.message, 'danger')
                } finally {
                  setReviewSubmitting(false);
                }
              }}
            >
              <div className="mb-3">
                <label className="form-label">Your thoughts</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  required
                ></textarea>
              </div>
              <button className="btn btn-secondary" disabled={reviewSubmitting}>
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          <hr className="my-5" />
          <h4>What Others Are Saying</h4>
          {averageRating && (
            <p className="text-warning fw-bold mb-4">
              Average Rating: {averageRating.toFixed(1)} / 10
            </p>
          )}

          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet.</p>
          ) : (
            <div>
              {reviews.map((rev) => (
                <ReviewCard
                  key={rev.id}
                  name={rev.user?.firstName || 'Anonymous'}
                  review={rev.review}
                  date={rev.createdAt}
                />
              ))}
            </div>

          )}
        </div>

        {/* SIMILAR MOVIES TAB */}
        <div className={`tab-pane ${activeTab === 'similar' ? 'active' : ''}`}>
          <div className="row g-4">
            {similarMovies.length === 0 ? (
              <p className="text-muted">No similar movie found.</p>
            ) : (
              similarMovies.slice(0, 8).map(similar => (
                <div key={similar.id} className="col-sm-6 col-md-4 col-lg-3">
                  <a href={`/movie/${similar.id}`} className="text-decoration-none text-dark">
                    <div className="card h-100 shadow-sm">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${similar.poster_path}`}
                        className="card-img-top"
                        alt={similar.title}
                      />
                      <div className="card-body">
                        <h6 className="card-title mb-1">{similar.title}</h6>
                        <small className="text-muted">{similar.release_date}</small>
                      </div>
                    </div>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;