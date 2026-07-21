/* ==========================================================
   AuthPage.jsx
   Langkah 1: input email -> POST /api/send-otp
   Langkah 2: input 6 digit kode -> POST /api/verify-otp
              -> signInWithCustomToken(token)
              -> redirect ke /setup-account atau /echonote/home
   ========================================================== */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../services/firebaseClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [emailErr, setEmailErr] = useState("");
  const [codeErr, setCodeErr] = useState("");

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  function startCooldown(seconds) {
    setCooldown(seconds);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  async function handleSendOtp(e) {
    e?.preventDefault();
    setEmailErr("");

    const clean = email.trim();

    if (!clean) {
      setEmailErr("Email wajib diisi.");
      return;
    }

    if (!EMAIL_RE.test(clean)) {
      setEmailErr("Format email tidak valid.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean })
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setEmailErr(data.message || "Gagal mengirim kode OTP.");
        return;
      }

      setStep("otp");
      setCode("");
      setCodeErr("");
      startCooldown(60);
    } catch (err) {
      setEmailErr("Gagal terhubung ke server, cek koneksi internet.");
    } finally {
      setSending(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setCodeErr("");

    if (code.trim().length !== 6) {
      setCodeErr("Kode OTP harus 6 digit.");
      return;
    }

    setVerifying(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim() })
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setCodeErr(data.message || "Kode salah, minta kode baru.");

        /* Single-try invalidation: kode langsung mati, paksa
           user balik ke langkah minta kode baru. */
        if (data.code === "WRONG_CODE" || data.code === "EXPIRED" || data.code === "NOT_FOUND") {
          setCode("");
        }
        return;
      }

      await signInWithCustomToken(auth, data.token);

      navigate(data.hasProfile ? "/echonote/home" : "/setup-account", { replace: true });
    } catch (err) {
      setCodeErr("Gagal terhubung ke server, cek koneksi internet.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-sm p-8">
        <div className="text-2xl font-bold text-center">EchoNote</div>
        <p className="text-muted text-sm text-center mt-1 mb-6">
          {step === "email" ? "Masuk tanpa password, cukup pakai email" : `Kode dikirim ke ${email}`}
        </p>

        {step === "email" && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-1">
            <input
              type="email"
              placeholder="Alamat email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <div className="field-error">{emailErr}</div>

            <button type="submit" className="btn-primary mt-3" disabled={sending}>
              {sending ? "Mengirim..." : "Kirim Kode OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerify} className="flex flex-col gap-1">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Kode 6 digit"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="text-center tracking-[10px] text-xl font-bold"
              autoFocus
            />
            <div className="field-error">{codeErr}</div>

            <button type="submit" className="btn-primary mt-3" disabled={verifying}>
              {verifying ? "Memverifikasi..." : "Verifikasi & Masuk"}
            </button>

            <button
              type="button"
              className="btn-secondary mt-2 text-sm"
              disabled={cooldown > 0 || sending}
              onClick={handleSendOtp}
            >
              {cooldown > 0 ? `Kirim Kode Baru (${cooldown}s)` : "Kirim Kode Baru"}
            </button>

            <button
              type="button"
              className="text-muted text-xs mt-3 underline text-center"
              onClick={() => {
                setStep("email");
                setCode("");
                setCodeErr("");
              }}
            >
              Ganti email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
