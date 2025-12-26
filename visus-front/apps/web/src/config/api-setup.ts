import axios from "axios";
import { authStorage } from "../lib/api/auth";

export function setupApiClient() {
    axios.defaults.baseURL =
        import.meta.env.VITE_API_URL ?? "http://localhost:8080";

    axios.interceptors.request.use(
        (config) => {
            const token = authStorage.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error),
    );

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                authStorage.clear();
                if (
                    !window.location.pathname.startsWith("/_public") &&
                    !window.location.pathname.startsWith("/login")
                ) {
                    window.location.href = "/login";
                }
            }
            return Promise.reject(error);
        },
    );
}
