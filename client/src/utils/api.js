import axios from 'axios';
import { getToken } from './auth';

let backendUrl = import.meta.env.VITE_API_URL || '/api';
if (backendUrl.startsWith('http') && !backendUrl.endsWith('/api')) {
    backendUrl = backendUrl.replace(/\/+$/, '') + '/api';
}

const api = axios.create({
    baseURL: backendUrl,
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;