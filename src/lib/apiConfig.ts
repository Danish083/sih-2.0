export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const WS_URL = API_BASE.replace(/^https?:/, 'ws');
