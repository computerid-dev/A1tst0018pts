/* ==========================================================
   ProtectedRoute.jsx
   - Belum login -> redirect ke AuthPage (/)
   - Sudah login tapi belum punya dokumen profil di "users"
     -> redirect ke /setup-account
   - Sudah login & sudah punya profil -> tampilkan halaman
   ========================================================== */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function ProtectedRoute() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted text-sm">
        Memuat sesi...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!profile && location.pathname !== "/setup-account") {
    return <Navigate to="/setup-account" replace />;
  }

  return <Outlet />;
}
