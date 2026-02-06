import { ArrowLeft, Download, ShieldCheck, Settings, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function InstallGuide() {
    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative p-6 md:p-12 flex flex-col items-center">

            {/* Header */}
            <header className="w-full max-w-2xl flex items-center justify-between mb-12 z-10">
                <Link to="/login" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Android System</span>
                </div>
            </header>

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl z-10"
            >
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                        Install <span className="text-emerald-500">Protocol</span>
                    </h1>
                    <p className="text-zinc-500 text-lg font-light max-w-md mx-auto">
                        Authorize the neural uplink on your Android device manually.
                    </p>
                </div>

                {/* Primary Action */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 md:p-8 mb-12 text-center backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

                    <a
                        href="https://drive.google.com/file/d/15xWNwTe74mHaSnc1Dd3GsrOmPqbZKn9m/view?usp=sharing"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-col items-center justify-center gap-4 bg-emerald-500 hover:bg-emerald-400 text-black py-6 px-12 rounded-2xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]"
                    >
                        <Download className="w-8 h-8" />
                        <span className="text-sm font-black uppercase tracking-[0.2em]">Download APK</span>
                    </a>
                    <p className="mt-6 text-emerald-500/60 text-xs uppercase tracking-widest font-mono">Version 1.0.0 • Secure Build</p>
                </div>

                {/* Steps */}
                <div className="grid gap-6">
                    <Step
                        num="01"
                        title="Download File"
                        desc="Tap the button above to download the 'ThreadSense.apk' file to your device."
                        icon={<Download className="w-6 h-6 text-cyan-400" />}
                    />
                    <Step
                        num="02"
                        title="Open File"
                        desc="Tap on the completed download notification or find it in your 'Files' app."
                        icon={<Smartphone className="w-6 h-6 text-purple-400" />}
                    />
                    <Step
                        num="03"
                        title="Allow Permission"
                        desc="If prompted 'For your security...', tap Settings and turn on 'Allow from this source'."
                        icon={<Settings className="w-6 h-6 text-yellow-400" />}
                    />
                    <Step
                        num="04"
                        title="Install"
                        desc="Tap 'Install' and wait for the Neural Link to establish. Open the app to begin."
                        icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
                    />
                </div>

            </motion.main>

            {/* Background Ambience */}
            <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="fixed bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>
        </div>
    );
}

function Step({ num, title, desc, icon }) {
    return (
        <div className="flex items-start gap-4 md:gap-6 p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                {icon}
            </div>
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black text-zinc-600 tracking-widest">{num}</span>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">{title}</h3>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
