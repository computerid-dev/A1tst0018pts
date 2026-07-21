/* ==========================================================
   api/send-otp.js
   POST /api/send-otp   body: { email }

   Tugas:
   - Validasi email
   - Rate limit: cooldown 60 detik antar request per email
   - Generate kode OTP 6 digit
   - Simpan ke Firestore collection "otp_verifications"
     (doc id = uid turunan dari email, HANYA bisa diakses
     server lewat Admin SDK — tidak pernah dari client)
   - Kirim kode via Resend
   - Balas status terkirim SAJA (kode OTP TIDAK PERNAH
     ikut dikirim balik ke response body)
   ========================================================== */

import { Resend } from "resend";
import { adminDb, FieldValue } from "./_lib/firebaseAdmin.js";
import { isValidEmail, normalizeEmail, emailToUid, generateOtpCode, sendJson } from "./_lib/utils.js";

const OTP_TTL_MS = 5 * 60 * 1000; // 5 menit
const COOLDOWN_MS = 60 * 1000; // 60 detik

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { ok: false, message: "Method tidak diizinkan." });
  }

  try {
    const { email } = req.body || {};

    if (!isValidEmail(email)) {
      return sendJson(res, 400, { ok: false, message: "Format email tidak valid." });
    }

    const normalized = normalizeEmail(email);
    const uid = emailToUid(normalized);
    const ref = adminDb.collection("otp_verifications").doc(uid);

    const existing = await ref.get();

    if (existing.exists) {
      const data = existing.data();
      const createdAtMs = data.createdAt?.toMillis ? data.createdAt.toMillis() : 0;

      if (Date.now() - createdAtMs < COOLDOWN_MS) {
        const waitSec = Math.ceil((COOLDOWN_MS - (Date.now() - createdAtMs)) / 1000);
        return sendJson(res, 429, {
          ok: false,
          message: `Tunggu ${waitSec} detik lagi sebelum minta kode baru.`
        });
      }
    }

    const code = generateOtpCode();
    const now = Date.now();

    await ref.set({
      email: normalized,
      code,
      createdAt: FieldValue.serverTimestamp(),
      createdAtMs: now,
      expiresAt: now + OTP_TTL_MS,
      attempted: false
    });

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.OTP_FROM_EMAIL || "EchoNote Auth <onboarding@resend.dev>",
      to: normalized,
      subject: "Kode verifikasi EchoNote kamu",
      html: `
        <div style="font-family:Segoe UI,Roboto,sans-serif;background:#050505;color:#fff;padding:32px;border-radius:16px;max-width:420px;margin:0 auto;">
          <h2 style="margin:0 0 4px;">EchoNote</h2>
          <p style="color:#9a9aa5;margin:0 0 24px;">Kode verifikasi masuk akunmu</p>
          <div style="font-size:32px;font-weight:700;letter-spacing:8px;background:#16161c;border:1px solid #242430;border-radius:12px;padding:16px;text-align:center;">
            ${code}
          </div>
          <p style="color:#9a9aa5;font-size:13px;margin-top:20px;">
            Kode ini berlaku selama 5 menit dan hanya bisa dipakai satu kali.
            Jangan bagikan kode ini ke siapa pun, termasuk yang mengaku dari tim EchoNote.
          </p>
        </div>
      `
    });

    if (error) {
      console.error("Resend error:", error);
      return sendJson(res, 502, { ok: false, message: "Gagal mengirim email, coba lagi." });
    }

    return sendJson(res, 200, { ok: true, message: "Kode OTP sudah dikirim ke email kamu." });
  } catch (err) {
    console.error("send-otp error:", err);
    return sendJson(res, 500, { ok: false, message: "Terjadi kesalahan di server." });
  }
}
