import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Wait for the session to hydrate before deciding — avoids a flash redirect
  // to /signin on refresh while Supabase restores the session.
  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-loading">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return children;
}
