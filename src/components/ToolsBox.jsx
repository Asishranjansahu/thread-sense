import { useState } from "react";
import ImagePicker from "./ImagePicker";
import CameraSection from "./CameraSection";
import MicSection from "./MicSection";
import { API } from "../config";

export default function ToolsBox({ onClose }) {
  const [tab, setTab] = useState("upload");
  const [imagePreview, setImagePreview] = useState("");
  const [imageSaving, setImageSaving] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl mx-auto rounded-2xl border border-white/10 bg-[#0b0b0b] p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/5">
            {["upload", "camera", "mic"].map(k => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === k ? 'bg-white/10 text-cyan-400 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
              >
                {k}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-xl border border-white/10 text-[10px] uppercase font-black tracking-widest text-zinc-400 hover:text-white hover:bg-white/5"
          >
            Close
          </button>
        </div>
        <div className="p-4 md:p-6">
          {tab === "upload" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="label-tech text-cyan-400">Image Upload</span>
                <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">Camera or Gallery</span>
              </div>
              <ImagePicker
                value={imagePreview}
                onChange={setImagePreview}
                saving={imageSaving}
                onSave={async () => {
                  if (!imagePreview) return;
                  setImageSaving(true);
                  try {
                    const token = localStorage.getItem("token");
                    const res = await fetch(`${API}/api/upload-image`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json", ...(token ? { "Authorization": `Bearer ${token}` } : {}) },
                      body: JSON.stringify({ imageBase64: imagePreview, filename: "dashboard" })
                    });
                    const data = await res.json();
                    if (res.ok && data.url) {
                      setImagePreview(`${API}${data.url}`);
                    }
                  } finally {
                    setImageSaving(false);
                  }
                }}
              />
            </div>
          )}
          {tab === "camera" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="label-tech text-purple-400">Camera</span>
                <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">Live Capture</span>
              </div>
              <CameraSection />
            </div>
          )}
          {tab === "mic" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="label-tech text-emerald-400">Mic</span>
                <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">Audio Recorder</span>
              </div>
              <MicSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
