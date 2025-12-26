// API Configuration

// In Vite, environment variables are available via import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const apiConfig = {
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
};

export const getAuthHeaders = (token?: string) => {
    const headers = { ...apiConfig.headers };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

export const API_ENDPOINTS = {
    auth: {
        login: "/auth/login",
        register: "/auth/register",
    },
    instituicoes: {
        list: "/instituicoes",
        getById: (id: number) => `/instituicoes/${id}`,
        create: "/instituicoes",
        update: (id: number) => `/instituicoes/${id}`,
    },
};
