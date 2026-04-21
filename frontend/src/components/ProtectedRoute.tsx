import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted">Loading SmartSeason...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
