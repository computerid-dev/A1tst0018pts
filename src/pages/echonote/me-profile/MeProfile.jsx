/* ==========================================================
   MeProfile.jsx — profil user yang sedang login
   ========================================================== */

import { Link } from "react-router-dom";
import { useAuth } from "../../../services/AuthContext";
import FriendSearch from "../../../components/FriendSearch";
import BottomNav from "../../../components/BottomNav";
import defaultAvatar from "../../../assets/default-avatar.png";

export default function MeProfile() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="min-h-screen pb-20">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h1 className="text-lg font-bold">Profil</h1>
        <Link to="/echonote/setting-profile" className="text-xl">
          ⚙️
        </Link>
      </header>

      <div
        className="w-full aspect-[16/9] bg-panel2 bg-cover bg-center"
        style={profile.bannerUrl ? { backgroundImage: `url(${profile.bannerUrl})` } : {}}
      />

      <div className="px-4 -mt-8">
        <img
          src={profile.avatarUrl || defaultAvatar}
          alt=""
          className="w-20 h-20 rounded-full object-cover border-4 border-bg"
        />

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold">{profile.username}</span>
          {profile.verified && <span title="Terverifikasi">✔️</span>}
        </div>

        <div className="text-muted text-sm">@{profile.tagname}</div>
        <p className="text-sm mt-2">{profile.bio}</p>

        {profile.links?.length > 0 && (
          <div className="flex flex-col gap-1 mt-2">
            {profile.links.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="text-accent2 text-sm">
                🔗 {l.label || l.url}
              </a>
            ))}
          </div>
        )}

        <Link to="/echonote/setting-profile" className="block mt-4">
          <button className="btn-secondary">Edit Profil</button>
        </Link>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-muted mb-2">Cari Teman</h2>
          <FriendSearch />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted">Grid video/postingan milik kamu akan tampil di sini.</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
