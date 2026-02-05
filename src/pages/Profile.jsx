import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { User, Mail, Shield, ArrowLeft } from "lucide-react";

export default function Profile() {
    const { user } = useContext(AuthContext);
    const [isAdmin] = useState(false); // Future: check user.role === 'admin'

    return (
        <div className="min-h-screen py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8 relative overflow-hidden">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-black">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="flex items-center justify-between pt-12">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">Operative Profile</h1>
                        <p className="text-zinc-500 text-sm">Identity & Clearance</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 md:p-12 space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-cyan-500/20">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{user?.username}</h2>
                        <span className="inline-flex items-center gap-1 text-xs font-mono bg-green-500/20 text-green-400 px-2 py-0.5 rounded mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            CLEARANCE: LEVEL 1
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="label-tech">Identity Data</label>

                        <div className="flex items-center gap-3 p-4 bg-black/40 rounded-lg border border-white/5">
                            <User className="text-zinc-500 w-5 h-5" />
                            <div>
                                <div className="text-xs text-zinc-500">Codename</div>
                                <div className="text-zinc-300 font-mono">{user?.username}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-black/40 rounded-lg border border-white/5">
                            <Mail className="text-zinc-500 w-5 h-5" />
                            <div>
                                <div className="text-xs text-zinc-500">Communication Link</div>
                                <div className="text-zinc-300 font-mono">{user?.email}</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="label-tech">System Access</label>

                        <div className="flex items-center gap-3 p-4 bg-black/40 rounded-lg border border-white/5">
                            <Shield className="text-zinc-500 w-5 h-5" />
                            <div>
                                <div className="text-xs text-zinc-500">Role Designation</div>
                                <div className="text-zinc-300 font-mono">{isAdmin ? "SYSTEM ADMIN" : "OPERATIVE"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-end gap-3">
                    <button className="btn-primary bg-zinc-800 border-zinc-700 hover:bg-zinc-700">Edit Profile (Encrypted)</button>
                </div>
            </div>
        </div>
    );
}
