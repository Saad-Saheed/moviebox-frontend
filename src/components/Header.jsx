import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Header = () => {
  const [query, setQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setIsCollapsed(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 sticky-top">
      <Link className="navbar-brand fw-bold" to="/">🎬 MovieBox</Link>

      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-controls="navbarContent"
        aria-expanded={!isCollapsed}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarContent">
        <form className="d-flex mt-3 mt-lg-0 ms-auto me-lg-3" onSubmit={handleSearch}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search movies..."
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-outline-primary" type="submit">Search</button>
        </form>

        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 mt-3 mt-lg-0">
          {!isAuthenticated ? (
            <>
              <Link className="btn btn-outline-secondary" to="/login">Login</Link>
              <Link className="btn btn-primary" to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-success" to="/me/dashboard">Dashboard</Link>
              <Link className="btn btn-outline-primary" to="/me/favorites">Favorites</Link>
              <Link className="btn btn-outline-secondary" to="/me/watchlist">Watchlist</Link>
              <div className="dropdown">
                <button
                  className="btn btn-light border-0 dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="avatarDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle bg-primary text-white text-uppercase d-flex justify-content-center align-items-center"
                    style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}
                  >
                    {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                  </div>
                </button>

                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="avatarDropdown">
                  <li><Link className="dropdown-item" to="/me/profile">Profile</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>


            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
