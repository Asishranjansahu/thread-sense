export default function ChatMessages({ history = [] }) {
  return (
    <div className="space-y-4">
      {history.length === 0 && (
        <div className="text-[10px] text-zinc-600">No messages yet</div>
      )}
      {history.map((m, i) => (
        <div
          key={i}
          className={`p-4 rounded-2xl border ${m.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-cyan-500/5 border-cyan-500/20'}`}
        >
          <div className="text-[10px] uppercase tracking-widest font-black mb-2 text-zinc-500">{m.role}</div>
          <div className="text-sm text-zinc-300 whitespace-pre-wrap">{m.content}</div>
        </div>
      ))}
    </div>
  );
}
