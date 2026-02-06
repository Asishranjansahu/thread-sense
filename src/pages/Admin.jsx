import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "../config";

export default function Admin() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAdminData();
    }, []);

    async function fetchAdminData() {
        const token = localStorage.getItem("token");
        try {
            const [statsRes, usersRes] = await Promise.all([
                fetch(API + "/api/admin/stats", { headers: { "Authorization": `Bearer ${token}` } }),
                fetch(API + "/api/admin/users", { headers: { "Authorization": `Bearer ${token}` } })
            ]);

            if (!statsRes.ok || !usersRes.ok) throw new Error("Verification failed: Admin clearance required.");

            const statsData = await statsRes.json();
            const usersData = await usersRes.json();

            setStats(statsData);
            setUsers(usersData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-cyan-400 font-mono animate-pulse tracking-[0.5em]">ACCESSING SECURE CORE...</div>;

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/50 flex items-center justify-center mb-6 animate-bounce">
                <span className="text-red-500 font-black text-2xl">!</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Access Denied</h1>
            <p className="text-zinc-500 font-mono text-sm max-w-md mb-8">{error}</p>
            <Link to="/" className="btn-primary"><span>Return to Terminal</span></Link>
        </div>
    );

    return (
        <div className="min-h-screen py-6 md:py-20 px-4 md:px-12 max-w-7xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 pt-12">
                <div>
                    <span className="label-tech text-cyan-400">System Override / Admin Panel</span>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic">Command Central</h1>
                </div>
            </header>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-stat neon-border-cyan p-6 md:p-10">
                    <span className="text-5xl font-black text-white mb-2">{stats?.userCount || 0}</span>
                    <span className="label-tech mb-0">Total Biological Nodes</span>
                </div>
                <div className="card-stat neon-border-purple p-6 md:p-10">
                    <span className="text-5xl font-black text-white mb-2">{stats?.threadCount || 0}</span>
                    <span className="label-tech mb-0">Data Transmissions</span>
                </div>
                <div className="card-stat border-white/10 p-6 md:p-10">
                    <span className="text-5xl font-black text-cyan-400 mb-2">99.9%</span>
                    <span className="label-tech mb-0">System Integrity</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* USERS TABLE */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="glass-panel p-6 md:p-8 border-white/5">
                        <h3 className="text-xl font-bold mb-8 uppercase tracking-widest flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#00f3ff]"></div>
                            Active Node Directory
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm font-mono">
                                <thead>
                                    <tr className="border-b border-white/5 text-zinc-500 text-[10px] uppercase tracking-widest">
                                        <th className="pb-4 pt-0">Identifier</th>
                                        <th className="pb-4 pt-0">Communication</th>
                                        <th className="pb-4 pt-0">Clearance</th>
                                        <th className="pb-4 pt-0">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.02]">
                                    {users.map((u) => (
                                        <tr key={u._id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-5 font-bold text-white group-hover:text-cyan-400">{u.username}</td>
                                            <td className="py-5 text-zinc-400 opacity-60">{u.email}</td>
                                            <td className="py-5 uppercase">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-5 text-zinc-600 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RECENT ACTIVITY */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass-panel p-6 md:p-8 border-white/5 min-h-[500px]">
                        <h3 className="text-xl font-bold mb-8 uppercase tracking-widest flex items-center gap-3 text-purple-400">
                            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_#bc13fe]"></div>
                            Raw Feed
                        </h3>
                        <div className="space-y-6">
                            {stats?.recentThreads.map((t, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 group">
                                    <div className="w-1 h-10 bg-cyan-500/30 rounded-full group-hover:bg-cyan-500 transition-colors"></div>
                                    <div>
                                        <div className="text-[10px] text-cyan-500 font-bold uppercase mb-1">{t.user?.username || 'GHOST'}</div>
                                        <div className="text-xs text-zinc-300 font-light line-clamp-2 leading-relaxed italic">"{t.summary?.slice(0, 100)}..."</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
