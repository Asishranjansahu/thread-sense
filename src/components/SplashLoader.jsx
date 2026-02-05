import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashLoader({ onComplete }) {
    const [text, setText] = useState("");
    const fullText = "INITIALIZING THREAD SENSE NEURAL NETWORK...";

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) {
                clearInterval(interval);
                setTimeout(onComplete, 1000);
            }
        }, 40);
        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Background Neural Grid */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--neon-cyan)_0%,_transparent_70%)] opacity-10"></div>
                <div className="grid grid-cols-12 h-full w-full">
                    {[...Array(144)].map((_, i) => (
                        <div key={i} className="border-[0.5px] border-white/5 h-full w-full"></div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative flex flex-col items-center"
            >
                {/* Animated Rings */}
                <div className="relative w-48 h-48 mb-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/20"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 rounded-full border border-purple-500/30"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-8 rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_0_50px_rgba(0,243,255,0.2)]"
                    >
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </motion.div>
                </div>

                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black tracking-[0.5em] text-white">
                        THREAD<span className="text-cyan-500">SENSE</span>
                    </h1>
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-1 w-64 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2.5, ease: "easeInOut" }}
                                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                            />
                        </div>
                        <p className="text-[10px] font-mono tracking-widest text-cyan-500 uppercase opacity-80">
                            {text}<span className="animate-pulse">_</span>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Retro Scanline */}
            <div className="scanline"></div>
        </motion.div>
    );
}
