/* ==========================================================
   api/_lib/firebaseAdmin.js
   Init Firebase Admin SEKALI SAJA, dipakai bareng-bareng
   oleh semua Vercel Function di folder /api.
   ========================================================== */

import admin from "firebase-admin";

function getServiceAccount() {
  /* Cara 1 (DISARANKAN buat yang kerja dari HP): 3 env var terpisah.
     Lebih tahan banting daripada 1 JSON raksasa, karena paste JSON
     panjang di textarea HP rawan corrupt (tanda kutip lurus " suka
     otomatis diganti keyboard/browser jadi kutip lengkung, atau
     newline kepotong). */

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKeyRaw) {
    return {
      projectId,
      clientEmail,
      /* Kalau private key ditempel APA ADANYA (ada baris baru
         beneran di textarea Vercel) -> aman, biarin.
         Kalau ditempel sebagai satu baris dengan literal "\n"
         (backslash-n) -> ubah jadi baris baru beneran di sini. */
      privateKey: privateKeyRaw.includes("\\n") ? privateKeyRaw.replace(/\\n/g, "\n") : privateKeyRaw
    };
  }

  /* Cara 2 (fallback lama): 1 env var berisi JSON utuh */

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!raw) {
    throw new Error(
      "Kredensial Firebase belum diisi. Isi FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY, " +
        "atau FIREBASE_SERVICE_ACCOUNT (JSON utuh)."
    );
  }

  return JSON.parse(raw);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(getServiceAccount()),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminBucket = admin.storage().bucket();
export const FieldValue = admin.firestore.FieldValue;
