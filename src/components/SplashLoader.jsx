import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import ThreadSenseLogo3D from "./ThreadSenseLogo3D";

export default function SplashLoader({ onComplete }) {
    const [started, setStarted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("AWAITING NEURAL HANDSHAKE...");
    const audioCtxRef = useRef(null);

    // --- SOUND ENGINE ---
    const playStartupSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            audioCtxRef.current = ctx;

            // Master Gain
            const masterGain = ctx.createGain();
            // Start silent to prevent pop, ramp up
            masterGain.gain.setValueAtTime(0, ctx.currentTime);
            masterGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
            masterGain.connect(ctx.destination);

            // 1. Drone Bass (Power Up - Deeper & Louder)
            const osc = ctx.createOscillator();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(40, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 2.5);

            const oscGain = ctx.createGain();
            oscGain.gain.setValueAtTime(0, ctx.currentTime);
            oscGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.5);
            oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3);

            osc.connect(oscGain);
            oscGain.connect(masterGain);
            osc.start();
            osc.stop(ctx.currentTime + 3.5);

            // 2. High Tech Bleeps (Data Processing - Sharper)
            const bleepOsc = ctx.createOscillator();
            bleepOsc.type = "square";

            const bleepGain = ctx.createGain();
            bleepGain.gain.setValueAtTime(0, ctx.currentTime);

            bleepOsc.connect(bleepGain);
            bleepGain.connect(masterGain);
            bleepOsc.start();

            // Sci-fi arpeggio sequence
            const notes = [440, 880, 1760, 440, 880, 2200, 110, 880];
            notes.forEach((freq, i) => {
                const time = ctx.currentTime + 0.2 + (i * 0.12);
                bleepOsc.frequency.setValueAtTime(freq, time);
                bleepGain.gain.setValueAtTime(0.15, time);
                bleepGain.gain.setValueAtTime(0, time + 0.1);
            });
            bleepOsc.stop(ctx.currentTime + 2);

            // 3. Final Impact Swish (System Online)
            setTimeout(() => {
                const swish = ctx.createOscillator();
                swish.type = "sine";
                swish.frequency.setValueAtTime(80, ctx.currentTime);
                swish.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.4);

                const swishGain = ctx.createGain();
                swishGain.gain.setValueAtTime(0, ctx.currentTime);
                swishGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
                swishGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

                swish.connect(swishGain);
                swishGain.connect(masterGain);
                swish.start();
                swish.stop(ctx.currentTime + 0.7);
            }, 2200);

        } catch (e) {
            console.error("Audio Playback Error:", e);
        }
    };

    const startSequence = () => {
        setStarted(true);
        playStartupSound();
    };

    useEffect(() => {
        if (!started) return;

        const statuses = [
            "ESTABLISHING NEURAL HANDSHAKE...",
            "DECRYPTING SECURE PROTOCOLS...",
            "SYNCING OPERATIVE DATABASE...",
            "OPTIMIZING VISUAL CORTEX...",
            "ACCESS GRANTED."
        ];

        let i = 0;
        const interval = setInterval(() => {
            setProgress(prev => Math.min(prev + Math.random() * 8, 100)); // Slower visual progress to match sound
        }, 100);

        const statusInterval = setInterval(() => {
            i = (i + 1) % statuses.length;
            setStatus(statuses[i]);
        }, 600);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            clearInterval(statusInterval);
            setProgress(100);
            setStatus("SYSTEM ONLINE");
            setTimeout(onComplete, 800);
        }, 3200); // 3.2s total duration to match audio

        return () => {
            clearInterval(interval);
            clearInterval(statusInterval);
            clearTimeout(timeout);
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, [started, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden cursor-pointer"
            onClick={!started ? startSequence : undefined}
        >
            {/* Background Neural Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--neon-cyan)_0%,_transparent_60%)] opacity-20 animate-pulse"></div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(50px,1fr))] grid-rows-[repeat(auto-fill,minmax(50px,1fr))] h-full w-full">
                    {[...Array(100)].map((_, i) => (
                        <div key={i} className="border-[0.5px] border-cyan-500/10 h-full w-full"></div>
                    ))}
                </div>
            </div>

            <motion.div
                layout
                className="relative flex flex-col items-center z-10"
            >
                {/* Visual Core */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 mb-8">
                    <ThreadSenseLogo3D />
                </div>

                {/* Typography & Status */}
                <div className="text-center space-y-6 w-80 md:w-96">
                    <h1 className="text-4xl md:text-5xl font-black text-white relative">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white">THREAD</span>
                        <span className={`${started ? 'text-cyan-500 text-shadow-neon' : 'text-zinc-600'}`}>SENSE</span>
                    </h1>

                    {!started ? (
                        <div className="animate-pulse">
                            <p className="text-xs font-mono text-cyan-400 tracking-[0.3em] uppercase border border-cyan-500/30 py-3 px-6 rounded-lg bg-cyan-500/5 backdrop-blur-md">
                                [ Tap to Initialize System ]
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                                <motion.div
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 shadow-[0_0_15px_#00f3ff]"
                                />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-widest text-cyan-400">
                                <span>{status}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* CRT Effects */}
            <div className="scanline"></div>
            <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-200 contrast-200"></div>
        </motion.div>
    );
}
