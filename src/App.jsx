import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MovieDetails from './pages/MovieDetail.jsx';
import Profile from './pages/Profile.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Favorites from './pages/Favorites.jsx';
import Watchlist from './pages/Watchlist.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Header from './components/Header.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        {/* Main content area */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* auth routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/me/profile" element={<Profile />} />
            <Route path="/me/favorites" element={<Favorites />} />
            <Route path="/me/watchlist" element={<Watchlist />} />
            <Route path="/me/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
