/* ==========================================================
   VideoSearch.jsx
   Cari video di dalam feed berdasarkan caption/keyword.
   Dipakai di Home.jsx.
   ========================================================== */

import { useState } from "react";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseClient";

export default function VideoSearch({ onResults }) {
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();

    const clean = term.trim().toLowerCase();
    if (!clean) return;

    setLoading(true);

    try {
      const q = query(
        collection(db, "posts"),
        where("type", "==", "video"),
        orderBy("captionLower"),
        where("captionLower", ">=", clean),
        where("captionLower", "<=", clean + "\uf8ff"),
        limit(20)
      );

      const snap = await getDocs(q);
      onResults?.(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Gagal mencari video:", err.message);
      onResults?.([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Cari video di feed..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="submit" className="btn-secondary !w-auto px-4" disabled={loading}>
        {loading ? "..." : "🔍"}
      </button>
    </form>
  );
}
