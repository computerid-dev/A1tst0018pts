/* ==========================================================
   SetupAccount.jsx
   Onboarding sekali jalan setelah OTP pertama kali sukses.
   ========================================================== */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDocs, collection, query, where, limit } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../services/firebaseClient";
import { useAuth } from "../../services/AuthContext";
import LinkInBioInput from "../../components/LinkInBioInput";
import defaultAvatar from "../../assets/default-avatar.png";

const TAG_RE = /^[a-z0-9_-]+$/;

function randomDigits(n) {
  let out = "";
  for (let i = 0; i < n; i++) out += Math.floor(Math.random() * 10);
  return out;
}

export default function SetupAccount() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const [bannerFile, setBannerFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [username, setUsername] = useState("");
  const [tagname, setTagname] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState([]);

  const [tagErr, setTagErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState("");

  function handleTagnameChange(raw) {
    // Spasi otomatis diganti "_", sisanya harus lolos validasi
    const withUnderscore = raw.replace(/\s+/g, "_").toLowerCase();
    setTagname(withUnderscore);
    setTagErr("");
  }

  function handleFile(setter, previewSetter) {
    return (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setter(file);
      previewSetter(URL.createObjectURL(file));
    };
  }

  async function isTagnameTaken(tag) {
    const q = query(collection(db, "users"), where("tagname", "==", tag), limit(1));
    const snap = await getDocs(q);
    return !snap.empty;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormErr("");
    setTagErr("");

    const finalUsername = username.trim() || `user${randomDigits(9)}`;
    let finalTag = tagname.trim();

    if (!finalTag) {
      finalTag = `user${randomDigits(9)}`;
    }

    if (!TAG_RE.test(finalTag)) {
      setTagErr("Tagname hanya boleh huruf kecil a-z, angka, underscore, dan strip.");
      return;
    }

    setSaving(true);

    try {
      const taken = await isTagnameTaken(finalTag);

      if (taken) {
        setTagErr("Tagname sudah dipakai orang lain, coba yang lain.");
        setSaving(false);
        return;
      }

      let avatarUrl = null;
      let bannerUrl = null;

      if (avatarFile) {
        const avatarRef = ref(storage, `users/${user.uid}/avatar-${Date.now()}`);
        await uploadBytes(avatarRef, avatarFile);
        avatarUrl = await getDownloadURL(avatarRef);
      }

      if (bannerFile) {
        const bannerRef = ref(storage, `users/${user.uid}/banner-${Date.now()}`);
        await uploadBytes(bannerRef, bannerFile);
        bannerUrl = await getDownloadURL(bannerRef);
      }

      const cleanLinks = links.filter((l) => l.url.trim());

      await setDoc(doc(db, "users", user.uid), {
        email: user.email || null,
        username: finalUsername,
        tagname: finalTag,
        bio: bio.trim() || "hai saya menggunakan EchoNote",
        avatarUrl,
        bannerUrl,
        links: cleanLinks,
        verified: false,
        createdAt: Date.now()
      });

      await refreshProfile();
      navigate("/echonote/home", { replace: true });
    } catch (err) {
      console.error(err);
      setFormErr("Gagal menyimpan profil, coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <form onSubmit={handleSubmit} className="card w-full max-w-md p-6">
        <h1 className="text-xl font-bold mb-1">Lengkapi Profil</h1>
        <p className="text-muted text-sm mb-6">Sekali diisi, bisa diubah lagi nanti dari pengaturan.</p>

        {/* Banner 16:9 */}
        <label className="text-sm text-muted mb-2 block">Banner (16:9, opsional)</label>
        <label
          className="block w-full aspect-video rounded-card bg-panel2 border border-border bg-cover bg-center cursor-pointer mb-4 overflow-hidden"
          style={bannerPreview ? { backgroundImage: `url(${bannerPreview})` } : {}}
        >
          {!bannerPreview && (
            <div className="w-full h-full flex items-center justify-center text-muted text-xs">
              Ketuk untuk unggah banner
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile(setBannerFile, setBannerPreview)} />
        </label>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-4">
          <label className="cursor-pointer">
            <img
              src={avatarPreview || defaultAvatar}
              alt=""
              className="w-16 h-16 rounded-full object-cover border border-border"
            />
            <input type="file" accept="image/*" className="hidden" onChange={handleFile(setAvatarFile, setAvatarPreview)} />
          </label>
          <span className="text-xs text-muted">Avatar (opsional, default logo EchoNote)</span>
        </div>

        <label className="text-sm text-muted mb-1 block">Username</label>
        <input
          type="text"
          placeholder="Nama tampilan (bebas)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4"
        />

        <label className="text-sm text-muted mb-1 block">Tagname</label>
        <div className="flex items-center gap-1 mb-1">
          <span className="text-muted">@</span>
          <input
            type="text"
            placeholder="handle_unik"
            value={tagname}
            onChange={(e) => handleTagnameChange(e.target.value)}
          />
        </div>
        <div className="field-error mb-3">{tagErr}</div>

        <label className="text-sm text-muted mb-1 block">Bio</label>
        <textarea
          rows={2}
          placeholder="hai saya menggunakan EchoNote"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mb-4"
        />

        <label className="text-sm text-muted mb-2 block">Link in bio</label>
        <LinkInBioInput value={links} onChange={setLinks} />

        <div className="field-error mt-3">{formErr}</div>

        <button type="submit" className="btn-primary mt-4" disabled={saving}>
          {saving ? "Menyimpan..." : "Selesai & Masuk EchoNote"}
        </button>
      </form>
    </div>
  );
}
