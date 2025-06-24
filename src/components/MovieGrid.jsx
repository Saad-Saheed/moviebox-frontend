import MovieCard from './MovieCard.jsx';

const MovieGrid = ({ movies }) => {
  if (!movies?.length) return <p>No movies found.</p>;

  return (
     <div className="row g-4 movie-grid">
      {movies.map((movie) => (
        <div key={movie.id} className="col-sm-6 col-md-4 col-lg-3">
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
