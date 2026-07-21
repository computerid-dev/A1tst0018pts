/* ==========================================================
   api/submit-verification.js
   POST /api/submit-verification

   Terima dokumen verifikasi (KTP / Kartu Pelajar / Sertifikat
   Izin), simpan file ke Firebase Storage, buat record status
   "pending" di Firestore dengan expireAt sebagai failsafe
   (auto-hapus maksimal 48 jam kalau admin lupa review).
   ========================================================== */

import { adminDb, adminBucket } from "./_lib/firebaseAdmin.js";
import { checkRequest } from "./_lib/security.js";

const MAX_LIFETIME_HOURS = 48;
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const VALID_DOC_TYPES = ["ktp", "kartu_pelajar", "sertifikat_izin"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (checkRequest(req, res)) return;

  try {
    const { userId, docType, fileBase64, fileMimeType, birthDate } = req.body || {};

    if (!userId || !docType || !fileBase64 || !fileMimeType) {
      return res.status(400).json({ error: "Data tidak lengkap." });
    }

    if (!VALID_DOC_TYPES.includes(docType)) {
      return res.status(400).json({ error: "Tipe dokumen tidak valid." });
    }

    if (docType === "kartu_pelajar" && !birthDate) {
      return res.status(400).json({
        error: "Tanggal lahir wajib diisi untuk verifikasi Kartu Pelajar."
      });
    }

    /* PENTING: jangan pernah console.log(fileBase64) atau payload
       yang mengandung isi dokumen. */

    const docId = adminDb.collection("verifications").doc().id;
    const storagePath = `verifications/${userId}/${docId}`;
    const fileBuffer = Buffer.from(fileBase64, "base64");

    if (fileBuffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ error: "Ukuran file maksimal 8MB." });
    }

    await adminBucket.file(storagePath).save(fileBuffer, {
      metadata: { contentType: fileMimeType }
    });

    const now = Date.now();
    const expireAt = now + MAX_LIFETIME_HOURS * 60 * 60 * 1000;

    await adminDb.collection("verifications").doc(docId).set({
      userId,
      docType,
      storagePath,
      birthDate: birthDate || null,
      status: "pending", // pending | approved | rejected
      createdAt: now,
      expireAt,
      reviewedAt: null,
      reviewedBy: null
    });

    return res.status(200).json({
      success: true,
      verificationId: docId,
      message: "Dokumen berhasil dikirim, menunggu review admin."
    });
  } catch (err) {
    console.error("submit-verification failed:", err.message);
    return res.status(500).json({ error: "Gagal memproses dokumen." });
  }
}
