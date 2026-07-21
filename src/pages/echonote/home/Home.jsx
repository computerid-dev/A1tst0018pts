/* ==========================================================
   Home.jsx — feed utama
   Menangani state offline (network-first) + integrasi
   VideoSearch untuk cari video di dalam feed.
   ========================================================== */

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../../services/firebaseClient";
import VideoSearch from "../../../components/VideoSearch";
import BottomNav from "../../../components/BottomNav";

export default function Home() {
  const [online, setOnline] = useState(navigator.onLine);
  const [posts, setPosts] = useState(null); // null = belum dicoba load
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }
    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!online) return;

    async function loadFeed() {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(20));
        const snap = await getDocs(q);
        setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Gagal memuat feed:", err.message);
        setPosts([]);
      }
    }

    loadFeed();
  }, [online]);

  const list = searchResults ?? posts;

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur px-4 py-3 border-b border-border">
        <h1 className="text-lg font-bold">EchoNote</h1>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {!online && (
          <div className="card p-6 text-center flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            <p className="text-sm">Menunggu koneksi internet...</p>
            <p className="text-xs text-muted">
              Sambil nunggu, konten offline akan tersedia begitu fitur video offline aktif.
            </p>
          </div>
        )}

        {online && (
          <>
            <VideoSearch onResults={setSearchResults} />

            {list === null && <p className="text-muted text-sm text-center">Memuat feed...</p>}

            {list?.length === 0 && (
              <p className="text-muted text-sm text-center">Belum ada postingan untuk ditampilkan.</p>
            )}

            <div className="flex flex-col gap-3">
              {list?.map((post) => (
                <div key={post.id} className="card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={post.authorAvatar || "/images/icons/icon-192.png"}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm font-semibold">{post.authorName || "EchoNote User"}</div>
                      <div className="text-xs text-muted">@{post.authorTag || "user"}</div>
                    </div>
                  </div>
                  <p className="text-sm">{post.caption}</p>
                </div>
              ))}
            </div>

            {list?.length === 0 && !searchResults && posts?.length === 0 && (
              <div className="card p-4 mt-3">
                <div className="flex items-center gap-3 mb-2">
                  <img src="/images/icons/icon-192.png" alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold">EchoNote Team</div>
                    <div className="text-xs text-muted">@echonote_official</div>
                  </div>
                </div>
                <p className="text-sm">
                  Selamat datang di EchoNote 🎉 Feed sebenarnya akan tampil di sini begitu postingan pertama dibuat.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
