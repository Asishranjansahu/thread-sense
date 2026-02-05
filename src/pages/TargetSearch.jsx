import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Search, User, Shield, Target, Zap, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../config";

export default function TargetSearch() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState("");
    const [error, setError] = useState("");
    const [displayTarget, setDisplayTarget] = useState("");

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        setError("");
        setReport("");

        try {
            const res = await fetch(API + "/target-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: query })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Intelligence feed interrupted");
            setReport(data.report);
            setDisplayTarget(query);
            setQuery("");
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-12 relative z-10 overflow-hidden">
            <div className="scanline"></div>

            <header className="flex flex-col items-center justify-center space-y-8 text-center relative pt-12">

                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-red-500/20 bg-red-900/10 backdrop-blur-3xl">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inset-0 rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative rounded-full h-2 w-2 bg-red-500 shadow-[0_0_12px_red]"></span>
                    </span>
                    <span className="text-[10px] font-black tracking-[0.5em] text-red-400 uppercase">OPERATIVE SEARCH // ACTIVE</span>
                </div>

                <div className="relative">
                    <h1 className="h1-glow relative z-10">NEURAL<span className="text-red-500">TARGET</span></h1>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent blur-sm"></div>
                </div>
                <p className="text-zinc-500 max-w-xl mx-auto font-light text-sm italic">
                    Decrypt digital identities and reconstruct digital footprints across the global frequency.
                </p>
            </header>

            <section className="max-w-3xl mx-auto space-y-8">
                <div className="glass-panel p-2 neon-border-red group">
                    <div className="flex flex-col md:flex-row gap-2">
                        <input
                            className="cyber-input border-none bg-transparent flex-1 text-xl py-6 focus:ring-red-500/20"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Inject Target Identifier (Name/Alias)..."
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-8 py-4 bg-red-600 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-xl border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                            <span>{loading ? "DECRYPTING..." : "SEARCH"}</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                        Neural Breach: {error}
                    </div>
                )}

                <AnimatePresence>
                    {report && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-10 space-y-8 border-red-500/20 relative"
                        >
                            <div className="absolute top-4 right-6 text-[10px] font-black text-red-500/40 uppercase tracking-[0.5em]">CONFIDENTIAL // LEVEL 4</div>

                            <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                                <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                                    <User className="w-10 h-10 text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">{displayTarget}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Digital Persona Detected</span>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <div className="whitespace-pre-wrap text-zinc-300 font-mono text-sm leading-relaxed p-6 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                                    {report}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Influence", value: "84%", color: "red" },
                                    { label: "Risk Factor", value: "MED", color: "orange" },
                                    { label: "Visiblity", value: "HIGH", color: "red" },
                                    { label: "Integrity", value: "VALID", color: "green" }
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                        <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{stat.label}</div>
                                        <div className="text-sm font-black text-white">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
}
