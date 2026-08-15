import axios from 'axios';

// Falls back to whatever host the page itself was loaded from (not a hardcoded
// "localhost"), so the same build works from other devices on the LAN too —
// e.g. loading the app at http://192.168.1.10:5173 talks to the API at
// http://192.168.1.10:4000/api without any per-device config.
const baseURL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000/api`;

export const api = axios.create({ baseURL });
