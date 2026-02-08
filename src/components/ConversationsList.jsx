import { useEffect, useState } from "react";
import { API } from "../config";

export default function ConversationsList({ onSelect }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(q ? `${API}/api/threads/search?q=${encodeURIComponent(q)}` : `${API}/api/threads`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setThreads(Array.isArray(data) ? data : []);
    } catch (e) {
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [q]);

  return (
    <div className="glass-panel p-4 md:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="label-tech text-cyan-400">Conversations</span>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl border border-white/10 text-[10px] uppercase font-black tracking-widest text-zinc-400 hover:text-white hover:bg-white/5"
        >
          Refresh
        </button>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search"
        className="w-full mb-4 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold text-zinc-300 outline-none hover:border-cyan-500/30"
      />
      <div className="space-y-2 max-h-[60vh] overflow-auto pr-2">
        {loading && <div className="text-[10px] text-zinc-600">Loading...</div>}
        {!loading && threads.length === 0 && (
          <div className="text-[10px] text-zinc-600">No conversations yet</div>
        )}
        {threads.map(t => (
          <button
            key={t._id}
            onClick={() => onSelect(t)}
            className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 transition-all"
          >
            <div className="text-[10px] uppercase tracking-widest font-black text-zinc-500">{t.platform?.toUpperCase()} • {t.category}</div>
            <div className="text-xs text-zinc-300 line-clamp-2">{t.summary?.slice(0, 140) || t.url}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
