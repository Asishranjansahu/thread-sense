export const API = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL || "https://thread-sense.onrender.com")
    : "http://192.168.1.11:5050";
export const GOOGLE_CLIENT_ID = "1069871585161-2msu0pn40pkimlk1ongbasesjfbl2qf2.apps.googleusercontent.com";
