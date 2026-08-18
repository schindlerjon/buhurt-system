import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // wait until we know who's logged in before deciding anything
  }

  if (!user || user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;