const host = typeof window !== "undefined" ? window.location.hostname : "";
const isVercel = /\.vercel\.app$/.test(host);
export const API = isVercel ? "" : (import.meta.env.VITE_API_URL || "https://thread-sense-api.onrender.com");
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
    || "1069871585161-2msu0pn40pkimlk1ongbasesjfbl2qf2.apps.googleusercontent.com";
export const FOOTER_NAME = import.meta.env.VITE_FOOTER_NAME || "Asish Ranjan Sahu";
