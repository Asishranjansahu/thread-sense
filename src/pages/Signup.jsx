import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, Lock, Mail, ArrowRight, Loader } from "lucide-react";
import { API } from "../config";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error("Server Error (Is Backend Running?): " + text.substring(0, 100)); // Show preview of HTML error
            }

            if (!res.ok) throw new Error(data.error || "Registration failed");

            login(data.user, data.token);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-black">
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="glass-panel w-full max-w-md p-8 md:p-10 border border-white/5 bg-zinc-900/60 backdrop-blur-2xl">
                <div className="text-center mb-8">
                    <h1 className="h1-glow text-3xl md:text-4xl mb-2">Initialize</h1>
                    <p className="text-zinc-500 text-sm">Create your digital footprint</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="label-tech">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                            <input
                                type="text"
                                className="cyber-input pl-10"
                                placeholder="CyberNomad"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="label-tech">Email Identity</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                            <input
                                type="email"
                                className="cyber-input pl-10"
                                placeholder="agent@threadsense.ai"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="label-tech">Security Access Key</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                            <input
                                type="password"
                                className="cyber-input pl-10"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 group mt-2"
                    >
                        {loading ? <Loader className="animate-spin w-4 h-4" /> : "Register System"}
                        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-zinc-500">
                    Already strictly authorized?{' '}
                    <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                        Access Terminal
                    </Link>
                </div>
            </div>
        </div>
    );
}
