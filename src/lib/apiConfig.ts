export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const WS_URL = API_BASE.replace(/^https?:\/\//, API_BASE.startsWith('https://') ? 'wss://' : 'ws://');
