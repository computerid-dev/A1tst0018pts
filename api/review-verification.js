/* ==========================================================
   api/review-verification.js
   POST /api/review-verification  (dipanggil dari panel admin)

   Header wajib: Authorization: Bearer <idToken admin>
   ========================================================== */

import { adminAuth, adminDb } from "./_lib/firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const authHeader = req.headers.authorization || "";
    const idToken = authHeader.replace("Bearer ", "");

    if (!idToken) {
      return res.status(401).json({ error: "Tidak ada token." });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);

    const adminDoc = await adminDb.collection("admins").doc(decoded.uid).get();

    if (!adminDoc.exists) {
      return res.status(403).json({ error: "Bukan akun admin." });
    }

    const { verificationId, decision } = req.body || {};

    if (!verificationId || !["approved", "rejected"].includes(decision)) {
      return res.status(400).json({ error: "Input tidak valid." });
    }

    const verifRef = adminDb.collection("verifications").doc(verificationId);
    const verifSnap = await verifRef.get();

    if (!verifSnap.exists) {
      return res.status(404).json({ error: "Data tidak ditemukan." });
    }

    await verifRef.update({
      status: decision,
      reviewedAt: Date.now(),
      reviewedBy: decoded.uid,
      readyToDelete: true // dihapus oleh cleanup-verifications cron
    });

    if (decision === "approved") {
      await adminDb.collection("users").doc(verifSnap.data().userId).update({
        verified: true,
        verifiedAt: Date.now()
      });
    }

    return res.status(200).json({
      success: true,
      message: `Verifikasi ditandai sebagai ${decision}.`
    });
  } catch (err) {
    console.error("review-verification failed:", err.message);
    return res.status(500).json({ error: "Gagal memproses review." });
  }
}
