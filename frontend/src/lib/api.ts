import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getFileUrl = (path: string | null | undefined) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("blob:")) return path;
    if (path.startsWith("/images/")) return path; // Skip api prefix for frontend public images
    const baseUrl = API_BASE_URL.replace("/api", "");
    return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        if (session?.user?.accessToken) {
            config.headers.Authorization = `Bearer ${session.user.accessToken}`;
        }

        // If body is FormData, remove the default JSON Content-Type so axios
        // can set multipart/form-data with the correct boundary automatically.
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // We removed the automatic signOut & redirect to /login here
            // so users can freely browse public pages without forced redirects
            if (typeof window !== "undefined") {
                // If we want to clear a bad session without redirecting:
                // signOut({ redirect: false });
            }
        }
        return Promise.reject(error);
    }
);

export default api;
