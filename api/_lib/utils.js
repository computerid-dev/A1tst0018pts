/* ==========================================================
   api/_lib/utils.js
   ========================================================== */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return typeof email === "string" && EMAIL_RE.test(email.trim());
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

/* uid Firebase dibuat deterministik dari email supaya 1 email
   selalu jadi 1 uid yang sama tiap kali dia login lagi.
   Firebase uid boleh string custom asal <=128 karakter. */
export function emailToUid(email) {
  return "u_" + Buffer.from(normalizeEmail(email)).toString("base64url").slice(0, 120);
}

export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digit, 100000-999999
}

export function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}
