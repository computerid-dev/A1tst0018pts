/* ==========================================================
   opsi_developer.jsx — Opsi Developer / Tentang Website
   Menampilkan info resmi pembuat & saluran EchoNote.
   Akses lewat: /echonote/developer-options
   ========================================================== */

import { Link } from "react-router-dom";
import BottomNav from "../../../components/BottomNav";

const DEV_INFO = {
  pembuat: "Nugroho Y.R",
  brand: "Computer[ID]•GROUP",
  email: "nugrohokelyn@gmail.com",
  github: "ComputerID-Dev",
  githubUrl: "https://github.com/ComputerID-Dev",
  whatsapp: "https://whatsapp.com/channel/0029VbDsVxHKQuJNCkZNK82S"
};

function InfoRow({ label, value, href }) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-border last:border-none">
      <span className="text-xs text-muted uppercase tracking-wide">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-accent2 break-all">
          {value}
        </a>
      ) : (
        <span className="text-sm break-all">{value}</span>
      )}
    </div>
  );
}

export default function OpsiDeveloper() {
  return (
    <div className="min-h-screen pb-20">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <Link to="/echonote/setting-profile" className="text-lg">
          ←
        </Link>
        <h1 className="text-lg font-bold">Opsi Developer</h1>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <div className="card p-6 text-center mb-4">
          <div className="w-14 h-14 rounded-full bg-panel2 border border-border mx-auto mb-3 flex items-center justify-center text-2xl">
            ⚙️
          </div>
          <h2 className="text-lg font-bold">Tentang EchoNote</h2>
          <p className="text-muted text-sm mt-1">Informasi resmi tentang pembuat & sumber aplikasi ini.</p>
        </div>

        <div className="card p-5">
          <InfoRow label="Pembuat" value={DEV_INFO.pembuat} />
          <InfoRow label="Perusahaan / Brand" value={DEV_INFO.brand} />
          <InfoRow label="Email" value={DEV_INFO.email} href={`mailto:${DEV_INFO.email}`} />
          <InfoRow label="GitHub" value={DEV_INFO.github} href={DEV_INFO.githubUrl} />
          <InfoRow label="Saluran WhatsApp Resmi" value={DEV_INFO.whatsapp} href={DEV_INFO.whatsapp} />
        </div>

        <p className="text-xs text-muted text-center mt-4 px-4">
          Info &amp; source resmi hanya tersedia di saluran WhatsApp di atas.
        </p>

        <a href={DEV_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="block mt-4">
          <button className="btn-primary">Buka Saluran WhatsApp</button>
        </a>
      </main>

      <BottomNav />
    </div>
  );
}
