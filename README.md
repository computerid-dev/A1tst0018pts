# EchoNote (echoauth_v1) — Vercel Edition

PWA sosial media dengan login OTP email (tanpa password), 1 project Firebase (`echonoteein`) untuk akun, feed, chat, dan storage.

## Stack
- **Frontend:** React (Vite) + React Router DOM + Tailwind CSS
- **Backend:** Vercel Serverless Functions (`/api`)
- **Auth:** OTP 6 digit via email (Resend), sesi via Firebase Custom Token
- **Database:** Firebase Firestore (client SDK v9 modular)
- **Storage:** Firebase Storage (avatar, banner)

## Setup lokal

```bash
npm install
cp .env.local.example .env.local   # kalau kamu buat file example, atau edit .env.local langsung
npm run dev
```

Isi `.env.local` dengan:
- `RESEND_API_KEY` — dari https://resend.com/api-keys
- `FIREBASE_SERVICE_ACCOUNT` — JSON service account project `echonoteein` (1 baris string JSON)
- `FIREBASE_STORAGE_BUCKET` — `echonoteein.firebasestorage.app`
- `OTP_FROM_EMAIL` — alamat pengirim OTP (harus domain terverifikasi di Resend)

> Untuk jalankan `/api/*` secara lokal, pakai `vercel dev` (install Vercel CLI: `npm i -g vercel`), karena Vite dev server saja tidak menjalankan serverless functions.

## Deploy ke Vercel

1. Push project ini ke GitHub.
2. Import repo di [vercel.com/new](https://vercel.com/new).
3. Tambahkan semua env var di atas ke **Project Settings > Environment Variables**.
4. Deploy — `vercel.json` sudah mengatur SPA fallback & cron cleanup OTP otomatis.

## Alur OTP

1. User isi email di halaman Auth → `POST /api/send-otp` → kode 6 digit disimpan di Firestore (`otp_verifications`, hanya bisa diakses server) + dikirim via Resend.
2. User isi kode → `POST /api/verify-otp`.
   - Kode cocok → dokumen OTP dihapus, custom token Firebase dibalas, redirect ke `/setup-account` (kalau belum punya profil) atau `/echonote/home`.
   - Kode **salah** → dokumen OTP **langsung dihapus** (single-try invalidation), user wajib klik "Kirim Kode Baru".
   - Kode kedaluwarsa (>5 menit) → sama, wajib minta kode baru.

## Struktur folder

```
echoauth_v1/
├── api/                      # Vercel Serverless Functions
│   ├── send-otp.js
│   ├── verify-otp.js
│   ├── submit-verification.js
│   ├── review-verification.js
│   ├── cleanup-verifications.js   # dipanggil otomatis via Vercel Cron
│   └── _lib/                      # helper bareng (firebase-admin, security, utils)
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   ├── setup-account/
│   │   └── echonote/
│   │       ├── home/
│   │       ├── me-profile/
│   │       ├── setting-profile/
│   │       ├── profile-others/
│   │       └── developer_options/   # menu "Tentang" / info developer
│   └── services/
├── vercel.json
└── package.json
```

## Catatan keamanan
Pasang Firestore & Storage Security Rules sebelum production:
- Collection `otp_verifications` **hanya** boleh diakses Admin SDK (server), blokir total dari client.
- Collection `users`/`posts` — user cuma boleh tulis dokumen miliknya sendiri (`request.auth.uid`).
- Rate limit `/api/send-otp` sudah ada (cooldown 60 detik per email), tapi pertimbangkan tambahan seperti Vercel Firewall/Upstash kalau trafik besar.
