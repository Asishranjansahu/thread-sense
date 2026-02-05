import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, Lock, ArrowRight, Loader } from "lucide-react";
import { API } from "../config";

export default function Login() {
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
            const res = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error("Server Error: " + text.substring(0, 100));
            }

            if (!res.ok) throw new Error(data.error || "Login failed");

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
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="glass-panel w-full max-w-md p-8 md:p-10 border border-white/5 bg-zinc-900/60 backdrop-blur-2xl">
                <div className="text-center mb-8">
                    <h1 className="h1-glow text-3xl md:text-4xl mb-2">Welcome Back</h1>
                    <p className="text-zinc-500 text-sm">Access your neural dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="label-tech">Email Identity</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
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
                        className="btn-primary w-full flex items-center justify-center gap-2 group"
                    >
                        {loading ? <Loader className="animate-spin w-4 h-4" /> : "Initiate Login"}
                        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-zinc-500">
                    New to the system?{' '}
                    <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                        Register Identity
                    </Link>
                </div>
            </div>
        </div>
    );
}
