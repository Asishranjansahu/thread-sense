import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Users, UserPlus, Building, ArrowLeft, ShieldCheck, Zap, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../config";

export default function Organization() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [org, setOrg] = useState(null);
    const [orgName, setOrgName] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        fetchOrg();
    }, []);

    const fetchOrg = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(API + "/api/organization/me", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setOrg(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!orgName) return;
        setActionLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(API + "/api/organization/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: orgName })
            });
            const data = await res.json();
            if (res.ok) {
                setOrg(data);
                setMessage({ text: "Organization established. Welcome, Director.", type: "success" });
            } else {
                setMessage({ text: data.error, type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Connection failed", type: "error" });
        }
        setActionLoading(false);
    };

    const handleInvite = async () => {
        if (!inviteEmail) return;
        setActionLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(API + "/api/organization/invite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ email: inviteEmail })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ text: data.message, type: "success" });
                setInviteEmail("");
                fetchOrg(); // Refresh member list
            } else {
                setMessage({ text: data.error, type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Transmission failed", type: "error" });
        }
        setActionLoading(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen py-20 px-4 md:px-8 max-w-6xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-12">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">Command Center</h1>
                    <p className="text-zinc-500 text-[10px] font-mono tracking-[0.5em] mt-2 italic uppercase">Team & Protocol Management</p>
                </motion.div>

                {org && (
                    <div className="flex gap-4 w-full md:w-auto">
                        <input
                            placeholder="Operative Email..."
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="cyber-input flex-1 md:w-64"
                        />
                        <button
                            onClick={handleInvite}
                            disabled={actionLoading}
                            className="btn-primary flex items-center gap-2 whitespace-nowrap"
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                            Recruit
                        </button>
                    </div>
                )}
            </header>

            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-widest ${message.type === 'success' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {!org ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-6 md:p-20 text-center space-y-10 border-dashed border-zinc-800"
                >
                    <Building className="w-20 h-20 text-zinc-900 mx-auto" />
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black uppercase tracking-tight">No Active Organization</h2>
                        <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed">
                            Establish a team to share thread intelligence, archive common summaries, and manage enterprise-grade neural clearances.
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center gap-4 max-w-md mx-auto">
                        <input
                            placeholder="Organization Name (e.g., Cyberdyne)"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className="cyber-input text-center"
                        />
                        <button
                            onClick={handleCreate}
                            disabled={actionLoading || !orgName}
                            className="btn-primary"
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Found Organization"}
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-6 md:p-8"
                        >
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                                <div className="space-y-1">
                                    <h3 className="font-black uppercase tracking-widest text-sm text-cyan-400">Operative Roster</h3>
                                    <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">Authorized Intelligence Personnel</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black">{org.members.length}</span>
                                    <p className="text-[9px] text-zinc-600 font-bold uppercase">Signals Active</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {org.members.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/5 flex items-center justify-center text-sm font-black text-zinc-400 group-hover:text-cyan-400 transition-colors">
                                                {m.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-zinc-300 group-hover:text-white transition-colors">{m.username}</span>
                                                <span className="text-[10px] text-zinc-600 font-mono italic">{m.email}</span>
                                            </div>
                                        </div>
                                        <ShieldCheck className="w-5 h-5 text-cyan-500/30 group-hover:text-cyan-400 transition-all" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-4 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel p-6 md:p-8 bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="w-4 h-4 text-cyan-400" />
                                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-cyan-500">Protocol Tier</span>
                            </div>
                            <h4 className="text-4xl font-black text-white uppercase tracking-tighter">{org.tier}</h4>
                            <p className="text-[10px] text-zinc-500 mt-4 leading-relaxed font-mono uppercase tracking-widest">
                                High-priority neural bandwidth enabled. Unlimited thread scans active across all roster members.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-panel p-6 md:p-8"
                        >
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-purple-500">Shared Archives</span>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-5xl font-black">{org.threadCount || 0}</span>
                                <span className="text-2xl font-black text-zinc-700"></span>
                            </div>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-4 tracking-widest leading-none">Intelligence Packets Harvested</p>
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    );
}
