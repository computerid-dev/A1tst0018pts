/* ==========================================================
   firebaseClient.js
   Inisialisasi Firebase — SATU PROJECT (echonoteein) dipakai
   untuk semuanya: akun, feed, chat, storage.

   Pakai Firebase JS SDK v9+ modular (bukan lagi tag <script>
   global versi lama / firebase compat).
   ========================================================== */

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDey4n66dITqo44IQPdAP3rLQxEHEa078A",
  authDomain: "echonoteein.firebaseapp.com",
  projectId: "echonoteein",
  storageBucket: "echonoteein.firebasestorage.app",
  messagingSenderId: "381809531179",
  appId: "1:381809531179:web:c6b30fcf084af1b7ca0d6e",
  measurementId: "G-YNLVK574G9"
};

export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const auth = getAuth(firebaseApp);

/* Analytics cuma jalan di browser & kalau didukung (SSR/build
   time gak punya window, jadi harus dicek dulu). */
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((ok) => {
    if (ok) analytics = getAnalytics(firebaseApp);
  });
}
