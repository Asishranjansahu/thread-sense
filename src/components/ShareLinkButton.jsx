import { useState } from "react";
import { Link as LinkIcon } from "lucide-react";

export default function ShareLinkButton({ size = "md" }) {
  const [ok, setOk] = useState(false);
  const cls = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconCls = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  const handleClick = async () => {
    const origin = window.location.origin;
    try {
      await navigator.clipboard.writeText(origin);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch {
      setOk(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`${cls} flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 text-zinc-300 hover:text-white transition-all`}
        aria-label="Share Link"
      >
        <LinkIcon className={iconCls} />
      </button>
      {ok && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black uppercase tracking-widest text-cyan-400">
          Copied
        </div>
      )}
    </div>
  );
}
