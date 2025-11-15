export const API_BASE = import.meta.env.VITE_API_URL;
export const WS_URL = API_BASE.replace(/^https?:\/\//, API_BASE.startsWith('https://') ? 'wss://' : 'ws://');
