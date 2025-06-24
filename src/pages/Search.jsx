import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/movieService.js';
import MovieGrid from '../components/MovieGrid.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import Pagination from '../components/Pagination.jsx';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'relevance';

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const [page, setPage] = useState(1);
    const limit = 20;
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) return;

            setLoading(true);
            try {
                const res = await searchMovies(query, page, limit);
                let fetchedResults = res.data.results || [];

                // Perform client-side sorting
                switch (sort) {
                    case 'popularity.desc':
                        fetchedResults.sort((a, b) => b.popularity - a.popularity);
                        break;
                    case 'vote_average.desc':
                        fetchedResults.sort((a, b) => b.vote_average - a.vote_average);
                        break;
                    case 'release_date.desc':
                        fetchedResults.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
                        break;
                    case 'release_date.asc':
                        fetchedResults.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
                        break;
                    case 'title.asc':
                        fetchedResults.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                        break;
                    case 'title.desc':
                        fetchedResults.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
                        break;
                    default:
                        break; // relevance = as-is
                }

                setResults(fetchedResults);
                setTotalCount(res.data.total_results || 0);
            } catch (err) {
                showToast(err.message || 'Failed to fetch results. Please try again.', 'danger');
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, page, sort]);

    const handleSortChange = (e) => {
        searchParams.set('sort', e.target.value);
        setSearchParams(searchParams); // Triggers useEffect
    };

    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="container py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <h2 className="mb-3 mb-md-0">Search Results for "<strong>{query}</strong>"</h2>
                <div className="d-inline-block">
                    <select className="form-select" value={sort} onChange={handleSortChange}>
                        <option value="relevance">Sort by Relevance</option>
                        <option value="popularity.desc">Most Popular</option>
                        <option value="vote_average.desc">Top Rated</option>
                        <option value="title.asc">Title (ASC)</option>
                        <option value="title.desc">Title (DESC)</option>
                        <option value="release_date.desc">Newest</option>
                        <option value="release_date.asc">Oldest</option>
                    </select>
                </div>
            </div>

            {loading && (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            )}

            {!loading && results.length > 0 && (
                <>
                    <p className="mb-3 text-muted">{totalCount} result(s) found</p>
                    <MovieGrid movies={results} />
                </>
            )}

            {!loading && results.length === 0 && (
                <div className="text-center py-5 text-muted">
                    <h4>No results found for "<strong>{query}</strong>"</h4>
                    <p>Try searching with different keywords or spelling.</p>
                </div>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    maxVisible={7}
                />
            )}
        </div>
    );
};

export default Search;