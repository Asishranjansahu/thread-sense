import { useEffect, useRef, useState } from "react";
import { API } from "../config";

export default function CameraSection({ compact = false, onSaved }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [captured, setCaptured] = useState("");
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState("document");
  const [open, setOpen] = useState(false);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (e) {
      setStreaming(false);
    }
  };

  const stop = () => {
    const video = videoRef.current;
    const stream = video?.srcObject;
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
    setStreaming(false);
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCaptured(dataUrl);
  };

  const save = async () => {
    if (!captured) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/upload-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { "Authorization": `Bearer ${token}` } : {}) },
        body: JSON.stringify({ imageBase64: captured, filename: `camera-${type}` })
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const finalUrl = `${API}${data.url}`;
        setCaptured(finalUrl);
        if (onSaved) onSaved(finalUrl);
        setOpen(false);
        stop();
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => stop();
  }, []);

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={async () => { setOpen(true); await start(); }}
          aria-label="Open Camera"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 text-zinc-300 hover:text-cyan-400 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 7h3l2-3h6l2 3h3v12H4V7z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>

        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-xl mx-auto rounded-2xl border border-white/10 bg-[#0b0b0b] p-4 relative">
              <button
                onClick={() => { setOpen(false); stop(); }}
                className="absolute top-3 right-3 px-3 py-2 rounded-xl border border-white/10 text-[10px] uppercase font-black tracking-widest text-zinc-400 hover:text-white hover:bg-white/5"
              >
                Close
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                  <video ref={videoRef} playsInline className="w-full h-48 object-cover" />
                </div>
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                  {captured ? (
                    <img src={captured} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="text-[10px] text-zinc-600">No capture yet</div>
                  )}
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex items-center justify-between mt-4">
                <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/5">
                  {["document", "face", "object"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setType(opt)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === opt ? 'bg-white/10 text-cyan-400 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={capture}
                    disabled={!streaming}
                    className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${streaming ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-white/5 border-white/10 text-zinc-600'}`}
                  >
                    Capture
                  </button>
                  <button
                    type="button"
                    onClick={save}
                    disabled={!captured || saving}
                    className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${captured ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/10 text-zinc-600'} ${saving ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="label-tech text-purple-400">Camera</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={start}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all"
          >
            Start
          </button>
          <button
            type="button"
            onClick={stop}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all"
          >
            Stop
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
          <video ref={videoRef} playsInline className="w-full h-[280px] object-cover" />
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
          {captured ? (
            <img src={captured} className="w-full h-[280px] object-cover" />
          ) : (
            <div className="text-[10px] text-zinc-600">No capture yet</div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex items-center justify-between">
        <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/5">
          {["document", "face", "object"].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => setType(opt)}
              className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === opt ? 'bg-white/10 text-cyan-400 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={capture}
            disabled={!streaming}
            className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${streaming ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-white/5 border-white/10 text-zinc-600'}`}
          >
            Capture
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!captured || saving}
            className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${captured ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/10 text-zinc-600'} ${saving ? 'opacity-50 cursor-wait' : ''}`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
