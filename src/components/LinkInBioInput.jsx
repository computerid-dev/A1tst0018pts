/* ==========================================================
   LinkInBioInput.jsx
   Komponen dinamis: bisa nambah link lebih dari satu.
   value: [{ label, url }]
   onChange: (newArray) => void
   ========================================================== */

export default function LinkInBioInput({ value = [], onChange }) {
  function updateLink(index, field, val) {
    const next = value.map((item, i) => (i === index ? { ...item, [field]: val } : item));
    onChange(next);
  }

  function addLink() {
    onChange([...value, { label: "", url: "" }]);
  }

  function removeLink(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {value.map((link, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Label (misal: Instagram)"
                value={link.label}
                onChange={(e) => updateLink(index, "label", e.target.value)}
              />
              <input
                type="url"
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateLink(index, "url", e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="btn-secondary !w-auto px-3 py-3 text-danger"
              title="Hapus link ini"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addLink} className="btn-secondary mt-3 text-sm">
        + Tambah link (+1)
      </button>
    </div>
  );
}
