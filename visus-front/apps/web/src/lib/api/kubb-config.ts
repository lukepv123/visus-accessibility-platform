import type { AxiosRequestConfig } from "axios";
import { authStorage } from "./auth";

/**
 * Custom Axios configuration for Kubb-generated API client
 * Automatically adds authentication headers to all requests
 */
export function createAuthConfig(): Partial<AxiosRequestConfig> {
    const token = authStorage.getToken();

    const config: Partial<AxiosRequestConfig> = {
        baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
        headers: {},
    };

    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    return config;
}

/**
 * Get axios config with auth headers for API requests
 * Use this when calling Kubb-generated API functions
 */
export function getApiConfig(): Partial<AxiosRequestConfig> {
    return createAuthConfig();
}
