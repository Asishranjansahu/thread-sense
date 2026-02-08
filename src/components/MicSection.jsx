import { useEffect, useRef, useState } from "react";
import { API } from "../config";

export default function MicSection() {
  const [recording, setRecording] = useState(false);
  const [saving, setSaving] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (e) {
      setRecording(false);
    }
  };

  const stop = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      mr.stop();
    }
    setRecording(false);
  };

  const save = async () => {
    if (!audioUrl) return;
    setSaving(true);
    try {
      const resBlob = await fetch(audioUrl).then(r => r.blob());
      const reader = new FileReader();
      const asDataURL = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(resBlob);
      });
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/upload-audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { "Authorization": `Bearer ${token}` } : {}) },
        body: JSON.stringify({ audioBase64: asDataURL, filename: "mic" })
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setAudioUrl(`${API}${data.url}`);
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      const mr = mediaRecorderRef.current;
      if (mr && mr.stream) {
        mr.stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="label-tech text-emerald-400">Mic</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={start}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all"
            disabled={recording}
          >
            Start
          </button>
          <button
            type="button"
            onClick={stop}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all"
            disabled={!recording}
          >
            Stop
          </button>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black p-4">
        {audioUrl ? (
          <audio controls src={audioUrl} className="w-full" />
        ) : (
          <div className="text-[10px] text-zinc-600">No recording yet</div>
        )}
      </div>
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={save}
          disabled={!audioUrl || saving}
          className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${audioUrl ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-600'} ${saving ? 'opacity-50 cursor-wait' : ''}`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
