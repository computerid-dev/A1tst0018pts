/* ==========================================================
   AuthContext.jsx
   Sumber kebenaran status login di seluruh app React.

   Karena login TIDAK pakai Firebase Auth email/password,
   melainkan OTP custom lewat /api/verify-otp yang membalas
   sebuah Firebase Custom Token, di sini kita cuma perlu
   dengarkan onAuthStateChanged seperti biasa — begitu
   signInWithCustomToken() dipanggil di AuthPage, listener
   ini otomatis update ke seluruh app.
   ========================================================== */

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseClient";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // firebase user object | null
  const [profile, setProfile] = useState(null); // dokumen di collection "users" | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser || null);

      if (fbUser) {
        try {
          const snap = await getDoc(doc(db, "users", fbUser.uid));
          setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        } catch (err) {
          console.error("Gagal ambil profil:", err.message);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* Dipanggil manual setelah SetupAccount / ProfileSettings
     menyimpan perubahan, supaya context langsung ke-update
     tanpa perlu reload halaman. */
  async function refreshProfile() {
    if (!auth.currentUser) return;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  }

  return (
    <AuthCtx.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
