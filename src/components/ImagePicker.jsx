import { useRef } from "react";

export default function ImagePicker({ value, onChange, onSave, saving }) {
  const inputRef = useRef(null);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all"
        >
          Upload / Capture
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => onChange(reader.result);
            reader.readAsDataURL(file);
          }}
        />
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !value}
          className={`px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black uppercase tracking-widest text-cyan-400 ${saving || !value ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {saving ? "Uploading..." : "Save"}
        </button>
      </div>
      {value && (
        <div className="w-full max-w-xs rounded-2xl overflow-hidden border border-white/10">
          <img src={value} className="w-full h-auto object-cover" />
        </div>
      )}
    </div>
  );
}
