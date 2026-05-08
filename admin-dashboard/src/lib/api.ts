import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use(async (config) => {
    if (typeof window !== 'undefined') {
        const session: any = await getSession();
        if (session?.jwt) {
            config.headers.Authorization = `Bearer ${session.jwt}`;
        }
    }
    return config;
});

export const getFileUrl = (path: string | null | undefined) => {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    if (path.startsWith("blob:")) return path;
    const baseUrl = API_BASE_URL;
    return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default api;
