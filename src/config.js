const host = typeof window !== "undefined" ? window.location.hostname : "";
const isVercel = /\.vercel\.app$/.test(host);
export const API = isVercel ? "" : (import.meta.env.VITE_API_URL || "https://thread-sense-api.onrender.com");
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
    || "1069871585161-gcmr3nj57op7at470u49gtq1n1bh1u59.apps.googleusercontent.com";
export const FOOTER_NAME = import.meta.env.VITE_FOOTER_NAME || "Asish Ranjan Sahu";
