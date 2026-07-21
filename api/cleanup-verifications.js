/* ==========================================================
   api/cleanup-verifications.js
   Dipanggil otomatis oleh Vercel Cron (lihat vercel.json,
   "crons": 1x sehari jam 03:00 WIB — dibatasi paket Hobby
   Vercel yang cuma boleh 1x/hari per cron job, gak bisa
   tiap 15 menit kayak versi Netlify dulu).

   Hapus dokumen verifikasi yang:
   1. Sudah direview admin (readyToDelete = true), ATAU
   2. Sudah lewat 48 jam sejak upload (expireAt <= sekarang)
      — jaring pengaman kalau admin lupa/telat review.

   Yang dihapus: file di Storage + dokumen Firestore-nya.
   Tidak ada arsip/backup manual (data minimization).
   ========================================================== */

import { adminDb, adminBucket } from "./_lib/firebaseAdmin.js";

export default async function handler(req, res) {
  /* Vercel Cron mengirim header rahasia otomatis; kalau mau
     lebih ketat, cek req.headers['authorization'] terhadap
     process.env.CRON_SECRET yang kamu set di dashboard. */

  try {
    const now = Date.now();
    let deletedCount = 0;

    const reviewedSnap = await adminDb
      .collection("verifications")
      .where("readyToDelete", "==", true)
      .get();

    for (const doc of reviewedSnap.docs) {
      await deleteVerification(doc);
      deletedCount++;
    }

    const expiredSnap = await adminDb
      .collection("verifications")
      .where("status", "==", "pending")
      .where("expireAt", "<=", now)
      .get();

    for (const doc of expiredSnap.docs) {
      await deleteVerification(doc);
      deletedCount++;
    }

    console.log(`cleanup-verifications: ${deletedCount} dokumen dihapus.`);

    return res.status(200).json({ deleted: deletedCount });
  } catch (err) {
    console.error("cleanup-verifications failed:", err.message);
    return res.status(500).json({ error: "Gagal menjalankan cleanup." });
  }
}

async function deleteVerification(doc) {
  const data = doc.data();

  try {
    await adminBucket.file(data.storagePath).delete({ ignoreNotFound: true });
  } catch (err) {
    console.error(`Gagal hapus file storage untuk ${doc.id}:`, err.message);
  }

  await doc.ref.delete();
}
