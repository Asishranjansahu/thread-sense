import { useState } from "react";
import ToolsBox from "./ToolsBox";

export default function Composer({ onSend, loading, onRegenerate }) {
  const [text, setText] = useState("");
  const [showTools, setShowTools] = useState(false);

  return (
    <div className="glass-panel p-3 md:p-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowTools(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 text-zinc-300 hover:text-white transition-all"
          aria-label="Open Tools"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend(text, () => setText(""))}
          placeholder="Message Neural Assistant..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-300"
        />
        <button
          onClick={() => onSend(text, () => setText(""))}
          disabled={loading || !text.trim()}
          className="px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 border-cyan-500/20 text-cyan-400 disabled:opacity-50"
        >
          Send
        </button>
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/10 text-zinc-400 disabled:opacity-50"
        >
          Regenerate
        </button>
      </div>
      {showTools && <ToolsBox onClose={() => setShowTools(false)} />}
    </div>
  );
}
