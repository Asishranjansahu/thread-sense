import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, ExternalLink, Trash2, Youtube, Twitter, MessageSquare, Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../config";

export default function History() {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (searchQuery.length > 2) {
            handleSearch();
        } else if (searchQuery.length === 0) {
            fetchHistory();
        }
    }, [searchQuery]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(API + "/api/threads", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setThreads(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(API + `/api/threads/search?q=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setThreads(data);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteThread = async (id) => {
        if (!confirm("Are you sure you want to delete this scan?")) return;
        try {
            const token = localStorage.getItem("token");
            await fetch(API + `/api/threads/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            setThreads(threads.filter(t => t._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-8 relative overflow-hidden">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-black">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 pt-12">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 uppercase tracking-tighter">Neural Archives</h1>
                        <p className="text-zinc-500 text-sm">Welcome back, {user?.username}</p>
                    </div>
                </div>

                <div className="md:pt-12 relative w-full md:w-96 group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition-opacity"></div>
                    <input
                        type="text"
                        placeholder="Scan archives for keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="cyber-input py-4 pl-12 pr-4 relative z-10"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 z-20 group-focus-within:text-cyan-400 transition-colors" />
                </div>
            </div>

            {loading ? (
                <div className="text-center text-zinc-500 py-20">Accessing Archives...</div>
            ) : threads.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                    <p className="text-zinc-500">No scans detected in the database.</p>
                    <Link to="/" className="text-cyan-400 mt-2 inline-block hover:underline">Start a new scan</Link>
                </div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="grid gap-4"
                >
                    {threads.map(thread => (
                        <motion.div
                            key={thread._id}
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                show: { opacity: 1, x: 0 }
                            }}
                            className="glass-panel p-6 flex flex-col md:flex-row gap-6 relative group transition-colors hover:border-cyan-500/30"
                        >
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${thread.score > 60 ? 'bg-green-500/20 text-green-400' : thread.score > 40 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        SCORE: {thread.score}
                                    </span>
                                    <span className="text-zinc-500 text-xs flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(thread.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter border ${thread.platform === 'youtube' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        thread.platform === 'twitter' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                                            'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                        }`}>
                                        {thread.platform === 'youtube' && <Youtube className="w-2.5 h-2.5" />}
                                        {thread.platform === 'twitter' && <Twitter className="w-2.5 h-2.5" />}
                                        {thread.platform === 'reddit' && <MessageSquare className="w-2.5 h-2.5" />}
                                        {thread.platform || "REDDIT"}
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-tighter border border-purple-500/20">
                                        {thread.category || "GENERAL"}
                                    </span>
                                    {thread.organization && (
                                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-tighter border border-cyan-500/20 flex items-center gap-1">
                                            <Users className="w-2.5 h-2.5" />
                                            Shared Intelligence
                                        </span>
                                    )}
                                </div>

                                <a href={thread.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-zinc-200 hover:text-cyan-400 transition-colors flex items-center gap-2">
                                    {thread.url}
                                    <ExternalLink className="w-4 h-4 opacity-50" />
                                </a>

                                <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">
                                    {thread.summary.slice(0, 200)}...
                                </p>

                                <div className="flex flex-wrap gap-2 items-center justify-between w-full">
                                    <div className="flex flex-wrap gap-2">
                                        {thread.keywords.slice(0, 5).map(k => (
                                            <span key={k} className="text-[10px] text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded border border-white/5">#{k}</span>
                                        ))}
                                    </div>
                                    <Link
                                        to={`/?threadId=${thread._id}`}
                                        className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-[10px] font-bold text-cyan-400 tracking-widest uppercase hover:bg-cyan-500/20 transition-all"
                                    >
                                        Reconstruct
                                    </Link>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteThread(thread._id)}
                                className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Scan"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
