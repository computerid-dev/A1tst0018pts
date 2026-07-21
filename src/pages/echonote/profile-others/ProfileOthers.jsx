/* ==========================================================
   ProfileOthers.jsx — lihat profil user lain
   Akses lewat: /echonote/profile/:tagname
   ========================================================== */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "../../../services/firebaseClient";
import BottomNav from "../../../components/BottomNav";
import defaultAvatar from "../../../assets/default-avatar.png";

export default function ProfileOthers() {
  const { tagname } = useParams();
  const [data, setData] = useState(undefined); // undefined = loading, null = tidak ada

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, "users"), where("tagname", "==", tagname), limit(1));
        const snap = await getDocs(q);
        setData(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
      } catch (err) {
        console.error("Gagal memuat profil:", err.message);
        setData(null);
      }
    }
    load();
  }, [tagname]);

  return (
    <div className="min-h-screen pb-20">
      <header className="flex items-center px-4 py-3 border-b border-border">
        <Link to="/echonote/me-profile" className="mr-3">
          ←
        </Link>
        <h1 className="text-lg font-bold">@{tagname}</h1>
      </header>

      {data === undefined && <p className="text-muted text-sm text-center mt-6">Memuat profil...</p>}
      {data === null && <p className="text-muted text-sm text-center mt-6">Profil tidak ditemukan.</p>}

      {data && (
        <>
          <div
            className="w-full aspect-[16/9] bg-panel2 bg-cover bg-center"
            style={data.bannerUrl ? { backgroundImage: `url(${data.bannerUrl})` } : {}}
          />
          <div className="px-4 -mt-8">
            <img
              src={data.avatarUrl || defaultAvatar}
              alt=""
              className="w-20 h-20 rounded-full object-cover border-4 border-bg"
            />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold">{data.username}</span>
              {data.verified && <span title="Terverifikasi">✔️</span>}
            </div>
            <div className="text-muted text-sm">@{data.tagname}</div>
            <p className="text-sm mt-2">{data.bio}</p>

            <button className="btn-secondary mt-4">Ikuti</button>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
