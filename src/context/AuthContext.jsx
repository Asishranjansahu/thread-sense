import { createContext, useState, useEffect } from "react";
import { API } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        // Handle Guest Session locally
        if (token === "guest-demo-token") {
            setUser({
                _id: "guest-id",
                name: "Demo User",
                email: "demo@threadsense.ai",
                role: "user",
                isGuest: true
            });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
            } else {
                localStorage.removeItem("token");
            }
        } catch (err) {
            console.error(err);
            localStorage.removeItem("token");
        }
        setLoading(false);
    };

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        setUser(userData);

        // LOGIN SYNC: In production, replace string below with your fixed Extension ID
        const EXTENSION_ID = "YOUR_EXTENSION_ID_HERE";
        try {
            if (window.chrome && chrome.runtime) {
                chrome.runtime.sendMessage(EXTENSION_ID, { type: "LOGIN_SYNC", token });
            }
        } catch (e) { console.log("Extension not detected or ID mismatch"); }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const loginAsGuest = () => {
        const guestUser = {
            _id: "guest-id",
            name: "Demo User",
            email: "demo@threadsense.ai",
            role: "user",
            isGuest: true
        };
        localStorage.setItem("token", "guest-demo-token");
        setUser(guestUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loginAsGuest, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
