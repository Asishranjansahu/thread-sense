export const API = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL || "https://thread-sense-api.onrender.com")
    : `http://${window.location.hostname}:5050`;
export const GOOGLE_CLIENT_ID = "1069871585161-2msu0pn40pkimlk1ongbasesjfbl2qf2.apps.googleusercontent.com";
