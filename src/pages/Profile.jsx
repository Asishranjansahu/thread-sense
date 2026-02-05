import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { User, Mail, Shield, ArrowLeft, Building, Zap, Activity, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";
import { API } from "../config";

export default function Profile() {
    const { user } = useContext(AuthContext);
    const [org, setOrg] = useState(null);

    useEffect(() => {
        if (user?.organization) {
            const token = localStorage.getItem("token");
            fetch(`${API}/api/organization/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then(r => r.json())
                .then(data => setOrg(data))
                .catch(e => console.error(e));
        }
    }, [user]);

    return (
        <div className="min-h-screen py-20 px-4 md:px-8 max-w-5xl mx-auto space-y-12 relative overflow-hidden">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-black">
                <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]"></div>
            </div>

            <header className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-6"
                >
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
                        <div className="w-full h-full rounded-3xl bg-zinc-950 flex items-center justify-center overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {user?.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-black text-white">{user?.username?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase text-white leading-none">
                            {user?.username}
                        </h1>
                        <div className="flex items-center gap-3 mt-4">
                            <span className="inline-flex items-center gap-2 text-[10px] font-black bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 uppercase tracking-widest">
                                <Activity className="w-3 h-3 animate-pulse" />
                                Transmitting Status: ACTIVE
                            </span>
                            <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">Neural Link: SECURE</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-6 border-cyan-500/20 bg-cyan-500/5"
                >
                    <div className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-2">Clearance Level</div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(lv => (
                            <div key={lv} className={`h-2 w-8 rounded-full ${lv === 1 ? 'bg-cyan-500 shadow-[0_0_10px_#00f3ff]' : 'bg-white/5'}`}></div>
                        ))}
                    </div>
                    <div className="mt-3 text-[9px] text-zinc-500 font-bold uppercase">Basic Intelligence Access</div>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-8 space-y-8"
                >
                    <div className="glass-panel p-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <label className="label-tech">Communication Channels</label>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                                        <Mail className="text-zinc-500 w-5 h-5 group-hover:text-cyan-400" />
                                        <div className="flex-1">
                                            <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Standard Relay</div>
                                            <div className="text-zinc-300 font-mono text-sm">{user?.email}</div>
                                        </div>
                                    </div>
                                    {user?.phone && (
                                        <div className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                                            <Activity className="text-zinc-500 w-5 h-5 group-hover:text-cyan-400" />
                                            <div className="flex-1">
                                                <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Mobile Frequency</div>
                                                <div className="text-zinc-300 font-mono text-sm">{user.phone}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="label-tech">Digital Footprint</label>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                                        <Fingerprint className="text-zinc-500 w-5 h-5 group-hover:text-cyan-400" />
                                        <div className="flex-1">
                                            <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Neural Signature</div>
                                            <div className="text-zinc-300 font-mono text-[10px] truncate">{user?.id}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                                        <Shield className="text-zinc-500 w-5 h-5 group-hover:text-cyan-400" />
                                        <div className="flex-1">
                                            <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">System Role</div>
                                            <div className="text-zinc-300 font-mono text-sm uppercase">{user?.role || "Operative"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <p className="text-[10px] text-zinc-600 italic uppercase">Biometric changes require a secure frequency reset.</p>
                            <button className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all">
                                Update Dossier
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-4 space-y-8"
                >
                    <div className="glass-panel p-8 space-y-6 bg-gradient-to-br from-purple-500/5 to-transparent border-purple-500/20">
                        <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-purple-400" />
                            <span className="label-tech text-purple-400">Assigned Organization</span>
                        </div>
                        {org ? (
                            <div className="space-y-6">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{org.name}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                                        <span>Personnel Count</span>
                                        <span className="text-white">{org.members?.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                                        <span>Archive Access</span>
                                        <span className="text-white">ENABLED</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                                        <span>Tier Clearance</span>
                                        <span className="text-purple-400">{org.tier?.toUpperCase()}</span>
                                    </div>
                                </div>
                                <Link to="/organization" className="btn-primary w-full text-center text-[10px] py-4">
                                    Access Command Center
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <p className="text-xs text-zinc-500 leading-relaxed italic">
                                    No organization detected. Join the network to enable collaborative intelligence harvesting.
                                </p>
                                <Link to="/organization" className="block w-full py-4 rounded-xl border border-white/10 text-center text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                                    Found Organization
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="glass-panel p-8 space-y-6">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-cyan-400" />
                            <span className="label-tech text-cyan-400">Harvesting Perks</span>
                        </div>
                        <ul className="space-y-4">
                            {[
                                { label: "Unlimited Neural Scans", active: org?.tier === 'pro' || org?.tier === 'enterprise' },
                                { label: "Team Archive Sync", active: !!org },
                                { label: "Priority Sentiment AI", active: org?.tier === 'pro' || org?.tier === 'enterprise' },
                                { label: "Standard Dossier Search", active: true }
                            ].map((perk, i) => (
                                <li key={i} className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-tight ${perk.active ? 'text-zinc-300' : 'text-zinc-700 decoration-line-through'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${perk.active ? 'bg-cyan-500 shadow-[0_0_5px_#00f3ff]' : 'bg-zinc-800'}`}></div>
                                    {perk.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
