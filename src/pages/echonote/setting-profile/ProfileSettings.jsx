/* ==========================================================
   ProfileSettings.jsx — edit semua data akun
   Validasi tagname sama seperti SetupAccount.
   ========================================================== */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, updateDoc, getDocs, collection, query, where, limit } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../services/firebaseClient";
import { useAuth } from "../../../services/AuthContext";
import LinkInBioInput from "../../../components/LinkInBioInput";
import defaultAvatar from "../../../assets/default-avatar.png";

const TAG_RE = /^[a-z0-9_-]+$/;

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();

  const [username, setUsername] = useState(profile?.username || "");
  const [tagname, setTagname] = useState(profile?.tagname || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [links, setLinks] = useState(profile?.links || []);

  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatarUrl || null);
  const [bannerPreview, setBannerPreview] = useState(profile?.bannerUrl || null);

  const [tagErr, setTagErr] = useState("");
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);

  function handleFile(setter, previewSetter) {
    return (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setter(file);
      previewSetter(URL.createObjectURL(file));
    };
  }

  function handleTagnameChange(raw) {
    setTagname(raw.replace(/\s+/g, "_").toLowerCase());
    setTagErr("");
  }

  async function isTagnameTakenByOther(tag) {
    const q = query(collection(db, "users"), where("tagname", "==", tag), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return false;
    return snap.docs[0].id !== user.uid;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormErr("");
    setTagErr("");

    const finalTag = tagname.trim();

    if (!TAG_RE.test(finalTag)) {
      setTagErr("Tagname hanya boleh huruf kecil a-z, angka, underscore, dan strip.");
      return;
    }

    setSaving(true);

    try {
      if (finalTag !== profile.tagname) {
        const taken = await isTagnameTakenByOther(finalTag);
        if (taken) {
          setTagErr("Tagname sudah dipakai orang lain, coba yang lain.");
          setSaving(false);
          return;
        }
      }

      let avatarUrl = profile.avatarUrl || null;
      let bannerUrl = profile.bannerUrl || null;

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

      await updateDoc(doc(db, "users", user.uid), {
        username: username.trim() || "Tanpa nama",
        tagname: finalTag,
        bio: bio.trim(),
        avatarUrl,
        bannerUrl,
        links: links.filter((l) => l.url.trim())
      });

      await refreshProfile();
      navigate("/echonote/me-profile", { replace: true });
    } catch (err) {
      console.error(err);
      setFormErr("Gagal menyimpan perubahan, coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <form onSubmit={handleSubmit} className="card w-full max-w-md p-6">
        <h1 className="text-xl font-bold mb-6">Pengaturan Profil</h1>

        <label className="text-sm text-muted mb-2 block">Banner</label>
        <label
          className="block w-full aspect-video rounded-card bg-panel2 border border-border bg-cover bg-center cursor-pointer mb-4 overflow-hidden"
          style={bannerPreview ? { backgroundImage: `url(${bannerPreview})` } : {}}
        >
          {!bannerPreview && (
            <div className="w-full h-full flex items-center justify-center text-muted text-xs">
              Ketuk untuk ganti banner
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile(setBannerFile, setBannerPreview)} />
        </label>

        <div className="flex items-center gap-4 mb-4">
          <label className="cursor-pointer">
            <img
              src={avatarPreview || defaultAvatar}
              alt=""
              className="w-16 h-16 rounded-full object-cover border border-border"
            />
            <input type="file" accept="image/*" className="hidden" onChange={handleFile(setAvatarFile, setAvatarPreview)} />
          </label>
          <span className="text-xs text-muted">Ketuk avatar untuk ganti</span>
        </div>

        <label className="text-sm text-muted mb-1 block">Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="mb-4" />

        <label className="text-sm text-muted mb-1 block">Tagname</label>
        <div className="flex items-center gap-1 mb-1">
          <span className="text-muted">@</span>
          <input type="text" value={tagname} onChange={(e) => handleTagnameChange(e.target.value)} />
        </div>
        <div className="field-error mb-3">{tagErr}</div>

        <label className="text-sm text-muted mb-1 block">Bio</label>
        <textarea rows={2} value={bio} onChange={(e) => setBio(e.target.value)} className="mb-4" />

        <label className="text-sm text-muted mb-2 block">Link in bio</label>
        <LinkInBioInput value={links} onChange={setLinks} />

        <div className="field-error mt-3">{formErr}</div>

        <button type="submit" className="btn-primary mt-4" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>

        <Link to="/echonote/me-profile">
          <button type="button" className="btn-secondary mt-2">
            Batal
          </button>
        </Link>

        <Link to="/echonote/developer-options">
          <button type="button" className="btn-secondary mt-2 text-muted">
            ⚙️ Opsi Developer / Tentang
          </button>
        </Link>
      </form>
    </div>
  );
}
