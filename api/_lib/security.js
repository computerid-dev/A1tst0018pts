/* ==========================================================
   api/_lib/security.js
   Gabungan dari anti-clone.js + anti-scrape.js versi lama,
   dikonversi ke format request/response Vercel.

   PENTING: ini bukan proteksi sempurna — orang yang niat
   tetap bisa palsukan header ini kalau manggil API langsung.
   Proteksi paling kuat tetap: autentikasi wajib (verifyIdToken)
   + Firestore Security Rules, bukan cuma cek header.
   ========================================================== */

const ALLOWED_ORIGINS = [
  "https://echonoteein.vercel.app", // domain official (nanti, masih placeholder)
  "https://echo0note0test.vercel.app", // domain testing yang sedang dipakai sekarang
  "http://localhost:5173" // buat testing lokal (vite dev)
  /* TODO: tambahkan custom domain kamu sendiri di sini juga */
];

const BLOCKED_UA_PATTERNS = [
  /curl/i,
  /wget/i,
  /python-requests/i,
  /scrapy/i,
  /HeadlessChrome/i,
  /PhantomJS/i,
  /^$/
];

export function checkOrigin(req, res) {
  const origin = req.headers["origin"] || req.headers["referer"] || "";
  const isAllowed = ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));

  if (!isAllowed) {
    res.status(403).json({ error: "Origin tidak diizinkan." });
    return true;
  }

  return false;
}

export function checkRequest(req, res) {
  const ua = req.headers["user-agent"] || "";
  const isBlocked = BLOCKED_UA_PATTERNS.some((pattern) => pattern.test(ua));

  if (isBlocked) {
    res.status(403).json({ error: "Akses ditolak." });
    return true;
  }

  return false;
}
