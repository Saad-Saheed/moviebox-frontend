import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="text-center py-5">Checking authentication...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
