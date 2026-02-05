import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Users, UserPlus, Building, ArrowLeft, ShieldCheck } from "lucide-react";

export default function Organization() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [org, setOrg] = useState(null);

    // Future: Fetch org data from /api/auth/org
    useEffect(() => {
        // Mock data for now
        if (user?.organization) {
            setOrg({
                name: "Cyberdyne Systems",
                tier: "Enterprise",
                members: ["Sarah Connor", "John Connor", "T-800"]
            });
        }
    }, [user]);

    return (
        <div className="min-h-screen py-20 px-4 md:px-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between pt-12">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase">Command Center</h1>
                        <p className="text-zinc-500 text-xs font-mono tracking-widest">TEAM & PROTOCOL MANAGEMENT</p>
                    </div>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Recruit Operative
                </button>
            </div>

            {!org ? (
                <div className="glass-panel p-20 text-center space-y-6">
                    <Building className="w-16 h-16 text-zinc-800 mx-auto" />
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">No Active Organization</h2>
                        <p className="text-zinc-500 text-sm max-w-sm mx-auto">Create a team to share thread intelligence, archive summaries across members, and manage pro-level clearances.</p>
                    </div>
                    <button className="btn-primary">Found New Organization</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div className="glass-panel p-8">
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                <h3 className="font-bold uppercase tracking-widest text-sm text-cyan-400">Operative Roster</h3>
                                <span className="text-[10px] font-mono text-zinc-600">{org.members.length} ACTIVE SIGNALS</span>
                            </div>
                            <div className="space-y-4">
                                {org.members.map((m, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-cyan-500/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">{m.charAt(0)}</div>
                                            <span className="font-medium">{m}</span>
                                        </div>
                                        <ShieldCheck className="w-4 h-4 text-green-500/50" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="glass-panel p-6 bg-cyan-500/5 border-cyan-500/10">
                            <span className="label-tech">Protocol Tier</span>
                            <h4 className="text-2xl font-black text-cyan-400 mt-2 uppercase">{org.tier}</h4>
                            <p className="text-xs text-zinc-500 mt-2 font-mono uppercase tracking-widest">UNLIMITED NEURAL SCANS ACTIVE</p>
                        </div>

                        <div className="glass-panel p-6">
                            <span className="label-tech">Shared Archives</span>
                            <div className="mt-4 text-4xl font-black">1.2k</div>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">TOTAL SUMMARIES ACROSS TEAM</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
