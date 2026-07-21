import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./services/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import SetupAccount from "./pages/setup-account/SetupAccount";
import Home from "./pages/echonote/home/Home";
import MeProfile from "./pages/echonote/me-profile/MeProfile";
import ProfileSettings from "./pages/echonote/setting-profile/ProfileSettings";
import ProfileOthers from "./pages/echonote/profile-others/ProfileOthers";
import OpsiDeveloper from "./pages/echonote/developer_options/opsi_developer";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted text-sm">
        Memuat...
      </div>
    );
  }

  return (
    <Routes>
      {/* Halaman auth (kalau sudah login, lempar ke home) */}
      <Route path="/" element={user ? <Navigate to="/echonote/home" replace /> : <AuthPage />} />

      {/* Onboarding: harus login dulu, tapi belum tentu punya profil,
          jadi ini di luar ProtectedRoute biar gak muter-muter redirect */}
      <Route
        path="/setup-account"
        element={user ? <SetupAccount /> : <Navigate to="/" replace />}
      />

      {/* Semua halaman /echonote/* dijaga ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route path="/echonote/home" element={<Home />} />
        <Route path="/echonote/me-profile" element={<MeProfile />} />
        <Route path="/echonote/setting-profile" element={<ProfileSettings />} />
        <Route path="/echonote/profile/:tagname" element={<ProfileOthers />} />
        <Route path="/echonote/developer-options" element={<OpsiDeveloper />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
