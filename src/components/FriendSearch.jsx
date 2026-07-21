/* ==========================================================
   FriendSearch.jsx
   Cari user lain berdasarkan tagname (@handle) atau username.
   Dipakai di MeProfile.jsx.
   ========================================================== */

import { useState } from "react";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../services/firebaseClient";

export default function FriendSearch() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();

    const clean = term.trim().toLowerCase().replace(/^@/, "");

    if (!clean) return;

    setLoading(true);
    setSearched(true);

    try {
      const q = query(
        collection(db, "users"),
        orderBy("tagname"),
        where("tagname", ">=", clean),
        where("tagname", "<=", clean + "\uf8ff"),
        limit(10)
      );

      const snap = await getDocs(q);
      setResults(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Gagal mencari teman:", err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Cari @tagname teman..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button type="submit" className="btn-primary !w-auto px-4" disabled={loading}>
          {loading ? "..." : "Cari"}
        </button>
      </form>

      {searched && !loading && results.length === 0 && (
        <p className="text-muted text-sm mt-3">Tidak ada user ditemukan.</p>
      )}

      <div className="flex flex-col gap-2 mt-3">
        {results.map((u) => (
          <Link
            key={u.id}
            to={`/echonote/profile/${u.tagname}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-panel2 transition"
          >
            <img
              src={u.avatarUrl || "/images/icons/icon-192.png"}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-semibold">{u.username || "Tanpa nama"}</div>
              <div className="text-xs text-muted">@{u.tagname}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
