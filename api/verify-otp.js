/* ==========================================================
   api/verify-otp.js
   POST /api/verify-otp   body: { email, code }

   Aturan Single-Try Invalidation:
   - Kalau dokumen OTP tidak ada / sudah expired -> gagal,
     user wajib minta kode baru.
   - Kalau code cocok -> hapus dokumen OTP, buat/pastikan
     custom token Firebase, balas sukses + info apakah user
     ini sudah punya profil di collection "users" atau belum
     (dipakai frontend untuk redirect ke /setup-account atau
     langsung ke /echonote/home).
   - Kalau code TIDAK cocok -> dokumen OTP LANGSUNG DIHAPUS
     juga (bukan cuma ditandai attempted). Tidak ada percobaan
     kedua untuk kode yang sama, user harus minta kode baru.
   ========================================================== */

import { adminAuth, adminDb } from "./_lib/firebaseAdmin.js";
import { isValidEmail, normalizeEmail, emailToUid, sendJson } from "./_lib/utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { ok: false, message: "Method tidak diizinkan." });
  }

  try {
    const { email, code } = req.body || {};

    if (!isValidEmail(email) || !code) {
      return sendJson(res, 400, { ok: false, message: "Email dan kode wajib diisi." });
    }

    const normalized = normalizeEmail(email);
    const uid = emailToUid(normalized);
    const ref = adminDb.collection("otp_verifications").doc(uid);
    const snap = await ref.get();

    if (!snap.exists) {
      return sendJson(res, 400, {
        ok: false,
        code: "NOT_FOUND",
        message: "Kode tidak ditemukan atau sudah kedaluwarsa. Minta kode baru."
      });
    }

    const data = snap.data();

    if (Date.now() > data.expiresAt) {
      await ref.delete();
      return sendJson(res, 400, {
        ok: false,
        code: "EXPIRED",
        message: "Kode sudah kedaluwarsa. Minta kode baru."
      });
    }

    if (String(code).trim() !== String(data.code)) {
      /* SINGLE-TRY INVALIDATION: kode salah -> hapus dokumen,
         tidak ada kesempatan kedua untuk kode yang sama. */
      await ref.delete();

      return sendJson(res, 400, {
        ok: false,
        code: "WRONG_CODE",
        message: "Kode salah, kode sudah tidak berlaku. Minta kode baru."
      });
    }

    /* Kode benar -> hapus dokumen OTP, lanjut buat sesi */
    await ref.delete();

    /* Pastikan akun Firebase Auth ada (dipakai buat custom
       token + request.auth.uid di Security Rules) */
    try {
      await adminAuth.getUser(uid);
    } catch {
      await adminAuth.createUser({ uid, email: normalized, emailVerified: true });
    }

    const customToken = await adminAuth.createCustomToken(uid);

    const profileSnap = await adminDb.collection("users").doc(uid).get();

    return sendJson(res, 200, {
      ok: true,
      message: "Verifikasi berhasil.",
      token: customToken,
      hasProfile: profileSnap.exists
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    return sendJson(res, 500, { ok: false, message: "Terjadi kesalahan di server." });
  }
}
