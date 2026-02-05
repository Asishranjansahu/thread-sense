import { useNavigate } from "react-router-dom";
import { Shield, Zap, Target, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900 via-black to-black"></div>
            <div className="scanline"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative z-10 text-center max-w-3xl"
            >
                {/* Logo Badge */}
                <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f3ff]"></span>
                    <span className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase">System Online</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
                    THREAD<span className="text-cyan-500 text-shadow-neon">SENSE</span>
                </h1>

                <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto mb-12">
                    Advanced Neural Intelligence for the Open Web. Decode Reddit, Twitter, and YouTube with precision.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="glass-panel p-6 border-white/5 hover:border-cyan-500/30 transition-colors">
                        <Zap className="w-8 h-8 text-yellow-400 mb-4 mx-auto" />
                        <h3 className="font-bold text-lg mb-2">Instant Insight</h3>
                        <p className="text-xs text-zinc-500">Real-time summarization of complex threads.</p>
                    </div>
                    <div className="glass-panel p-6 border-white/5 hover:border-cyan-500/30 transition-colors">
                        <Shield className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
                        <h3 className="font-bold text-lg mb-2">Secure Core</h3>
                        <p className="text-xs text-zinc-500">Enterprise-grade encryption and privacy.</p>
                    </div>
                    <div className="glass-panel p-6 border-white/5 hover:border-cyan-500/30 transition-colors">
                        <Target className="w-8 h-8 text-red-500 mb-4 mx-auto" />
                        <h3 className="font-bold text-lg mb-2">Precision Data</h3>
                        <p className="text-xs text-zinc-500">Sentiment analysis and keyword tracking.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="btn-primary px-10 py-4 text-lg flex items-center justify-center gap-3 group"
                    >
                        Initialize System
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate("/pricing")}
                        className="px-10 py-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-zinc-400 font-bold tracking-widest uppercase text-sm"
                    >
                        View Protocols
                    </button>
                </div>
            </motion.div>

            <footer className="absolute bottom-8 text-center w-full z-10 opacity-30">
                <p className="text-[10px] uppercase tracking-[0.5em]">ThreadSense Intelligence Corp © 2026</p>
            </footer>
        </div>
    );
}
