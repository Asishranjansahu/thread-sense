import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-center max-w-3xl"
            >
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-12">
                    THREAD<span className="text-cyan-500 text-shadow-neon">SENSE</span>
                </h1>

                <div className="flex flex-wrap gap-6 justify-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="btn-primary px-12 py-5 text-xl flex items-center justify-center gap-3 group min-w-[240px]"
                    >
                        Initialize
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all text-white font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-3 group min-w-[240px]"
                    >
                        Request Access
                    </button>
                    <button
                        onClick={() => navigate("/pricing")}
                        className="px-12 py-5 rounded-2xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-zinc-400 font-bold tracking-widest uppercase text-sm min-w-[240px]"
                    >
                        Protocols
                    </button>
                </div>
            </motion.div>

            <footer className="absolute bottom-8 text-center w-full z-10 opacity-30">
                <p className="text-[10px] uppercase tracking-[0.5em]">ThreadSense Intelligence Corp © 2026</p>
            </footer>
        </div>
    );
}
