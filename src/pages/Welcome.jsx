import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ThreadSenseLogo3D from "../components/ThreadSenseLogo3D";

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
                <div className="relative flex justify-center mb-8 h-56 w-56 md:h-72 md:w-72 mx-auto">
                    <ThreadSenseLogo3D />
                </div>
                <h1 className="text-4xl md:text-9xl font-black tracking-tighter mb-8 md:mb-12">
                    THREAD<span className="text-cyan-500 text-shadow-neon">SENSE</span>
                </h1>

                <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="btn-primary w-full md:w-auto px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl flex items-center justify-center gap-3 group min-w-[200px] md:min-w-[240px]"
                    >
                        Initialize
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all text-white font-bold tracking-widest uppercase text-xs md:text-sm flex items-center justify-center gap-3 group min-w-[200px] md:min-w-[240px]"
                    >
                        Request Access
                    </button>
                    <button
                        onClick={() => navigate("/pricing")}
                        className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 rounded-2xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-zinc-400 font-bold tracking-widest uppercase text-xs md:text-sm min-w-[200px] md:min-w-[240px]"
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
